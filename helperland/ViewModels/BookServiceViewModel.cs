using System.ComponentModel.DataAnnotations;

namespace helperland.ViewModels;
public class BookServiceViewModel
{
#nullable disable
	public BookServiceSubmitViewModel bookServiceSubmitViewModel { get; set; }
	public AddNewAddressViewModel addNewAddressViewModel { get; set; }
}

public class BookServiceSubmitViewModel
{
#nullable disable
	[Required(ErrorMessage = "ZipCode is required !")]
	[RegularExpression(@"[0-9]{5}", ErrorMessage = "Enter Valid ZipCode !")]
	public string ZipCode { get; set; }

	[Required(ErrorMessage = "Service Date is required !")]
	[RegularExpression(@"([0-9]){2}/([0-9]){2}/([0-9]){4}", ErrorMessage = "Enter Valid Date !")]
	public string ServiceDate { get; set; }
	[Required(ErrorMessage = "Service Start Time is required !")]
	public float ServiceStartTime { get; set; }
	public int AddressId { get; set; }
	public bool HasPets { get; set; }
	public float ServiceBasicHours { get; set; }
#nullable enable
	public IEnumerable<int>? ExtraServices { get; set; }
	public string? ServiceProviderId { get; set; }
	public string? Comments { get; set; }
}