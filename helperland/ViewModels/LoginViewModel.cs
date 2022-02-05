using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace helperland.ViewModels;

public class LoginViewModel
{
#nullable disable
	[Required]
	[DataType(DataType.EmailAddress)]
	[Remote(action: "IsNotEmail", controller: "Account")]
	public string Email { get; set; }
	[Required]
	[DataType(DataType.Password)]
	public string Password { get; set; }
	public bool RememberMe { get; set; }
}