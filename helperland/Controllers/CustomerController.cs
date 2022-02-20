using helperland.Models;
using helperland.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace helperland.Controllers;

[Authorize(Roles = "Customer")]
public class CustomerController : Controller
{
	private readonly HelperlandContext context;
	private readonly Microsoft.AspNetCore.Identity.UserManager<User> userManager;
	private readonly RoleManager<IdentityRole> roleManager;

	public CustomerController(HelperlandContext context, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
	{
		this.context = context;
		this.userManager = userManager;
		this.roleManager = roleManager;
	}

	public IActionResult Index()
	{
		return View();
	}

	[HttpGet]
	public IActionResult BookService()
	{
		return View();
	}
	[HttpPost]
	public async Task<IActionResult> BookService([FromBody] BookServiceViewModel model)
	{
		int random = new Random().Next(1000, 9999);
		var isExist = context.ServiceRequests.Where(x => x.ServiceId == random).FirstOrDefault();
		while (isExist != null)
		{
			random = new Random().Next(1000, 9999);
			isExist = context.ServiceRequests.Where(x => x.ServiceId == random).FirstOrDefault();
		}
		var user = await userManager.GetUserAsync(User);
		var newServiceRequest = new ServiceRequest()
		{
			ServiceId = random,
			UserId = user.Id,
			ZipCode = model.ZipCode,
			PaymentDue = false,
			ServiceHours = model.ServiceBasicHours,
			HasPets = model.HasPets,
			CreatedDate = DateTime.Now,
			ModifiedDate = DateTime.Now,
			Distance = 0,
			RecordVersion = Guid.NewGuid()
		};
		if (model.ExtraServices != null)
		{
			newServiceRequest.ServiceHours += model.ExtraServices.Count() * 0.5;
		}
		newServiceRequest.SubTotal = ((decimal)model.ServiceBasicHours) * 18;
		newServiceRequest.TotalCost = newServiceRequest.SubTotal;
		if (model.Comments != null)
		{
			newServiceRequest.Comments = model.Comments;
		}
		var s = model.ServiceDate.Split("/");
		double x = newServiceRequest.ServiceHours;
		int hours = ((int)Math.Floor(x));
		int min = ((int)Math.Ceiling((x - hours) * 60));
		var d = new DateTime(Int32.Parse(s[2]), Int32.Parse(s[1]), Int32.Parse(s[0]), hours, min, 0);
		newServiceRequest.ServiceStartDate = d;
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
			context.SaveChanges();
		}
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
				context.SaveChanges();
			}
		}
		return Json(new { ServiceId = newServiceRequest.ServiceId });
	}

	[HttpGet]
	public JsonResult CheckAvailability(string ZipCode)
	{
		if (ZipCode != null)
		{
			var isAvailable = context.Users.Where(u => u.UserTypeId == 2 && u.ZipCode == ZipCode).FirstOrDefault();
			if (isAvailable != null)
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

	public async Task<IActionResult> GetAddresses(string ZipCode)
	{
		Console.WriteLine(ZipCode);
		var user = await userManager.GetUserAsync(User);
		var addresses = context.UserAddresses.Where(a => a.UserId == user.Id && a.PostalCode == ZipCode).ToList();
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
				City = a.City
			};
			add = add.Append(temp);
		}
		return Json(add);
	}
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
}