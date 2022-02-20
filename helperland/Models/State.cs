using System.ComponentModel.DataAnnotations;

namespace helperland.Models;

public class State
{
#nullable disable
	[Key]
	[Required]
	public int StateId { get; set; }
	[Required]
	public string StateName { get; set; }
	public ICollection<City> City { get; set; }
}