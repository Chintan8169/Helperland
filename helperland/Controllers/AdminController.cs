using helperland.Models;
using helperland.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace helperland.Controllers;

[Authorize(Roles = "Admin")]
public class AdminController : Controller
{
	private readonly HelperlandContext context;
	private readonly UserManager<User> userManager;
	private readonly RoleManager<IdentityRole> roleManager;
	private readonly Email email;

	public AdminController(HelperlandContext context, UserManager<User> userManager, RoleManager<IdentityRole> roleManager, Email email)
	{
		this.context = context;
		this.userManager = userManager;
		this.roleManager = roleManager;
		this.email = email;
	}
	public IActionResult ServiceRequests()
	{
		var result = (
			from sa in context.ServiceRequestAddresses
			join s in context.Users on new { ServiceProviderId = sa.ServiceRequest.ServiceProviderId } equals new { ServiceProviderId = s.Id } into s_join
			from s in s_join.DefaultIfEmpty()
			join r in (
				(
					from rt in context.Ratings
					group rt by new
					{
						rt.RatingTo
					} into g
					select new
					{
						AvgRatings = (decimal?)g.Average(p => p.Ratings),
						g.Key.RatingTo
					})
			) on new { ServiceProviderId = sa.ServiceRequest.ServiceProviderId } equals new { ServiceProviderId = r.RatingTo } into r_join
			from r in r_join.DefaultIfEmpty()
			select new AdminServiceRequestsViewModel
			{
				ServiceId = sa.ServiceRequest.ServiceId,
				ServiceDate = sa.ServiceRequest.ServiceStartDate,
				TotalHours = sa.ServiceRequest.ServiceHours,
				User_First_Name = sa.ServiceRequest.User.FirstName,
				User_Last_Name = sa.ServiceRequest.User.LastName,
				StreetName = sa.AddressLine1,
				HouseNumber = sa.AddressLine2,
				PostalCode = sa.PostalCode,
				City = sa.City,
				SP_Id = s.Id,
				ProfilePhoto = s.UserProfilePhoto,
				SP_First_Name = s.FirstName,
				SP_Last_Name = s.LastName,
				SP_Avg_Ratings = r.AvgRatings != null ? (decimal)r.AvgRatings : 0,
				ServiceStatus = sa.ServiceRequest.Status != null ? Convert.ToInt32(sa.ServiceRequest.Status) : 0,
				RefundedAmount = sa.ServiceRequest.RefundedAmount,
				TotalAmount = sa.ServiceRequest.TotalCost
			}).ToList();

		var SP_Names = (
			from s in context.ServiceRequests
			join u in context.Users
			on s.ServiceProviderId equals u.Id
			select u.FirstName + " " + u.LastName
		).Distinct().ToList();
		var User_Names = (
			from u in context.Users
			join s in context.ServiceRequests
			on u.Id equals s.UserId
			select u.FirstName + " " + u.LastName
		).Distinct().ToList();
		var model = new AdminServiceRequestsViewModel()
		{
			viewModels = result,
			SP_Names = SP_Names,
			Cust_Names = User_Names
		};
		return View(model);
	}

	public IActionResult UserManagement()
	{
		var result = (
			from u in context.Users
			join z in (
				(
					from zt in context.ZipCodes
					select new
					{
						ZipCode = zt.ZipCodeValue,
						City = zt.City.CityName
					})
			) on u.ZipCode equals z.ZipCode into z_join
			from z in z_join.DefaultIfEmpty()
			select new AdminUserManagementViewModel
			{
				UserId = u.Id,
				FirstName = u.FirstName,
				LastName = u.LastName,
				UserTypeId = u.UserTypeId,
				RegisteredDate = u.CreatedDate,
				PhoneNumber = u.PhoneNumber,
				ZipCode = u.ZipCode,
				IsApproved = u.IsApproved,
				IsRegisteredUser = u.IsRegisteredUser,
				City = z.City
			}).ToList();
		var model = new AdminUserManagementViewModel()
		{
			viewModels = result,
			Names = context.Users.Select(s => s.FirstName + " " + s.LastName).ToList()
		};
		return View(model);
	}

