using helperland.Models;
using helperland.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;


namespace helperland.Controllers;
public class StaticController : Controller
{
	private readonly HelperlandContext context;
	private readonly IWebHostEnvironment webHostEnvironment;

	public StaticController(HelperlandContext context, IWebHostEnvironment webHostEnvironment)
	{
		this.context = context;
		this.webHostEnvironment = webHostEnvironment;
	}
	public IActionResult Index()
	{
		return View();
	}
	public IActionResult About()
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
			newMessage.PhoneNumber = model.PhoneNumber;
			newMessage.Message = model.Message;
			newMessage.Subject = model.Subject;
			newMessage.CreatedOn = DateTime.Now;
			string uniqueFilename;
			if (model.File != null)
			{
				string uploadsFolder = Path.Combine(webHostEnvironment.WebRootPath, "images", "ContactUsUploadedImages");
				uniqueFilename = Guid.NewGuid().ToString() + "_" + model.File.FileName;
				string filePath = Path.Combine(uploadsFolder, uniqueFilename);
				newMessage.UploadedFileName = uniqueFilename;
				using (var fileStream = new FileStream(filePath, FileMode.Create))
				{
					model.File.CopyTo(fileStream);
				}
			}
			using (MailMessage newMail = new MailMessage("gohilchintanrajsinh@gmail.com", "helperlandadmin@yopmail.com"))
			{
				newMail.Subject = model.Subject;
				newMail.Body = $@"
				<h3>User Name: {model.FirstName} {model.LastName}</h3>
				<h3>User Email: {model.Email}</h3>
				<h4>User Phone Number: {model.PhoneNumber}</h4>
				<p>Message: {model.Message}</p>
			";
				if (model.File != null && model.File.Length > 0)
				{
					string fileName = Path.GetFileName(model.File.FileName);
					newMail.Attachments.Add(new Attachment(model.File.OpenReadStream(), fileName));
				}
				newMail.IsBodyHtml = true;
				using (SmtpClient smtp = new SmtpClient())
				{
					smtp.Host = "smtp.gmail.com";
					smtp.EnableSsl = true;
					NetworkCredential NetworkCred = new NetworkCredential("gohilchintanrajsinh@gmail.com", "Gohil@9712");
					smtp.UseDefaultCredentials = false;
					smtp.Credentials = NetworkCred;
					smtp.Port = 587;
					smtp.Send(newMail);
				}
			}
			context.ContactUs.Add(newMessage);
			context.SaveChanges();
			Response.Cookies.Append("isSuccessModalOpen", "true");
			Response.Cookies.Append("isSuccessModalContent", "Form successfully submitted !!");
			return RedirectToAction("ContactUs");
		}
		catch
		{
			Response.Cookies.Append("isErrorModalOpen", "true");
			Response.Cookies.Append("errorModalContent", "Internal Server Error");
			return View();
		}
	}
}