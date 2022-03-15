using System.Net;
using System.Net.Mail;

namespace helperland.Controllers;


public class Email
{
	public bool SendMail(SendMailViewModel model)
	{
		try
		{
			MailMessage mail = new MailMessage()
			{
				From = new MailAddress("gohilchintanrajsinh@gmail.com")
			};
			foreach (var toStr in model.To) mail.To.Add(new MailAddress(toStr));
			mail.Subject = model.Subject;
			mail.IsBodyHtml = model.IsBodyHtml;
			mail.Body = model.Body;
			if (!string.IsNullOrEmpty(model.AttachmentFilePath)) mail.Attachments.Add(new Attachment(model.AttachmentFilePath));
			SmtpClient client = new SmtpClient()
			{
				Host = "smtp.gmail.com",
				Port = 587,
				UseDefaultCredentials = false,
				Credentials = new NetworkCredential("gohilchintanrajsinh@gmail.com", "Gohil@9712"),
				EnableSsl = true
			};
			client.Send(mail);
			return true;
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return false;
		}
	}
}


public class SendMailViewModel
{
#nullable disable
	public string Subject { get; set; }
	public string Body { get; set; }
	public bool IsBodyHtml { get; set; }
	public List<string> To { get; set; }
#nullable enable
	public string? AttachmentFilePath { get; set; }
}