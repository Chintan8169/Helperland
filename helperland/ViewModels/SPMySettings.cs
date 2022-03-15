using System.ComponentModel.DataAnnotations;

namespace helperland.ViewModels;

public class SPMySettings
{
#nullable disable
	public PasswordChange PasswordChange { get; set; }
	public SPDetails SPDetails { get; set; }
}


public class SPDetails
{
	[Required(ErrorMessage = "First Name is Required !")]
	public string FirstName { get; set; }
	[Required(ErrorMessage = "Last Name is Required !")]
	public string LastName { get; set; }
	[DataType(DataType.EmailAddress)]
	[Required(ErrorMessage = "Emal is Required !")]
	public string Email { get; set; }
	[Required(ErrorMessage = "Phone Number is Required !")]
	public string PhoneNumber { get; set; }
	[Required(ErrorMessage = "Nationality is Required !")]
	public string Nationality { get; set; }
	[Required(ErrorMessage = "Select any Gender !")]
	public int? Gender { get; set; }
	[Required(ErrorMessage = "Street Name is Required !")]
	public string StreetName { get; set; }
	[Required(ErrorMessage = "House Number is Required !")]
	public string HouseNumber { get; set; }
	[Required(ErrorMessage = "Postal Code is Required !")]
	public string PostalCode { get; set; }
	[Required(ErrorMessage = "City is Required !")]
	public string City { get; set; }
	[Required(ErrorMessage = "Day is Required !")]
	public int Day { get; set; }
	[Required(ErrorMessage = "Month is Required !")]
	public int Month { get; set; }
	[Required(ErrorMessage = "Year is Required !")]
	public int Year { get; set; }
	[Required(ErrorMessage = "Profile Picture is Required !")]
	public string Profile { get; set; }
}