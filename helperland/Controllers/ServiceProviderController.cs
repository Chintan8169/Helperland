using helperland.Models;
using helperland.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace helperland.Controllers;

[Authorize(Roles = "Admin,ServiceProvider")]
public class ServiceProviderController : Controller
{
	private readonly UserManager<User> userManager;
	private readonly RoleManager<IdentityRole> roleManager;
	private readonly HelperlandContext context;

	public ServiceProviderController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, HelperlandContext context)
	{
		this.userManager = userManager;
		this.roleManager = roleManager;
		this.context = context;
	}

	public async Task<IActionResult> Dashboard(bool HasPets)
	{
		Console.WriteLine(HasPets);
		try
		{
			var sp = await userManager.GetUserAsync(User);
			var result = (
				from u in context.Users
				join s in context.ServiceRequests
				on u.Id equals s.UserId
				join sa in context.ServiceRequestAddresses
				on s.ServiceRequestId equals sa.ServiceRequestId
				where s.Status == 1 && s.HasPets == HasPets
				select new SPUpcomingServicesViewModel
				{
					UserId = s.UserId,
					ServiceId = s.ServiceId,
					CustomerName = u.FirstName + " " + u.LastName,
					ServiceDate = s.ServiceStartDate,
					ServiceHours = s.ServiceHours,
					StreetName = sa.AddressLine1,
					HouseNumber = sa.AddressLine2,
					City = sa.City,
					PostalCode = sa.PostalCode,
					Payment = s.TotalCost,
					RecordVersion = s.RecordVersion.ToString()
				}
			).ToList();
			var blocked = context.FavoriteAndBlocked.Where(fab => (fab.UserId == sp.Id || fab.TargetUserId == sp.Id) && fab.IsBlocked);
			foreach (var s in result)
			{
				foreach (var b in blocked)
				{
					if ((b.UserId == sp.Id && b.TargetUserId == s.UserId) || (b.UserId == s.UserId && b.TargetUserId == sp.Id))
						result.Remove(s);
				}
			}
			return View(result);
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json("Internal Server Error !");
		}
	}

	public async Task<IActionResult> AcceptService(int ServiceId, string RecordVersion)
	{
		try
		{
			var sp = await userManager.GetUserAsync(User);
			var service = context.ServiceRequests.Where(s => s.ServiceId == ServiceId).FirstOrDefault();
			if (service != null)
			{
				if (service.RecordVersion.ToString() == RecordVersion.ToLower())
				{
					var result = context.ServiceRequests.Where(s => s.ServiceProviderId == sp.Id && s.ServiceStartDate.Day == service.ServiceStartDate.Day && s.ServiceStartDate.Month == service.ServiceStartDate.Month && s.ServiceStartDate.Year == service.ServiceStartDate.Year && s.Status == 2).ToList();
					if (result.Count() > 0)
					{
						var newServiceDate = service.ServiceStartDate;
						var newServiceEnd = service.ServiceStartDate.AddHours(service.ServiceHours);
						foreach (var s in result)
						{
							var tempServiceStart = s.ServiceStartDate;
							var tempServiceEnd = s.ServiceStartDate.AddHours((double)(service.ServiceHours + 1));
							if ((newServiceEnd.CompareTo(tempServiceStart) > 0 && newServiceEnd.CompareTo(tempServiceEnd) <= 0) || (newServiceDate.CompareTo(tempServiceStart) >= 0 && newServiceDate.CompareTo(tempServiceEnd) < 0) || ((tempServiceStart.CompareTo(newServiceDate) >= 0 && tempServiceEnd.CompareTo(newServiceEnd) < 0)))
							{
								return Json(new { conflict = "There Another Service Conflicting this service Click Show Conflict button to see which service is conflicting !", conflictServiceId = s.ServiceId });
							}
						}
					}
					service.Status = 2;
					service.ServiceProviderId = sp.Id;
					service.SpacceptedDate = DateTime.Now;
					service.ModifiedBy = sp.Id;
					service.ModifiedDate = DateTime.Now;
					service.RecordVersion = Guid.NewGuid();
					context.ServiceRequests.Attach(service);
					context.SaveChanges();
					return Json(new { success = "Successfully accepted service !" });
				}
				else
				{
					return Json(new { alreadyAccepted = "This service request is no more available. It has been assigned to another provider !" });
				}
			}
			return Json(new { err = "Service Not Found !" });
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json(new { err = "Internal Server Error !" });
			throw;
		}
	}
	public async Task<IActionResult> ServiceHistory()
	{
		try
		{
			var sp = await userManager.GetUserAsync(User);
			var result = (
				from u in context.Users
				join s in context.ServiceRequests
				on u.Id equals s.UserId
				join sa in context.ServiceRequestAddresses
				on s.ServiceRequestId equals sa.ServiceRequestId
				where s.ServiceProviderId == sp.Id && s.Status == 3
				select new SPServiceHistoryViewModel
				{
					ServiceId = s.ServiceId,
					CustomerName = u.FirstName + " " + u.LastName,
					ServiceDate = s.ServiceStartDate,
					ServiceHours = s.ServiceHours,
					StreetName = sa.AddressLine1,
					HouseNumber = sa.AddressLine2,
					City = sa.City,
					PostalCode = sa.PostalCode
				}
			).ToList();
			return View(result);
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json("Internal Server Error !");
		}
	}

	[HttpGet]
	public async Task<IActionResult> GetServiceDetails(int ServiceId)
	{
		try
		{
			var sp = await userManager.GetUserAsync(User);
			var service = context.ServiceRequests.Where(s => s.ServiceId == ServiceId).FirstOrDefault();
			if (service != null)
			{
				var serviceExtra = context.ServiceRequestExtras.Where(sa => sa.ServiceRequestId == service.ServiceRequestId).Select(sea => sea.ServiceExtraId).ToArray();
				var jsonData = new
				{
					Payment = service.TotalCost,
					Extras = serviceExtra,
					HasPets = service.HasPets,
					Comments = service.Comments
				};
				return Json(jsonData);
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
	public async Task<IActionResult> GetConflictServiceDetails(int ServiceId)
	{
		try
		{
			var sp = await userManager.GetUserAsync(User);
			var service = context.ServiceRequests.Where(s => s.ServiceId == ServiceId).FirstOrDefault();
			if (service != null)
			{
				var jsonData = new
				{
					ServiceId = service.ServiceId,
					ServiceHours = service.ServiceStartDate.ToString("HH:mm").Replace(".", ":") + " - " + service.ServiceStartDate.AddHours(service.ServiceHours).ToString("HH:mm").Replace(".", ":"),
					ServiceDate = service.ServiceStartDate.ToString("dd/MM/yyyy").Replace("-", "/")
				};
				return Json(jsonData);
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
	public async Task<IActionResult> MyRatings()
	{
		try
		{
			var sp = await userManager.GetUserAsync(User);

			var result = (
				from u in context.Users
				join s in context.ServiceRequests
				on u.Id equals s.UserId
				join r in context.Ratings
				on s.ServiceRequestId equals r.ServiceRequestId
				where s.ServiceProviderId == sp.Id && s.Status == 3 && r.RatingTo == sp.Id && r.ServiceRequestId != 0
				select new SPMyRatingsViewModel
				{
					ServiceId = s.ServiceId,
					ServiceDate = s.ServiceStartDate,
					ServiceHours = s.ServiceHours,
					CustomerName = u.FirstName + " " + u.LastName,
					Ratings = r.Ratings,
					Comments = r.Comments
				}
			).ToList();

			return View(result);
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json(new { err = "Internal Server Error !" });
		}
	}

	[HttpGet]
	public async Task<IActionResult> BlockCustomer()
	{
		try
		{
			var sp = await userManager.GetUserAsync(User);
			var result = (
				from u in context.Users
				join s in context.ServiceRequests
				on u.Id equals s.UserId
				join fab in context.FavoriteAndBlocked
				on new { SPId = s.ServiceProviderId, UId = s.UserId } equals new { SPId = fab.UserId, UId = fab.TargetUserId } into x
				from fab in x.DefaultIfEmpty()
				where s.ServiceProviderId == sp.Id && s.Status == 3
				select new BlockCustomerViewModel
				{
					UserId = u.Id,
					IsBlocked = fab.IsBlocked ? fab.IsBlocked : false,
					CustomerName = u.FirstName + " " + u.LastName
				}
			).Distinct().ToList();
			return View(result);
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json(new { err = "Internal Server Error !" });
		}
	}
	[HttpPost]
	public async Task<IActionResult> BlockCustomer([FromBody] BlockCustomerSubmitViewModel model)
	{
		try
		{
			var sp = await userManager.GetUserAsync(User);
			if (sp != null)
			{
				var result = context.FavoriteAndBlocked.Where(fab => fab.TargetUserId == model.UserId && fab.UserId == sp.Id).FirstOrDefault();
				if (result != null)
				{
					result.IsBlocked = model.IsBlocked;
					context.Attach(result);
				}
				else
				{
					var newFab = new FavoriteAndBlocked()
					{
						UserId = sp.Id,
						TargetUserId = model.UserId,
						IsBlocked = model.IsBlocked,
						IsFavorite = false
					};
					context.FavoriteAndBlocked.Add(newFab);
				}
				context.SaveChanges();
				return Json(new { success = model.IsBlocked ? "Successfully Blocked Customer !" : "Successfully Unblocked Customer !", isBlocked = model.IsBlocked });
			}
			else
				return Json(new { err = "Service Not Found !" });
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json(new { err = "Internal Server Error !" });
		}
	}

	[HttpGet]
	public async Task<IActionResult> Profile()
	{
		try
		{
#nullable disable
			var sp = await userManager.GetUserAsync(User);
			var result = (
				from u in context.Users
				join uat in context.UserAddresses
				on u.Id equals uat.UserId into x
				from ua in x.DefaultIfEmpty()
				where u.Id == sp.Id
				select new { u, ua }
			).FirstOrDefault();
			SPDetails model = new SPDetails()
			{
				FirstName = result.u.FirstName,
				LastName = result.u.LastName,
				Email = result.u.Email,
				PhoneNumber = result.u.PhoneNumber,
				Nationality = result.u.Nationality,
				Gender = result.u.Gender,
				StreetName = result.ua != null ? result.ua.AddressLine1 : "",
				HouseNumber = result.ua != null ? result.ua.AddressLine2 : "",
				PostalCode = result.u.ZipCode,
				City = result.ua != null ? result.ua.City : "",
				Day = result.u.DateOfBirth != null ? result.u.DateOfBirth.Value.Day : 0,
				Month = result.u.DateOfBirth != null ? result.u.DateOfBirth.Value.Month : 0,
				Year = result.u.DateOfBirth != null ? result.u.DateOfBirth.Value.Year : 0,
				Profile = result.u.UserProfilePhoto != null ? result.u.UserProfilePhoto : "",
			};
			var newModel = new SPMySettings()
			{
				SPDetails = model
			};
			return View(newModel);
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return View();
		}
	}

	[HttpPost]
	public async Task<IActionResult> UpdateDetails([FromBody] SPDetails model)
	{
		try
		{
			var sp = await userManager.GetUserAsync(User);
			var sa = context.UserAddresses.Where(ua => ua.UserId == sp.Id).FirstOrDefault();
			sp.FirstName = model.FirstName;
			sp.LastName = model.LastName;
			sp.Email = model.Email;
			sp.PhoneNumber = model.PhoneNumber;
			sp.Nationality = model.Nationality;
			sp.Gender = model.Gender;
			sp.ModifiedBy = sp.Id;
			sp.ModifiedDate = DateTime.Now;
			sp.UserProfilePhoto = model.Profile;
			sp.ZipCode = model.PostalCode;
			sp.DateOfBirth = new DateTime(model.Year, model.Month, model.Day);

			if (sa != null)
			{
				sa.AddressLine1 = model.StreetName;
				sa.AddressLine2 = model.HouseNumber;
				sa.PostalCode = model.PostalCode;
				sa.City = model.City;
				sa.Mobile = model.PhoneNumber;
				context.UserAddresses.Attach(sa);
			}
			else
			{
				var userAddress = new UserAddress()
				{
					Email = sp.Email,
					UserId = sp.Id,
					AddressLine1 = model.StreetName,
					AddressLine2 = model.HouseNumber,
					PostalCode = model.PostalCode,
					City = model.City,
					Mobile = model.PhoneNumber
				};
				context.UserAddresses.Add(userAddress);
			}
			context.SaveChanges();
			return Json(new { success = "Successfully Updated Details !" });
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json(new { err = "Internal Server Error !" });
		}
	}

	[HttpGet]
	public async Task<IActionResult> CancelService(int ServiceId)
	{
		try
		{
			var sp = await userManager.GetUserAsync(User);
			var service = context.ServiceRequests.Where(s => s.ServiceId == ServiceId).FirstOrDefault();
			if (service != null)
			{
				if (service.ServiceProviderId == sp.Id)
				{
					service.Status = 1;
					service.ServiceProviderId = null;
					service.SpacceptedDate = null;
					service.RecordVersion = Guid.NewGuid();
					context.ServiceRequests.Attach(service);
					context.SaveChanges();
					return Json(new { success = "Successfully Cancelled Service !" });
				}
				else
				{
					return Json(new { success = "You Are not Authorize to cancel this service request !" });
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
	public async Task<IActionResult> CompleteService(int ServiceId)
	{
		try
		{
			var sp = await userManager.GetUserAsync(User);
			var service = context.ServiceRequests.Where(s => s.ServiceId == ServiceId).FirstOrDefault();
			if (service != null)
			{
				if (service.ServiceProviderId == sp.Id)
				{
					service.Status = 3;
					service.RecordVersion = Guid.NewGuid();
					context.ServiceRequests.Attach(service);
					context.SaveChanges();
					return Json(new { success = "Successfully Completed Service !" });
				}
				else
				{
					return Json(new { success = "You Are not Authorize to Complete this service request !" });
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
	public async Task<IActionResult> UpcomingServices()
	{
		try
		{
			var sp = await userManager.GetUserAsync(User);
			var result = (
				from u in context.Users
				join s in context.ServiceRequests
				on u.Id equals s.UserId
				join sa in context.ServiceRequestAddresses
				on s.ServiceRequestId equals sa.ServiceRequestId
				where s.ServiceProviderId == sp.Id && s.Status == 2
				select new SPUpcomingServicesViewModel
				{
					ServiceId = s.ServiceId,
					CustomerName = u.FirstName + " " + u.LastName,
					ServiceDate = s.ServiceStartDate,
					ServiceHours = s.ServiceHours,
					StreetName = sa.AddressLine1,
					HouseNumber = sa.AddressLine2,
					City = sa.City,
					PostalCode = sa.PostalCode,
					Payment = s.TotalCost,
					RecordVersion = s.RecordVersion.ToString()
				}
			).ToList();
			Console.WriteLine(result.Count());
			return View(result);
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json("Internal Server Error !");
		}
	}
}