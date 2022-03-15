namespace helperland.ViewModels;

public class CustomerFavoutiteAndBlockedViewModel
{
#nullable disable
	public string SPId { get; set; }
	public string SPName { get; set; }
	public int TotalCleaning { get; set; }
	public decimal AvgRating { get; set; }
	public string SPProfile { get; set; }
	public bool IsBlocked { get; set; }
	public bool IsFavorite { get; set; }
}