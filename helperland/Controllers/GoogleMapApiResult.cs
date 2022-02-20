namespace helperland.Controllers;

public class GoogleMapApiResult
{
#nullable disable
	public IEnumerable<string> destination_addresses { get; set; }
	public IEnumerable<string> origin_addresses { get; set; }
	public IEnumerable<Elements> rows { get; set; }
	public string status { get; set; }

}

public class TextValue
{
#nullable disable
	public string text { get; set; }
	public int value { get; set; }
}

public class Elements
{
#nullable disable
	public IEnumerable<Element> elements { get; set; }
}

public class Element
{
#nullable disable
	public TextValue distance { get; set; }
	public TextValue duration { get; set; }
	public string status { get; set; }
}