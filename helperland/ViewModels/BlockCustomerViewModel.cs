namespace helperland.ViewModels;
public class BlockCustomerViewModel
{
#nullable disable
	public string UserId { get; set; }
	public string CustomerName { get; set; }
	public bool IsBlocked { get; set; }
}

public class BlockCustomerSubmitViewModel
{
	public string UserId { get; set; }
	public bool IsBlocked { get; set; }
}