using System.ComponentModel.DataAnnotations;

namespace helperland.ViewModels;

public class CustomerSettingsViewModel
{
#nullable disable
	[Required]
	public Details Details { get; set; }
	public PasswordChange PasswordChange { get; set; }

	public AddNewAddressViewModel AddNewAddressViewModel { get; set; }
}

public class Details
{
#nullable disable
	[Required(ErrorMessage = "First Name is  Required !")]
	public string FirstName { get; set; }
	[Required(ErrorMessage = "Last Name is Required !")]
	public string LastName { get; set; }
	[Required]
	public string Email { get; set; }
	[Required]
	public string PhoneNumber { get; set; }
	public int Day { get; set; }
	public int Month { get; set; }
	public int Year { get; set; }
	public string Language { get; set; }

}