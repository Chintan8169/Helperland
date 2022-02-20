using System.ComponentModel.DataAnnotations;

namespace helperland.ViewModels;

public class LoginViewModel
{
#nullable disable
	[Required]
	[DataType(DataType.EmailAddress)]
	public string Email { get; set; }
	[Required]
	[DataType(DataType.Password)]
	public string Password { get; set; }
	public bool RememberMe { get; set; }
}