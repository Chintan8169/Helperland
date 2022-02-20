using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace helperland.Models;
public class City
{
#nullable disable
	[Key]
	[Required]
	public int CityId { get; set; }
	[Required]
	public string CityName { get; set; }
	[ForeignKey("StateId")]
	public int StateId { get; set; }

	public virtual State State { get; set; }
	public virtual ICollection<ZipCode> ZipCode { get; set; }
}
