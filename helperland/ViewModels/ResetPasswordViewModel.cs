using System.ComponentModel.DataAnnotations;

namespace helperland.ViewModels;

public class ResetPasswordViewModel
{
#nullable disable
	public string Email { get; set; }
	[Required(ErrorMessage = "Password is required !")]
	[DataType(DataType.Password)]
	public string Password { get; set; }
	[Required(ErrorMessage = "Confirm Password is required !")]
	[DataType(DataType.Password)]
	[Compare("Password", ErrorMessage = "Confirm Password is not matching with password !")]
	public string CPassword { get; set; }

}