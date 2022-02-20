using System.ComponentModel.DataAnnotations;

namespace helperland.ViewModels;
public class ContactUsViewModel
{
#nullable disable
	[Required(ErrorMessage = "First Name is Required !")]
	[MinLength(3)]
	public string FirstName { get; set; }


	[Required(ErrorMessage = "Last Name is Required !")]
	[MinLength(3)]
	public string LastName { get; set; }

	[Required(ErrorMessage = "Phone Number is Required !")]
	[MinLength(10, ErrorMessage = "Phone number must be 10 digit long !")]
	[MaxLength(10, ErrorMessage = "Phone number must be 10 digit long !")]
	public string PhoneNumber { get; set; }

	[Required(ErrorMessage = "Email is Required !")]
	[DataType(DataType.EmailAddress)]
	public string Email { get; set; }


	public string Subject { get; set; }


	[Required(ErrorMessage = "Message is required !")]
	public string Message { get; set; }

#nullable enable
	public IFormFile? File { get; set; }
}