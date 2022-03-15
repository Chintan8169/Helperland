using System.Net;
using System.Net.Mail;
using helperland.Models;
using helperland.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace helperland.Controllers;
public class AccountController : Controller
{
	private readonly HelperlandContext context;
	private readonly UserManager<User> userManager;
	private readonly SignInManager<User> signInManager;
	private readonly ILogger<AccountController> logger;
	private readonly RoleManager<IdentityRole> roleManager;

	public AccountController(HelperlandContext context, UserManager<User> userManager, SignInManager<User> signInManager, ILogger<AccountController> logger, RoleManager<IdentityRole> roleManager)
	{
		this.context = context;
		this.userManager = userManager;
		this.signInManager = signInManager;
		this.logger = logger;
		this.roleManager = roleManager;
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
			IsApproved = false,
			PhoneNumber = model.PhoneNumber
		};
		var result = await userManager.CreateAsync(newUser, model.Password);
		newUser.ModifiedBy = newUser.Id;
		context.SaveChanges();
		if (result.Succeeded)
		{
			var user = await userManager.FindByEmailAsync(model.Email);
			await userManager.AddToRoleAsync(user, "Customer");
			Response.Cookies.Append("isSuccessModalOpen", "true");
			return RedirectToAction("CustomerSignup", "Account");
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
			IsApproved = false,
			PhoneNumber = model.PhoneNumber
		};
		var result = await userManager.CreateAsync(newUser, model.Password);
		newUser.ModifiedBy = newUser.Id;
		context.SaveChanges();
		if (result.Succeeded)
		{
			var user = await userManager.FindByEmailAsync(model.Email);
			await userManager.AddToRoleAsync(user, "ServiceProvider");
			Response.Cookies.Append("isSuccessModalOpen", "true");
			return RedirectToAction("ServiceProviderSignup", "Account");
		}
		ModelState.AddModelError("Password", "Password Must be minimum length of 6 character and must contain atleast 1 special character and atleast 1 number with atleast 1 Uppercase character !!");
		return View(model);
	}

	[HttpGet]
	public IActionResult Login(string? ReturnUrl)
	{
		Response.Cookies.Append("isLoginModalOpen", "true");
		if (ReturnUrl != null)
		{
			return RedirectToAction("Index", "Static", new { ReturnUrl = ReturnUrl });
		}
		return RedirectToAction("Index", "Static");
	}

	[HttpPost]
	public async Task<IActionResult> Login([FromBody] LoginViewModel model)
	{
		try
		{
			if (!ModelState.IsValid)
			{
				return Json(new { error = "Authentication Failed !" });
			}
			var result = await signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);
			if (result.Succeeded)
			{
				var user = await userManager.FindByEmailAsync(model.Email);
				if (user.UserTypeId == 1)
					return Json(new { success = "Logged In !", userType = "Customer" });
				else if (user.UserTypeId == 2)
					return Json(new { success = "Logged In !", userType = "ServiceProvider" });
				else
					return Json(new { success = "Logged In !", userType = "Admin" });
			}
			return Json(new { error = "Authentication Failed !" });
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json(new { error = "Internal Server Error !" });
		}
	}
	[Authorize]
	[HttpPost]
	public async Task<IActionResult> ChangePassword([FromBody] PasswordChange model)
	{
		try
		{
			var user = await userManager.GetUserAsync(User);
			if (user != null)
			{
				var result = await userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
				if (result.Succeeded)
				{
					return Json(new { success = "Password Changed Successfully !" });
				}
				else
				{
					for (int i = 0; i < result.Errors.Count(); i++)
					{
						if (result.Errors.ToList()[i].Code.ToString().Contains("PasswordMismatch"))
							return Json(new { err = "Current Password is not correct !" });
						else if (result.Errors.ToList()[i].Code.ToString().Contains("PasswordTooShort") || result.Errors.ToList()[i].Code.ToString().Contains("PasswordRequiresNonAlphanumeric") || result.Errors.ToList()[i].Code.ToString().Contains("PasswordRequiresLower") || result.Errors.ToList()[i].Code.ToString().Contains("PasswordRequiresUpper"))
							return Json(new { err = "Password Must be minimum length of 6 character and must contain atleast 1 special character and atleast 1 number with atleast 1 Uppercase character !!" });
					}
				}
			}
			throw new Exception();
		}
		catch (Exception e)
		{
			Console.WriteLine(e.Message);
			return Json(new { err = "Internal Server Error !" });
		}
	}

	[HttpPost]
	public async Task<IActionResult> SendForgetPasswordEmailToken(LoginViewModel model)
	{
		try
		{
			Console.WriteLine(model.Email);
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
			else if (result.Errors.Where(e => e.Code.ToString().Contains("InvalidToken")).FirstOrDefault() != null)
			{
				Response.Cookies.Append("isErrorModalOpen", "true");
				Response.Cookies.Append("errorModalContent", "Reset Link in not valid !");
				return View();
			}
			else if (result.Errors.Where(e => e.Code.ToString().Contains("PasswordTooShort") || e.Code.ToString().Contains("PasswordRequiresNonAlphanumeric") || e.Code.ToString().Contains("PasswordRequiresLower") || e.Code.ToString().Contains("PasswordRequiresUpper")).FirstOrDefault() != null)
			{
				ModelState.AddModelError("Password", "Password Must be minimum length of 6 character and must contain atleast  1 special character and atleast 1 number with atleast 1 Uppercase character !!");
				return View(model);
			}
		}
		Response.Cookies.Append("isErrorModalOpen", "true");
		Response.Cookies.Append("errorModalContent", "Reset Link in not valid !");
		return View();
	}

	public IActionResult AccessDenied()
	{
		return View();
	}

	[Authorize]
	public async Task<IActionResult> Logout()
	{
		await signInManager.SignOutAsync();
		Response.Cookies.Append("isSuccessModalOpen", "true");
		Response.Cookies.Append("isSuccessModalContent", "Logged Out successfully !!");
		return RedirectToAction("Index", "Static");
	}

}