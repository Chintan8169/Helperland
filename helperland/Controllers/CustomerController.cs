using helperland.Models;
using helperland.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace helperland.Controllers;

[Authorize(Roles = "Admin,Customer")]
public class CustomerController : Controller
{
	private readonly HelperlandContext context;
	private readonly UserManager<User> userManager;
	private readonly RoleManager<IdentityRole> roleManager;
	private readonly Email email;

	public CustomerController(HelperlandContext context, UserManager<User> userManager, RoleManager<IdentityRole> roleManager, Email email)
	{
		this.context = context;
		this.userManager = userManager;
		this.roleManager = roleManager;
		this.email = email;
	}

	[HttpGet]
	public async Task<IActionResult> Profile()
	{
		var user = await userManager.GetUserAsync(User);
		var Details = new Details()
		{
			Email = user.Email,
			FirstName = user.FirstName,
			LastName = user.LastName,
			PhoneNumber = user.PhoneNumber
		};
		if (user.DateOfBirth != null)
		{
			Details.Day = user.DateOfBirth.Value.Day;
			Details.Month = user.DateOfBirth.Value.Month;
			Details.Year = user.DateOfBirth.Value.Year;
		}
		if (user.Language != null)
		{
			Details.Language = user.Language;
		}
		CustomerSettingsViewModel model = new CustomerSettingsViewModel()
		{
			Details = Details
		};
		return View(model);
	}
	[HttpGet]
	public async Task<IActionResult> Dashboard()
	{
		var user = await userManager.GetUserAsync(User);
		IEnumerable<CustomerServiceHistoryViewModel> result = (
			from s in context.ServiceRequests
			join u in context.Users
			on s.ServiceProviderId equals u.Id into x
			from sr in x.DefaultIfEmpty()
			where s.UserId == user.Id && (s.Status == 1 || s.Status == 2)
			select new CustomerServiceHistoryViewModel
			{
				ServiceId = s.ServiceId,
				ServiceStartTime = s.ServiceStartDate,
				ServiceHours = s.ServiceHours,
				ServiceProviderId = s.ServiceProviderId,
				ServiceProviderName = sr.FirstName + " " + sr.LastName,
				ServiceProviderProfilePicture = sr.UserProfilePhoto,
				Payment = s.TotalCost,
				Status = s.Status
			}
			).ToList();
		if (result.Count() > 0)
		{
			IEnumerable<string> distinctServiceProviders = result.Where(x => x.ServiceProviderId != null).Select(x => x.ServiceProviderId).Distinct();
			if (distinctServiceProviders.Count() > 0)
			{
				foreach (var serviceProviderId in distinctServiceProviders)
				{
					var ratings = context.Ratings.Where(rating => rating.RatingTo == serviceProviderId).ToList();
					if (ratings.Count() > 0)
					{
						var avgRating = ratings.Average(r => r.Ratings);
						// var servicesWithSP = result.Where(x => x.ServiceProviderId == serviceProviderId).ToList();
						foreach (var model in result)
						{
							if (model.ServiceProviderId == serviceProviderId) model.AvgRating = avgRating;
						}
					}
				}
			}
		}
		return View(result);
	}
	[HttpPost]
	public async Task<IActionResult> CancelService([FromBody] CancelServiceViewModel model)
	{
		try
		{
			var user = await userManager.GetUserAsync(User);
			if (user != null)
			{
				var service = context.ServiceRequests.Where(s => s.UserId == user.Id && s.ServiceId == model.ServiceId).FirstOrDefault();
				if (service != null)
				{
					service.Status = 4;
					service.Comments = model.CancelReason;
					context.ServiceRequests.Attach(service);
					context.SaveChanges();
					return Json(new { success = "Successfully Cancelled Service !" });
				}
			}
			return Json(new { err = "Service Not Found !" });
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json(new { err = "Internal Server Error !" });
		}
	}
	[HttpPost]
	public async Task<IActionResult> RescheduleService([FromBody] RescheduleServiceViewModel model)
	{
		try
		{
			var user = await userManager.GetUserAsync(User);
			if (user != null)
			{

				var service = context.ServiceRequests.Where(s => s.UserId == user.Id && s.ServiceId == model.ServiceId).FirstOrDefault();
				if (service != null)
				{
					DateTime newServiceDate = DateTime.Parse(model.NewServiceDate).AddHours((double)model.NewServiceStartTime);
					if (newServiceDate.CompareTo(service.ServiceStartDate) == 0)
					{
						return Json(new { err = "This selected time is same !" });
					}
					DateTime newServiceEnd = newServiceDate.AddHours(service.ServiceHours);
					if (newServiceEnd.Hour + newServiceEnd.Minute / 60 > 21)
					{
						return Json(new { err = "Rescheduled Time is greater than 9:00 PM !" });
					}
					else if (DateTime.Now.CompareTo(newServiceDate) > 0)
					{
						return Json(new { err = "Rescheduled Time is is already passed !" });
					}
					else if (!String.IsNullOrEmpty(service.ServiceProviderId))
					{
						var services = context.ServiceRequests.Where(s => s.ServiceProviderId == service.ServiceProviderId && s.Status == 2 && s.ServiceRequestId != service.ServiceRequestId && s.ServiceStartDate.Date == newServiceDate.Date && s.ServiceStartDate.Month == newServiceDate.Month && s.ServiceStartDate.Year == newServiceDate.Year).ToList();
						if (services.Count() > 0)
						{
							foreach (var s in services)
							{
								var tempServiceStart = s.ServiceStartDate;
								var tempServiceEnd = s.ServiceStartDate.AddHours((double)(service.ServiceHours + 1));
								if ((newServiceEnd.CompareTo(tempServiceStart) > 0 && newServiceEnd.CompareTo(tempServiceEnd) <= 0) || (newServiceDate.CompareTo(tempServiceStart) >= 0 && newServiceDate.CompareTo(tempServiceEnd) < 0) || ((tempServiceStart.CompareTo(newServiceDate) >= 0 && tempServiceEnd.CompareTo(newServiceEnd) < 0)))
								{
									return Json(new
									{
										err = "Another service request has been assigned to the service provider on " + tempServiceStart.ToString("dd/MM/yyyy") +
									" from " + tempServiceStart.ToString("HH/mm") + " to " + tempServiceEnd.AddHours(-1).ToString("HH/mm") + ". Either choose another date or pick up a different time slot."
									});
								}
							}
						}
					}
					service.ServiceStartDate = newServiceDate;
					service.RecordVersion = Guid.NewGuid();
					service.ModifiedBy = user.Id;
					service.ModifiedDate = DateTime.Now;
					context.ServiceRequests.Attach(service);
					context.SaveChanges();
#nullable disable
					if (!String.IsNullOrEmpty(service.ServiceProviderId)) email.SendMail(new SendMailViewModel()
					{
						Subject = "Reschedule Service",
						IsBodyHtml = true,
						To = new List<string>() { context.Users.Where(u => u.Id == service.ServiceProviderId).Select(u => u.Email).FirstOrDefault() },
						Body = @$"
							<h1 style='font-size:35px;'>Greetings,</h1>
							<div style='font-size:25px;'>Service Request <b>{service.ServiceId}</b> is Rescheduled to <b>{service.ServiceStartDate.ToString("dd/MM/yyyy HH:mm").Replace("-", "/")}</b></div>"
					});
#nullable enable
					return Json(new { success = "Successfully Rescheduled Service !!" });
				}
			}
			return Json(new { err = "Service Not Found !" });
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json(new { err = "Internal Server Error !" });
		}
	}
	[HttpGet]
	public async Task<IActionResult> GetServiceDetails(int serviceId)
	{
		try
		{
			var user = await userManager.GetUserAsync(User);
			if (user != null)
			{
				var service = (
					from s in context.ServiceRequests
					join sa in context.ServiceRequestAddresses
					on s.ServiceRequestId equals sa.ServiceRequestId
					where s.ServiceId == serviceId
					select new { s, sa }
				).FirstOrDefault();
				if (service != null)
				{

					var serviceExtra = context.ServiceRequestExtras.Where(se => se.ServiceRequestId == service.s.ServiceRequestId).Select(sea => sea.ServiceExtraId).ToArray();
					var jsonData = new
					{
						Extras = serviceExtra,
						Duration = service.s.ServiceHours,
						ServiceStreetName = service.sa.AddressLine1,
						ServiceHouseNumber = service.sa.AddressLine2,
						PostalCode = service.sa.PostalCode,
						City = service.sa.City,
						PhoneNumber = service.sa.Mobile,
						Email = service.sa.Email,
						Comments = service.s.Comments,
						HasPets = service.s.HasPets,
						TotalCleaning = context.ServiceRequests.Where(s => s.ServiceProviderId == service.s.ServiceProviderId && s.Status == 3).Count()
					};
					return Json(jsonData);
				}
			}
			return Json(new { err = "Service Not Found !" });
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json(new { err = "Internal Server Error !" });
		}
	}
	[HttpGet]
	public async Task<IActionResult> ServiceHistory()
	{
		var user = await userManager.GetUserAsync(User);
		IEnumerable<CustomerServiceHistoryViewModel> result = (
			from s in context.ServiceRequests
			join u in context.Users
			on s.ServiceProviderId equals u.Id into x
			from sr in x.DefaultIfEmpty()
			where s.UserId == user.Id && (s.Status == 4 || s.Status == 3)
			select new CustomerServiceHistoryViewModel
			{
				ServiceId = s.ServiceId,
				ServiceStartTime = s.ServiceStartDate,
				ServiceHours = s.ServiceHours,
				ServiceProviderId = s.ServiceProviderId,
				ServiceProviderName = sr.FirstName + " " + sr.LastName,
				ServiceProviderProfilePicture = sr.UserProfilePhoto,
				Payment = s.TotalCost,
				Status = s.Status
			}
			).ToList();
		if (result.Count() > 0)
		{
			IEnumerable<string> distinctServiceProviders = result.Where(x => x.ServiceProviderId != null).Select(x => x.ServiceProviderId).Distinct();
			if (distinctServiceProviders.Count() > 0)
			{
				foreach (var serviceProviderId in distinctServiceProviders)
				{
					var ratings = context.Ratings.Where(rating => rating.RatingTo == serviceProviderId).ToList();
					if (ratings.Count() > 0)
					{
						var avgRating = ratings.Average(r => r.Ratings);
						// var servicesWithSP = result.Where(x => x.ServiceProviderId == serviceProviderId).ToList();
						foreach (var model in result)
						{
							if (model.ServiceProviderId == serviceProviderId)
								model.AvgRating = avgRating;
						}
					}
				}
			}
		}
		return View(result);
	}
	[HttpPost]
	public async Task<IActionResult> UpdateDetails([FromBody] Details model)
	{
		try
		{
			var user = await userManager.GetUserAsync(User);
			if (user != null)
			{
				user.FirstName = model.FirstName;
				user.LastName = model.LastName;
				user.PhoneNumber = model.PhoneNumber;
				user.DateOfBirth = new DateTime(model.Year, model.Month, model.Day);
				user.Language = model.Language;
				user.ModifiedDate = DateTime.Now;
				user.ModifiedBy = user.Id;
				await userManager.UpdateAsync(user);
				return Json(new { success = "Details Updated Successfully !" });
			}
			throw new Exception();
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json(new { err = "Internal Server Error ! Please Try Again Later !" });
		}
	}
	[HttpGet]
	public IActionResult BookService()
	{
		return View();
	}
	[HttpPost]
	public async Task<IActionResult> BookService([FromBody] BookServiceSubmitViewModel model)
	{
		var newServiceRequest = new ServiceRequest();
		try
		{
			int random = new Random().Next(1000, 9999);
			var isExist = context.ServiceRequests.Where(x => x.ServiceId == random).FirstOrDefault();
			while (isExist != null)
			{
				random = new Random().Next(1000, 9999);
				isExist = context.ServiceRequests.Where(x => x.ServiceId == random).FirstOrDefault();
			}
			var user = await userManager.GetUserAsync(User);
			newServiceRequest.ServiceId = random;
			newServiceRequest.UserId = user.Id;
			newServiceRequest.ZipCode = model.ZipCode;
			newServiceRequest.PaymentDue = false;
			newServiceRequest.ServiceHours = model.ServiceBasicHours;
			newServiceRequest.HasPets = model.HasPets;
			newServiceRequest.CreatedDate = DateTime.Now;
			newServiceRequest.ModifiedBy = user.Id;
			newServiceRequest.ModifiedDate = DateTime.Now;
			newServiceRequest.Distance = 0;
			newServiceRequest.Status = 1;
			newServiceRequest.RecordVersion = Guid.NewGuid();

			if (model.ExtraServices != null)
			{
				newServiceRequest.ServiceHours += model.ExtraServices.Count() * 0.5;
			}
			newServiceRequest.SubTotal = ((decimal)((newServiceRequest.ServiceHours) * 18));
			newServiceRequest.TotalCost = newServiceRequest.SubTotal;
			if (model.Comments != null)
			{
				newServiceRequest.Comments = model.Comments;
			}
			var s = model.ServiceDate.Split("/");
			double x = model.ServiceStartTime;
			int hours = ((int)Math.Floor(x));
			int min = ((int)Math.Ceiling((x - hours) * 60));
			var d = new DateTime(Int32.Parse(s[2]), Int32.Parse(s[1]), Int32.Parse(s[0]), hours, min, 0);
			newServiceRequest.ServiceStartDate = d;
			if (model.ServiceProviderId != null)
			{
				var newServiceDate = newServiceRequest.ServiceStartDate;
				var services = context.ServiceRequests.Where(s => s.ServiceProviderId == model.ServiceProviderId && s.Status == 2 && s.ServiceStartDate.Date == newServiceDate.Date && s.ServiceStartDate.Month == newServiceDate.Month && s.ServiceStartDate.Year == newServiceDate.Year).ToList();
				if (services.Count() > 0)
				{
					var newServiceEnd = newServiceRequest.ServiceStartDate.AddHours((double)newServiceRequest.TotalCost);
					foreach (var st in services)
					{
						var tempServiceStart = st.ServiceStartDate;
						var tempServiceEnd = st.ServiceStartDate.AddHours((double)(newServiceRequest.ServiceHours + 1));
						if ((newServiceEnd.CompareTo(tempServiceStart) > 0 && newServiceEnd.CompareTo(tempServiceEnd) <= 0) || (newServiceDate.CompareTo(tempServiceStart) >= 0 && newServiceDate.CompareTo(tempServiceEnd) < 0) || ((tempServiceStart.CompareTo(newServiceDate) >= 0 && tempServiceEnd.CompareTo(newServiceEnd) < 0)))
						{
							return Json(new
							{
								err = "Another service request has been assigned to the service provider on " + tempServiceStart.ToString("dd/MM/yyyy") +
							" from " + tempServiceStart.ToString("HH/mm") + " to " + tempServiceEnd.AddHours(-1).ToString("HH/mm") + ". Either choose another date or pick up a different time slot."
							});
						}
					}
				}
				newServiceRequest.ServiceProviderId = model.ServiceProviderId;
				newServiceRequest.SpacceptedDate = DateTime.Now;
				newServiceRequest.Status = 2;
			}
			context.ServiceRequests.Add(newServiceRequest);
			context.SaveChanges();
			var custAddress = context.UserAddresses.Where(a => a.AddressId == model.AddressId && a.UserId == user.Id).FirstOrDefault();
			if (custAddress != null)
			{
				var newServiceRequestAddress = new ServiceRequestAddress()
				{
					ServiceRequestId = newServiceRequest.ServiceRequestId,
					AddressLine1 = custAddress.AddressLine1,
					AddressLine2 = custAddress.AddressLine2,
					City = custAddress.City,
					State = custAddress.State,
					PostalCode = custAddress.PostalCode,
					Mobile = custAddress.Mobile,
					Email = custAddress.Email
				};
				context.ServiceRequestAddresses.Add(newServiceRequestAddress);
			}
			else throw new Exception("Address Not Found !");
			if (model.ExtraServices != null)
			{
				foreach (var extra in model.ExtraServices)
				{
					var extraService = new ServiceRequestExtra()
					{
						ServiceRequestId = newServiceRequest.ServiceRequestId,
						ServiceExtraId = extra
					};
					context.ServiceRequestExtras.Add(extraService);
				}
			}
			context.SaveChanges();
#nullable disable
			var sps = context.Users.Where(u => u.UserTypeId == 2 && u.ZipCode == model.ZipCode).ToList();
			var blockedsps = context.FavoriteAndBlocked.Where(fab => fab.UserId == user.Id && fab.IsBlocked).Select(fab => fab.TargetUserId).Distinct().ToList().Concat(context.FavoriteAndBlocked.Where(fab => fab.TargetUserId == user.Id && fab.IsBlocked).Select(fab => fab.UserId).Distinct()).ToList();
			List<string> spEmails = new List<string>();
			foreach (var sp in blockedsps) sps.Remove(sps.Find(u => u.Id == sp));
			foreach (var sp in sps) spEmails.Add(sp.Email);
			if (spEmails.Count() <= 0) return Json(new { err = "There is no service provider providing services in your area !" });
			email.SendMail(new SendMailViewModel
			{
				Subject = "New Service",
				IsBodyHtml = true,
				Body = @$"
					<h1 style='font-size:35px;'>Greetings</h1>
					<p style='font-size:25px;'>New Service is booked with ServiceId {newServiceRequest.ServiceId}</p>
				",
				To = spEmails
			});
			return Json(new { ServiceId = newServiceRequest.ServiceId });
		}
		catch (Exception e)
		{
			if (newServiceRequest.ServiceRequestId != 0)
			{
				context.ServiceRequests.Remove(newServiceRequest);
				context.SaveChanges();
			}
			Console.WriteLine(e.Message);
			return Json(new { err = "Internal Server Error !" });
		}
#nullable enable
	}
	[HttpGet]
	public async Task<IActionResult> IsRatingGiven(int ServiceId, string ServiceProviderId)
	{
		try
		{
			var user = await userManager.GetUserAsync(User);
			if (user != null)
			{
				var serviceRequest = context.ServiceRequests.Where(s => s.ServiceId == ServiceId && s.UserId == user.Id).FirstOrDefault();
				if (serviceRequest != null)
				{
					var result = context.Ratings.Where(r => r.RatingFrom == user.Id && r.RatingTo == ServiceProviderId && r.ServiceRequestId == serviceRequest.ServiceRequestId).FirstOrDefault();
					if (result != null)
					{
						return Json(new
						{
							err = true,
							OnTimeArrival = result.OnTimeArrival,
							Friendly = result.Friendly,
							QualityOfService = result.QualityOfService,
							Comments = result.Comments
						});
					}
					else
					{
						return Json(new { success = "No Rating Has Given !!" });
					}
				}
			}
			return Json(new { err = "Service Request Not Found !!" });
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json(new { err = "Internal Server Error !" });
		}
	}
	[HttpPost]
	public async Task<IActionResult> GiveRating([FromBody] RatingViewModel model)
	{
		try
		{
			var user = await userManager.GetUserAsync(User);
			if (user != null)
			{
				var service = context.ServiceRequests.Where(s => s.ServiceId == model.ServiceId).FirstOrDefault();
				if (service != null)
				{
					decimal AverageRating = Math.Round(((decimal)model.FriendlyRating + (decimal)model.QualityOfServiceRating + (decimal)model.OnTimeArrivalRating) / (decimal)3, 2);
					var newRating = new Rating()
					{
						RatingFrom = user.Id,
						RatingTo = model.ServiceProviderId,
						ServiceRequestId = service.ServiceRequestId,
						Friendly = model.FriendlyRating,
						QualityOfService = model.QualityOfServiceRating,
						OnTimeArrival = model.OnTimeArrivalRating,
						RatingDate = DateTime.Now,
						Ratings = AverageRating
					};
					if (model.Comments != null)
					{
						newRating.Comments = model.Comments;
					}
					context.Add(newRating);
					context.SaveChanges();
					return Json(new { success = "Rating Saved Successfully !!" });
				}
			}
			return Json(new { err = "Service Not Found !" });
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json(new { err = "Internal Server Error !!" });
		}
	}
	[HttpGet]
	public async Task<IActionResult> MakeAddressDefault(int? addressId)
	{
		try
		{
			var user = await userManager.GetUserAsync(User);
			if (addressId != null)
			{
				var address = context.UserAddresses.Where(a => a.UserId == user.Id && a.IsDefault).FirstOrDefault();
				if (address != null)
				{
					address.IsDefault = false;
					var newAddress = context.UserAddresses.Where(a => a.UserId == user.Id && a.AddressId == addressId).FirstOrDefault();
					if (newAddress != null)
					{
						if (newAddress.AddressId == address.AddressId)
						{
							return Json(new { err = "This is already your default address !" });
						}
						newAddress.IsDefault = true;
						context.SaveChanges();
						return Json(new { success = "Successfully Changed Default Address !" });
					}
					return Json(new { err = "Address Not Found !" });
				}
			}
			return Json(new { err = "Address Not Found !" });
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json(new { err = "Internal Server Error !" });
		}
	}
	[HttpGet]
	public async Task<IActionResult> DeleteAddress(int? addressId)
	{
		try
		{
			var user = await userManager.GetUserAsync(User);
			if (addressId != null)
			{
				var address = context.UserAddresses.Where(a => a.UserId == user.Id && a.AddressId == addressId).FirstOrDefault();
				if (address != null)
				{
					if (address.IsDefault)
					{
						return Json(new { err = "To delete this address kindly change your default address to another address !" });
					}
					else if (address.IsDeleted)
					{
						return Json(new { err = "This address is already deleted !" });
					}
					address.IsDeleted = true;
					context.SaveChanges();
					return Json(new { success = "Successfully Deleted Address !" });
				}
			}
			return Json(new { err = "Address Not Found !" });
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json(new { err = "Internal Server Error !" });
		}
	}
	[HttpGet]
	public async Task<JsonResult> CheckAvailability(string ZipCode)
	{
#nullable disable
		var user = await userManager.GetUserAsync(User);
		if (ZipCode != null)
		{
			var sps = context.Users.Where(u => u.UserTypeId == 2 && u.ZipCode == ZipCode).ToList();
			var blockedsps = context.FavoriteAndBlocked.Where(fab => fab.UserId == user.Id && fab.IsBlocked).Select(fab => fab.TargetUserId).Distinct().ToList().Concat(context.FavoriteAndBlocked.Where(fab => fab.TargetUserId == user.Id && fab.IsBlocked).Select(fab => fab.UserId).Distinct()).ToList();
			foreach (var sp in blockedsps) sps.Remove(sps.Where(u => u.Id == sp).FirstOrDefault());
			if (sps != null && sps.Count() > 0)
			{
				var city = (
					from z in context.ZipCodes
					join c in context.Cities
					on z.CityId equals c.CityId
					where z.ZipCodeValue == ZipCode
					select c.CityName
				).FirstOrDefault();
				return Json(new { CityName = city });
			}
		}
		return Json(false);
#nullable enable
	}
	[HttpPost]
	public async Task<IActionResult> AddNewAddress([FromBody] AddNewAddressViewModel model)
	{
		try
		{
			var user = await userManager.GetUserAsync(User);
			UserAddress newAddress = new UserAddress()
			{
				UserId = user.Id,
				AddressLine1 = model.StreetName,
				AddressLine2 = model.HouseNumber,
				City = model.City,
				PostalCode = model.PostalCode,
				IsDefault = false,
				IsDeleted = false,
				Mobile = model.PhoneNumber,
				Email = user.Email,
			};
			context.UserAddresses.Add(newAddress);
			var address = context.SaveChanges();
			return Json(new { addressId = newAddress.AddressId });
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json(new { error = "Internal Server Error !!" });
		}
	}
	[HttpPost]
	public async Task<IActionResult> UpdateAddress([FromBody] AddNewAddressViewModel model)
	{
		try
		{
			var user = await userManager.GetUserAsync(User);
			if (model.AddressId != null)
			{
				var newAddress = context.UserAddresses.Where(a => a.UserId == user.Id && a.AddressId == model.AddressId).FirstOrDefault();
				if (newAddress != null)
				{
					newAddress.AddressLine1 = model.StreetName;
					newAddress.AddressLine2 = model.HouseNumber;
					newAddress.City = model.City;
					newAddress.PostalCode = model.PostalCode;
					newAddress.Mobile = model.PhoneNumber;
					var address = context.SaveChanges();
					return Json(new { success = "Address Updated Successfully !" });
				}
			}
			return Json(new { err = "Address Not Found !!" });
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json(new { err = "Internal Server Error !!" });
		}
	}
	[HttpGet]
	public async Task<IActionResult> FavouriteAndBlocked()
	{
		var user = await userManager.GetUserAsync(User);
		var result = (
			from s in context.ServiceRequests
			join u in context.Users on new { ServiceProviderId = s.ServiceProviderId } equals new { ServiceProviderId = u.Id }
			join fab in context.FavoriteAndBlocked
				on new { s.UserId, s.ServiceProviderId }
				equals new { fab.UserId, ServiceProviderId = fab.TargetUserId } into fab_join
			from fab in fab_join.DefaultIfEmpty()
			join avgrt in (
			(
				from rt in context.Ratings
				group rt by new { rt.RatingTo } into g
				select new
				{
					AvgRatings = (decimal?)g.Average(p => p.Ratings),
					SPId = g.Key.RatingTo
				})) on new { ServiceProviderId = s.ServiceProviderId } equals new { ServiceProviderId = avgrt.SPId } into avgrt_join
			from avgrt in avgrt_join.DefaultIfEmpty()
			join totalservice in (
			(
				from st in context.ServiceRequests
				where
				st.Status == 3
				group st by new
				{
					st.ServiceProviderId
				} into g
				select new
				{
					TotalCleaning = g.Count(p => p.ServiceId != 0),
					tspid = g.Key.ServiceProviderId
				})) on new { ServiceProviderId = s.ServiceProviderId } equals new { ServiceProviderId = totalservice.tspid } into totalservice_join
			from totalservice in totalservice_join.DefaultIfEmpty()
			where s.Status == 3 && s.UserId == user.Id
			select new FavoriteAndBlockedViewModel
			{
				IsBlocked = fab.IsBlocked,
				TotalCleaning = totalservice.TotalCleaning,
				IsFavorite = fab.IsFavorite,
				FirstName = u.FirstName,
				LastName = u.LastName,
				SPId = s.ServiceProviderId,
				ProfilePhoto = u.UserProfilePhoto,
				AvgRatings = avgrt.AvgRatings != null ? (decimal)avgrt.AvgRatings : 0
			}).Distinct().ToList();
		foreach (var service in result.ToList())
		{
			var blockcust = context.FavoriteAndBlocked.Where(f => f.UserId == service.SPId && f.TargetUserId == user.Id && f.IsBlocked == true).FirstOrDefault();
			if (blockcust != null)
			{
				result.Remove(service);
			}
		}
		return View(result);
	}
	public async Task<IActionResult> GetAddresses(string? ZipCode)
	{
		var user = await userManager.GetUserAsync(User);
		IEnumerable<UserAddress> addresses;
		if (ZipCode != null)
			addresses = context.UserAddresses.Where(a => a.UserId == user.Id && a.PostalCode == ZipCode && a.IsDeleted != true).ToList();
		else
			addresses = context.UserAddresses.Where(a => a.UserId == user.Id && a.IsDeleted != true).ToList();
		IEnumerable<ReturnAddressViewModel> add = new List<ReturnAddressViewModel>();
		foreach (var a in addresses)
		{
			ReturnAddressViewModel temp = new ReturnAddressViewModel()
			{
				AddressId = a.AddressId,
				AddressLine1 = a.AddressLine1,
				AddressLine2 = a.AddressLine2,
				PostalCode = a.PostalCode,
				PhoneNumber = a.Mobile,
				City = a.City,
				IsDefault = a.IsDefault,
				IsDeleted = a.IsDeleted
			};
			add = add.Append(temp);
		}
		return Json(add);
	}

