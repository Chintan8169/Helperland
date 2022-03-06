using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace helperland.Models;
public class User : IdentityUser
{
#nullable disable
	[Required]
	public string FirstName { get; set; }
	[Required]
	public string LastName { get; set; }
	[Required]
	public int UserTypeId { get; set; }
	public string UserProfilePhoto { get; set; }
	public bool IsRegisteredUser { get; set; }
	public string ZipCode { get; set; }
	public bool WorksWithPets { get; set; }
	public DateTime CreatedDate { get; set; }
	public DateTime ModifiedDate { get; set; }
	public int ModifiedBy { get; set; }
	public bool IsApproved { get; set; }

	public virtual ICollection<ServiceRequest> ServiceRequest { get; set; }
	public virtual ICollection<Rating> RatingFromUser { get; set; }
	public virtual ICollection<Rating> RatingToUser { get; set; }
	public virtual ICollection<FavoriteAndBlocked> FromUser { get; set; }
	public virtual ICollection<FavoriteAndBlocked> TargetUser { get; set; }

#nullable enable
	public int? Gender { get; set; }
	public DateTime? DateOfBirth { get; set; }
	public string? Language { get; set; }
	public string? Nationality { get; set; }
	public int? Status { get; set; }
}
