namespace helperland.ViewModels;

public class AdminUserManagementViewModel
{
#nullable disable
	public List<string> Names { get; set; }
	public string FirstName { get; set; }
	public string LastName { get; set; }
	public string UserId { get; set; }
	public int UserTypeId { get; set; }
	public DateTime RegisteredDate { get; set; }
	public string PhoneNumber { get; set; }
	public string ZipCode { get; set; }
	public bool IsApproved { get; set; }
	public bool IsRegisteredUser { get; set; }
	public IEnumerable<AdminUserManagementViewModel> viewModels { get; set; }
#nullable enable
	public string? City { get; set; }
}