	[HttpPost]
	public async Task<IActionResult> ChangeBlockOrFavourite([FromBody] ChangeBlockOrFavouriteViewModel model)
	{
		try
		{
			var user = await userManager.GetUserAsync(User);
			var fab = context.FavoriteAndBlocked.Where(fab => fab.UserId == user.Id && fab.TargetUserId == model.SPId).FirstOrDefault();
			if (fab != null)
			{
				if (fab.IsFavorite && model.IsBlocked)
				{
					return Json(new { err = "You can't block sp who is in your favourite list !" });
				}
				if (fab.IsBlocked && model.IsFavourite || model.IsBlocked && model.IsFavourite)
				{
					return Json(new { err = "You can't block sp who is in your favourite list !" });
				}
				fab.IsBlocked = model.IsBlocked;
				fab.IsFavorite = model.IsFavourite;
				context.Attach(fab);
			}
			else
			{
				var newFab = new FavoriteAndBlocked()
				{
					UserId = user.Id,
					TargetUserId = model.SPId,
					IsBlocked = model.IsBlocked,
					IsFavorite = model.IsFavourite,
				};
				context.FavoriteAndBlocked.Add(newFab);
			}
			context.SaveChanges();
			return Json(new { success = "Operation Successful !" });
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json(new { err = "Internal Server Error !!" });
		}
	}

