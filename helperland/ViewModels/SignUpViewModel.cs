using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace helperland.ViewModels;
public class SignUpViewModel
{
#nullable disable
	[Required]
	public int UserTypeId { get; set; }

	[Required(ErrorMessage = "First Name is required !")]
	public string FirstName { get; set; }
	[Required(ErrorMessage = "Last Name is required !")]
	public string LastName { get; set; }
	[Required(ErrorMessage = "Email is required !")]
	[DataType(DataType.EmailAddress)]
	[Remote(action: "IsEmailInUse", controller: "Account")]
	public string Email { get; set; }

	[Required(ErrorMessage = "Phone Number is required !")]
	[MinLength(10, ErrorMessage = "Phone number must be 10 digit long !")]
	[MaxLength(10, ErrorMessage = "Phone number must be 10 digit long !")]
	public string PhoneNumber { get; set; }

	[Required(ErrorMessage = "Password is required !")]
	[DataType(DataType.Password)]
	public string Password { get; set; }
	[Required(ErrorMessage = "Confirm Password is required !")]
	[Compare("Password", ErrorMessage = "Confirm Password is not matching !")]
	public string CPassword { get; set; }
}