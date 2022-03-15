using helperland.Models;
using helperland.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace helperland.Controllers;
public class StaticController : Controller
{
#nullable disable
	private readonly HelperlandContext context;
	private readonly IWebHostEnvironment webHostEnvironment;
	private readonly IHttpClientFactory httpClientFactory;
	private readonly Email email;

	public StaticController(HelperlandContext context, IWebHostEnvironment webHostEnvironment, IHttpClientFactory httpClientFactory, Email email)
	{
		this.context = context;
		this.webHostEnvironment = webHostEnvironment;
		this.httpClientFactory = httpClientFactory;
		this.email = email;
	}
	public IActionResult Index()
	{
		return View();
	}
	public IActionResult About(string zipcode)
	{
		return View();
	}
	public IActionResult Faq()
	{
		return View();
	}
	public IActionResult Prices()
	{
		return View();
	}
	[HttpGet]
	public IActionResult ContactUs()
	{
		return View();
	}

	[HttpPost]
	public IActionResult ContactUs(ContactUsViewModel model)
	{
		try
		{
			if (!ModelState.IsValid)
			{
				return View(model);
			}
			ContactUs newMessage = new ContactUs();
			newMessage.Name = $"{model.FirstName} {model.LastName}";
			newMessage.Email = model.Email;
			newMessage.PhoneNumber = Convert.ToInt64(model.PhoneNumber);
			newMessage.Message = model.Message;
			newMessage.Subject = model.Subject;
			newMessage.CreatedOn = DateTime.Now;
			string uniqueFilename;
			string filePath = null;
			if (model.File != null)
			{
				string uploadsFolder = Path.Combine(webHostEnvironment.WebRootPath, "images", "ContactUsUploadedImages");
				uniqueFilename = Guid.NewGuid().ToString() + "_" + model.File.FileName;
				filePath = Path.Combine(uploadsFolder, uniqueFilename);
				newMessage.UploadedFileName = uniqueFilename;
				using (var fileStream = new FileStream(filePath, FileMode.Create))
				{
					model.File.CopyTo(fileStream);
				}
			}
			context.ContactUs.Add(newMessage);
			context.SaveChanges();
			var newMail = new SendMailViewModel()
			{
				Subject = model.Subject,
				IsBodyHtml = true,
				Body = $@"
				<h3>User Name: {model.FirstName} {model.LastName}</h3>
				<h3>User Email: {model.Email}</h3>
				<h4>User Phone Number: {model.PhoneNumber}</h4>
				<p>Message: {model.Message}</p>",
				To = new List<string>() { "helperlandadmin@yopmail.com" }
			};
			if (model.File != null && model.File.Length > 0 && filePath != null)
			{
				newMail.AttachmentFilePath = filePath;
			}
			var successMail = email.SendMail(newMail);
			if (successMail)
			{
				Response.Cookies.Append("isSuccessModalOpen", "true");
				Response.Cookies.Append("isSuccessModalContent", "Form successfully submitted !!");
				return RedirectToAction("ContactUs");
			}
			else
			{
				Response.Cookies.Append("isErrorModalOpen", "true");
				Response.Cookies.Append("errorModalContent", "Can not send mail to admin<br>However your details have been saved successfully");
				return View();
			}
		}
		catch (Exception e)
		{
			Console.WriteLine(e);
			Response.Cookies.Append("isErrorModalOpen", "true");
			Response.Cookies.Append("errorModalContent", "Internal Server Error");
			return View();
		}
	}

	[HttpGet]
	public IActionResult GetCityByPostalCode(string PostalCode)
	{
		try
		{
			if (PostalCode != null)
			{
				var city = (
					from z in context.ZipCodes
					join c in context.Cities
					on z.CityId equals c.CityId
					where z.ZipCodeValue == PostalCode
					select c.CityName
				).FirstOrDefault();
				if (city != null)
				{
					return Json(new { cityName = city });
				}
			}
			return Json(new { err = "City Not Found !" });
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json(new { err = "Internal Server Error !" });
		}
	}
}

public class ZipCodeViewModel
{
#nullable disable
	public IEnumerable<ZipCode> ZipCodes { get; set; }
}