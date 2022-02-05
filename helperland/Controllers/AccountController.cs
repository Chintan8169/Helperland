using System.Net;
using System.Net.Mail;
using helperland.Models;
using helperland.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace helperland.Controllers;
public class AccountController : Controller
{
	private readonly HelperlandContext context;
	private readonly UserManager<User> userManager;
	private readonly SignInManager<User> signInManager;
	private readonly ILogger<AccountController> logger;

	public AccountController(HelperlandContext context, UserManager<User> userManager, SignInManager<User> signInManager, ILogger<AccountController> logger)
	{
		this.context = context;
		this.userManager = userManager;
		this.signInManager = signInManager;
		this.logger = logger;
	}

	[AcceptVerbs("Get", "Post")]
	public async Task<IActionResult> IsEmailInUse(string email) =>
	await userManager.FindByEmailAsync(email) == null ? Json(true) : Json("This Email is already in use please choose other !");

	[AcceptVerbs("Get", "Post")]
	public async Task<IActionResult> IsNotEmail(string email) =>
	await userManager.FindByEmailAsync(email) == null ? Json("This Email is not registered !") : Json(true);

	public IActionResult CustomerSignup()
	{
		return View();
	}
	[HttpPost]
	public async Task<IActionResult> CustomerSignup(SignUpViewModel model)
	{
		if (!ModelState.IsValid)
		{
			return View(model);
		}
		var newUser = new User()
		{
			UserName = model.Email,
			FirstName = model.FirstName,
			LastName = model.LastName,
			Email = model.Email,
			UserTypeId = model.UserTypeId,
			IsRegisteredUser = false,
			CreatedDate = DateTime.Now,
			ModifiedDate = DateTime.Now,
			ModifiedBy = model.UserTypeId,
			IsApproved = false,
			PhoneNumber = model.PhoneNumber
		};
		var result = await userManager.CreateAsync(newUser, model.Password);
		if (result.Succeeded)
		{
			Response.Cookies.Append("isSuccessModalOpen", "true");
			RedirectToAction("CustomerSignup", "Account");
		}
		ModelState.AddModelError("Password", "Password Must be minimum length of 6 character and must contain atleast  1 special character and atleast 1 number with atleast 1 Uppercase character !!");
		return View(model);
	}
	[HttpGet]
	public IActionResult ServiceProviderSignup()
	{
		return View();
	}
	[HttpPost]
	public async Task<IActionResult> ServiceProviderSignup(SignUpViewModel model)
	{
		if (!ModelState.IsValid)
		{
			return View(model);
		}
		var newUser = new User()
		{
			UserName = model.Email,
			FirstName = model.FirstName,
			LastName = model.LastName,
			Email = model.Email,
			UserTypeId = model.UserTypeId,
			IsRegisteredUser = false,
			CreatedDate = DateTime.Now,
			ModifiedDate = DateTime.Now,
			ModifiedBy = model.UserTypeId,
			IsApproved = false,
			PhoneNumber = model.PhoneNumber
		};
		var result = await userManager.CreateAsync(newUser, model.Password);
		if (result.Succeeded)
		{
			Response.Cookies.Append("isSuccessModalOpen", "true");
			RedirectToAction("ServiceProviderSignup", "Account");
		}
		ModelState.AddModelError("Password", "Password Must be minimum length of 6 character and must contain atleast  1 special character and atleast 1 number with atleast 1 Uppercase character !!");
		return View(model);
	}

	[HttpPost]
	public async Task<IActionResult> Login(LoginViewModel model)
	{
		if (!ModelState.IsValid)
		{
			Response.Cookies.Append("isLoginModalOpen", "true");
			return View("../Static/Index", model);
		}
		var result = await signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, false);
		if (result.Succeeded)
		{
			Response.Cookies.Append("isSuccessModalOpen", "true");
			Response.Cookies.Append("isSuccessModalContent", "Logged in successfully !!");
			return RedirectToAction("Index", "Static");
		}
		Response.Cookies.Append("isLoginModalOpen", "true");
		ModelState.AddModelError("Email", "Authentication Failed !!");
		return View("../Static/Index", model);
	}

	[HttpPost]
	public async Task<IActionResult> SendForgetPasswordEmailToken(LoginViewModel model)
	{
		try
		{
			var emailField = ModelState.FirstOrDefault(k => k.Key == "Email");
			if (emailField.Value != null && emailField.Value.ValidationState.ToString() == "Valid")
			{
				var user = await userManager.FindByEmailAsync(model.Email);
				if (user != null)
				{
					var passwordResetToken = await userManager.GeneratePasswordResetTokenAsync(user);
					var passwordResetLink = Url.Action("ResetPassword", "Account", new { email = model.Email, token = passwordResetToken }, Request.Scheme);
					using (MailMessage newMail = new MailMessage("gohilchintanrajsinh@gmail.com", model.Email))
					{
						newMail.Subject = "Password Reset Confirmation.";
						newMail.Body = $@"
						<h1>Hello, {user.FirstName} {user.LastName}</h1>
						<p><a href='{passwordResetLink}'>Click Here</a> To reset your password !!</p>
						<p style='color:red;'>If you have not generated this link just ignore it !</p>
					";
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
							Response.Cookies.Append("isSuccessModalOpen", "true");
							Response.Cookies.Append("isSuccessModalContent", "Password Reset link is successfully sent to your email !!");
							return RedirectToAction("Index", "Static");
						}
					}
				}
			}
			ModelState.AddModelError("Email", "This Email is not registered !");
			return View("../Static/Index", model);
		}
		catch
		{
			Response.Cookies.Append("isErrorModalOpen", "true");
			Response.Cookies.Append("errorModalContent", "Internal Server Error");
			return View("../Static/Index", model);
		}
	}

	[HttpGet]
	public IActionResult ResetPassword()
	{
		return View();
	}

	[HttpPost]
	public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model, string email, string token)
	{
		if (!ModelState.IsValid)
		{
			if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(token))
			{
				Response.Cookies.Append("isErrorModalOpen", "true");
				Response.Cookies.Append("errorModalContent", "Reset Link in not valid !");
			}
			return View(model);
		}
		var user = await userManager.FindByEmailAsync(email);
		if (user != null)
		{
			var result = await userManager.ResetPasswordAsync(user, token, model.Password);
			if (result.Succeeded)
			{
				Response.Cookies.Append("isSuccessModalOpen", "true");
				Response.Cookies.Append("isSuccessModalContent", "Password successfully Reset !!");
				return View();
			}
			ModelState.AddModelError("Password", "Password Must be minimum length of 6 character and must contain atleast  1 special character and atleast 1 number with atleast 1 Uppercase character !!");
			return View(model);
		}
		Response.Cookies.Append("isErrorModalOpen", "true");
		Response.Cookies.Append("errorModalContent", "Reset Link in not valid !");
		return View();
	}

	public async Task<IActionResult> Logout()
	{
		await signInManager.SignOutAsync();
		Response.Cookies.Append("isSuccessModalOpen", "true");
		Response.Cookies.Append("isSuccessModalContent", "Logged Out successfully !!");
		return RedirectToAction("Index", "Static");
	}

}