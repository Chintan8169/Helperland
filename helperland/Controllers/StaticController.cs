using Microsoft.AspNetCore.Mvc;

namespace helperland.Controllers;
public class StaticController : Controller
{
	public IActionResult Index()
	{
		return View();
	}
	public IActionResult About()
	{
		return View();
	}
	public IActionResult Faq()
	{
		return View();
	}
	public IActionResult Prices()
	{
		return View();
	}
	public IActionResult ContactUs()
	{
		return View();
	}

}