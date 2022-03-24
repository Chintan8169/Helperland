using System.ComponentModel.DataAnnotations;

namespace helperland.ViewModels;

public class AdminRescheduleViewModel
{
#nullable disable
	[Required]
	public int ServiceId { get; set; }
	[Required]
	public string RescheduleDate { get; set; }
	[Required]
	public decimal RescheduleTime { get; set; }
	[Required]
	public string StreetName { get; set; }
	[Required]
	public string HouseNumber { get; set; }
	[Required]
	public string PostalCode { get; set; }
	[Required]
	public string City { get; set; }
	[Required]
	public string RescheduleReason { get; set; }
}