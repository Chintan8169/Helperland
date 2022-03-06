using System.ComponentModel.DataAnnotations;

public class AddNewAddressViewModel
{
#nullable disable
	[Required(ErrorMessage = "Street Name is Required !")]
	public string StreetName { get; set; }
	[Required(ErrorMessage = "House Number is Required !")]
	public string HouseNumber { get; set; }
	[Required(ErrorMessage = "Postal Code is Required !")]
	public string PostalCode { get; set; }
	[Required(ErrorMessage = "City is Required !")]
	public string City { get; set; }
	[Required(ErrorMessage = "Phone Number is Required !")]
	[RegularExpression(@"^([+]\d{2}[ ])?\d{10}$", ErrorMessage = "Enter Proper Mobile Number")]
	public string PhoneNumber { get; set; }

#nullable enable
	public int? AddressId { get; set; }
}