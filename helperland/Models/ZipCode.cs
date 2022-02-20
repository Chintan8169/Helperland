using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace helperland.Models;

public class ZipCode
{
#nullable disable
	[Key]
	[Required]
	public int ZipCodeId { get; set; }
	[Required]
	public string ZipCodeValue { get; set; }
	[Required]
	[ForeignKey("CityId")]
	public int CityId { get; set; }

	public virtual City City { get; set; }
}