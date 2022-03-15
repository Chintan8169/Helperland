namespace helperland.ViewModels;

public class SPMyRatingsViewModel
{
#nullable disable
	public int ServiceId { get; set; }
	public string CustomerName { get; set; }
	public double ServiceHours { get; set; }
	public DateTime ServiceDate { get; set; }
	public decimal Ratings { get; set; }
	public string Comments { get; set; }

}