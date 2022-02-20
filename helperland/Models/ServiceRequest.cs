using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace helperland.Models;

public class ServiceRequest
{
#nullable disable
	[Key]
	public int ServiceRequestId { get; set; }
	[Required]
	public string UserId { get; set; }
	[Required]
	public int ServiceId { get; set; }
	[Required]
	public DateTime ServiceStartDate { get; set; }
	[Required]
	public string ZipCode { get; set; }
	[Required]
	public double ServiceHours { get; set; }
	[Required]
	[Column(TypeName = "decimal(16,2)")]
	public decimal SubTotal { get; set; }
	[Required]
	[Column(TypeName = "decimal(16,2)")]
	public decimal TotalCost { get; set; }
	public bool PaymentDue { get; set; }
	[Required]
	public bool HasPets { get; set; }
	[Required]
	public DateTime CreatedDate { get; set; }
	[Required]
	public DateTime ModifiedDate { get; set; }
	[Required]
	[Column(TypeName = "decimal(16,2)")]
	public decimal Distance { get; set; }
	[ForeignKey("UserId")]
	public virtual User User { get; set; }
	[ForeignKey("ServiceProviderId")]
	[InverseProperty("ServiceRequest")]
	public virtual User ServiceProvider { get; set; }
	public virtual ICollection<ServiceRequestExtra> ServiceRequestExtra { get; set; }
	public virtual ICollection<ServiceRequestAddress> ServiceRequestAddress { get; set; }
#nullable enable
	public string? ServiceProviderId { get; set; }
	[Column(TypeName = "decimal(16,2)")]
	public decimal? ServiceHourlyRate { get; set; }
	public string? Comments { get; set; }
	public double? ExtraHours { get; set; }
	[Column(TypeName = "decimal(16,2)")]
	public decimal? Discount { get; set; }
	public string? PaymentTransactionRefNo { get; set; }
	public DateTime? SpacceptedDate { get; set; }
	public int? Status { get; set; }
	public int? ModifiedBy { get; set; }
	[Column(TypeName = "decimal(16,2)")]
	public decimal? RefundedAmount { get; set; }

	public bool? HasIssue { get; set; }
	public bool? PaymentDone { get; set; }
	public Guid? RecordVersion { get; set; }
}