	[HttpPost]
	public async Task<IActionResult> ActivateOrDeactivateUser([FromBody] ActivateOrDeactivateUserViewModel model)
	{
		try
		{
			var user = await userManager.GetUserAsync(User);
			if (user != null)
			{
				var tempUser = context.Users.Where(u => u.Id == model.UserId).FirstOrDefault();
				if (tempUser != null)
				{
					tempUser.IsApproved = !model.IsApproved;
					context.Users.Attach(tempUser);
					context.SaveChanges();
					return Json(new { success = "Operation Successful !" });
				}
			}
			return Json(new { err = "User Not Found !" });
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json(new { err = "Internal Server Error !" });
		}
	}

	[HttpPost]
	public async Task<IActionResult> EditOrRescheduleService([FromBody] AdminRescheduleViewModel model)
	{
		var user = await userManager.GetUserAsync(User);
		if (user != null)
		{
			var service = context.ServiceRequests.Where(s => s.ServiceId == model.ServiceId).FirstOrDefault();
			if (service != null)
			{
				DateTime newServiceDate = DateTime.Parse(model.RescheduleDate).AddHours((double)model.RescheduleTime);
				DateTime newServiceEnd = newServiceDate.AddHours(service.ServiceHours);
				if (newServiceEnd.Hour + newServiceEnd.Minute / 60 > 21)
				{
					return Json(new { err = "Rescheduled Time must not be greater than 9:00 PM !" });
				}
				else if (DateTime.Now.CompareTo(newServiceDate) > 0)
				{
					return Json(new { err = "Rescheduled Time is is already passed !" });
				}
				else if (service.ServiceProviderId != null)
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
				service.Comments = model.RescheduleReason;
				context.ServiceRequests.Attach(service);
				var sa = context.ServiceRequestAddresses.Where(a => a.ServiceRequestId == service.ServiceRequestId).FirstOrDefault();
				if (sa != null)
				{
					sa.AddressLine1 = model.StreetName;
					sa.AddressLine2 = model.HouseNumber;
					sa.City = model.City;
					sa.PostalCode = model.PostalCode;
					context.ServiceRequestAddresses.Attach(sa);
				}
				else return Json(new { err = "Address Not Found !" });
				context.SaveChanges();
				var emails = context.Users.Where(u => u.Id == service.UserId || u.Id == service.ServiceProviderId).Select(u => u.Email).ToList();
				var sendEmails = new List<string>();
				foreach (var e in emails) sendEmails.Add(e);
				email.SendMail(new SendMailViewModel()
				{
					Subject = "Reschedule Service",
					IsBodyHtml = true,
					To = sendEmails,
					Body = @$"
					<h1 style='font-size:35px;'>Greetings,</h1>
					<div style='font-size:25px;'>Service Request <b>{service.ServiceId}</b> is Rescheduled to <b>{service.ServiceStartDate.ToString("dd/MM/yyyy HH:mm").Replace("-", "/")}</b> due to '{model.RescheduleReason}'</div>"
				});
				return Json(new { success = "Successfully Rescheduled Service !!" });
			}
		}
		return Json(new { err = "Service Not Found !" });
	}

	[HttpPost]
	public async Task<IActionResult> Refund([FromBody] RefundSubmitViewModel model)
	{
		try
		{
			var user = await userManager.GetUserAsync(User);
			var service = context.ServiceRequests.Where(s => s.ServiceId == model.ServiceId).FirstOrDefault();
			if (service != null)
			{
				service.RefundedAmount = (service.RefundedAmount != null) ? service.RefundedAmount + model.RefundAmount : model.RefundAmount;
				service.ModifiedBy = user.Id;
				service.ModifiedDate = DateTime.Now;
				service.RecordVersion = Guid.NewGuid();
				service.Comments = model.RefundReason;
				context.SaveChanges();
				return Json(new { success = "Operation Successful !" });
			}
			return Json(new { err = "Service Not Found !" });
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json(new { err = "Internal Server Error !" });
		}
	}
}

public class ActivateOrDeactivateUserViewModel
{
#nullable disable
	public string UserId { get; set; }
	public bool IsApproved { get; set; }
}
public class RefundSubmitViewModel
{
	public int ServiceId { get; set; }
	public decimal RefundAmount { get; set; }
	public string RefundReason { get; set; }
}