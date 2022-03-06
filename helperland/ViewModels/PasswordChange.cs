using System.ComponentModel.DataAnnotations;

public class PasswordChange
{
#nullable disable
	[Required(ErrorMessage = "Current Password is Required !")]
	public string CurrentPassword { get; set; }
	[Required(ErrorMessage = "New Password is Required !")]
	public string NewPassword { get; set; }
#nullable enable
	[Required(ErrorMessage = "Confirm New Password is Required !")]
	[Compare("NewPassword", ErrorMessage = "Confirm New Password is not matching new Password !")]
	public string? CNewPassword { get; set; }
}