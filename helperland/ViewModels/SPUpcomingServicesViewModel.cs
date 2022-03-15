namespace helperland.ViewModels;

public class SPUpcomingServicesViewModel
{
#nullable disable
	public int ServiceId { get; set; }
	public string UserId { get; set; }
	public DateTime ServiceDate { get; set; }
	public double ServiceHours { get; set; }
	public string CustomerName { get; set; }
	public string StreetName { get; set; }
	public string HouseNumber { get; set; }
	public string City { get; set; }
	public string PostalCode { get; set; }
	public decimal Payment { get; set; }
	public string RecordVersion { get; set; }
}