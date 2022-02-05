using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace helperland.Models;

public class HelperlandContext : IdentityDbContext<User>
{
	public HelperlandContext(DbContextOptions options) : base(options)
	{

	}

#nullable disable
	public DbSet<ContactUs> ContactUs { get; set; }

	protected override void OnModelCreating(ModelBuilder builder)
	{
		base.OnModelCreating(builder);
	}
}