using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace helperland.Models;

public class ServiceRequestAddress
{
#nullable disable
	[Key]
	public int Id { get; set; }
	public virtual ServiceRequest ServiceRequest { get; set; }
#nullable enable
	[ForeignKey("ServiceRequestId")]
	public int? ServiceRequestId { get; set; }
	public string? AddressLine1 { get; set; }
	public string? AddressLine2 { get; set; }
	public string? City { get; set; }
	public string? State { get; set; }
	public string? PostalCode { get; set; }
	public string? Mobile { get; set; }
	public string? Email { get; set; }
}