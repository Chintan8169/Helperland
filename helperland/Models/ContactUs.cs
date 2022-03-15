using System.ComponentModel.DataAnnotations;
namespace helperland.Models;
public class ContactUs
{
#nullable disable
	[Key]
	public int ContactUsId { get; set; }

	[Required]
	public string Name { get; set; }

	[Required]
	public Int64 PhoneNumber { get; set; }

	[Required]
	[DataType(DataType.EmailAddress)]
	public string Email { get; set; }

	[Required]
	public string Subject { get; set; }

	[Required]
	public string Message { get; set; }

#nullable enable
	public string? UploadedFileName { get; set; }

	public DateTime? CreatedOn { get; set; }
	public string? CreatedBy { get; set; }
}