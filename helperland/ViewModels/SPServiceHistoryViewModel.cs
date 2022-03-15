namespace helperland.ViewModels;

public class SPServiceHistoryViewModel
{
#nullable disable
	public int ServiceId { get; set; }
	public DateTime ServiceDate { get; set; }
	public double ServiceHours { get; set; }
	public string CustomerName { get; set; }
	public string StreetName { get; set; }
	public string HouseNumber { get; set; }
	public string City { get; set; }
	public string PostalCode { get; set; }
}