	public async Task<IActionResult> GetFavouriteProviders()
	{
		try
		{
			var user = await userManager.GetUserAsync(User);
			var result = (
				from u in context.Users
				join fab in context.FavoriteAndBlocked
				on u.Id equals fab.TargetUserId
				where fab.UserId == user.Id && fab.IsFavorite
				select new BookServiceFavSpViewModel
				{
					SPId = fab.TargetUserId,
					FirstName = u.FirstName,
					LastName = u.LastName,
					ProfilePhoto = u.UserProfilePhoto
				}
			).ToList();
			foreach (var sp in result.ToList())
			{
				var blocked = context.FavoriteAndBlocked.Where(fab => fab.UserId == sp.SPId && fab.TargetUserId == user.Id && fab.IsBlocked).FirstOrDefault();
				if (blocked != null) result.Remove(sp);
			}
			return Json(result);
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json(new { err = "Internal Server Error !!" });
		}
	}
}

public class BookServiceFavSpViewModel
{
#nullable disable
	public string SPId { get; set; }
	public string FirstName { get; set; }
	public string LastName { get; set; }
	public string ProfilePhoto { get; set; }
}

public class ChangeBlockOrFavouriteViewModel
{
#nullable disable
	public string SPId { get; set; }
	public bool IsBlocked { get; set; }
	public bool IsFavourite { get; set; }
}

public class ReturnAddressViewModel
{
#nullable disable
	public int AddressId { get; set; }
	public string AddressLine1 { get; set; }
	public string AddressLine2 { get; set; }
	public string PostalCode { get; set; }
	public string PhoneNumber { get; set; }
	public string City { get; set; }
	public bool IsDefault { get; set; }
	public bool IsDeleted { get; set; }
}

public class RatingViewModel
{
#nullable disable
	public int FriendlyRating { get; set; }
	public int OnTimeArrivalRating { get; set; }
	public int QualityOfServiceRating { get; set; }
	public int ServiceId { get; set; }
	public string ServiceProviderId { get; set; }
#nullable enable
	public string? Comments { get; set; }
}

public class RescheduleServiceViewModel
{
#nullable disable
	public int ServiceId { get; set; }
	public string NewServiceDate { get; set; }
	public decimal NewServiceStartTime { get; set; }

}