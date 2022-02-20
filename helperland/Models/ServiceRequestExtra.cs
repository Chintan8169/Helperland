using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace helperland.Models;

public class ServiceRequestExtra
{
#nullable disable
	[Key]
	public int ServiceRequestExtraId { get; set; }
	[Required]
	[ForeignKey("ServiceRequestId")]
	public int ServiceRequestId { get; set; }
	[Required]
	public int ServiceExtraId { get; set; }

	public virtual ServiceRequest SerivceRequest { get; set; }
}