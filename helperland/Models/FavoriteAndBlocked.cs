using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace helperland.Models;

public class FavoriteAndBlocked
{
#nullable disable
	[Key]
	public int Id { get; set; }
	[Required]
	public string UserId { get; set; }
	[Required]
	public string TargetUserId { get; set; }
	[Required]
	public bool IsFavorite { get; set; } = false;
	[Required]
	public bool IsBlocked { get; set; } = false;
	public virtual User FromUser { get; set; }
	public virtual User TargetUser { get; set; }
}