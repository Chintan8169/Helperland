using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace helperland.Models;

public class UserAddress
{
#nullable disable
	[Key]
	public int AddressId { get; set; }
	[ForeignKey("Id")]
	public string UserId { get; set; }
	[Required]
	public string AddressLine1 { get; set; }
	[Required]
	public string City { get; set; }
	[Required]
	public string PostalCode { get; set; }
	[Required]
	public bool IsDefault { get; set; }
	[Required]
	public bool IsDeleted { get; set; }
	public virtual User User { get; set; }
#nullable enable
	public string? Mobile { get; set; }
	public string? Email { get; set; }
	public string? State { get; set; }
	public string? AddressLine2 { get; set; }

}