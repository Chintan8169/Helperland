using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace helperland.Models;

public class Rating
{
#nullable disable
	[Key]
	public int RatingId { get; set; }
	[Required]
	public int ServiceRequestId { get; set; }
	[Required]
	public string RatingFrom { get; set; }
	[Required]
	public string RatingTo { get; set; }
	[Required]
	[Column(TypeName = "decimal(16,2)")]
	public decimal Ratings { get; set; }
	public string Comments { get; set; }
	[Required]
	public DateTime RatingDate { get; set; }
	[Required]
	[Column(TypeName = "decimal(16,2)")]
	public decimal OnTimeArrival { get; set; }
	[Required]
	[Column(TypeName = "decimal(16,2)")]
	public decimal Friendly { get; set; }
	[Required]
	[Column(TypeName = "decimal(16,2)")]
	public decimal QualityOfService { get; set; }
	public virtual User RatingFromUser { get; set; }
	public virtual User RatingToUser { get; set; }
	public virtual ServiceRequest RatingNavigation { get; set; }
}