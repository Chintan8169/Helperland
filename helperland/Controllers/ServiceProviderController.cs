using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace helperland.Controllers;
public class ServiceProviderController : Controller
{
	[Authorize(Roles = "Admin,ServiceProvider")]
	public IActionResult Index()
	{
		return View();
	}
}