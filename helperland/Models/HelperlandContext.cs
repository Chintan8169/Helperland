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
	public DbSet<State> States { get; set; }
	public DbSet<City> Cities { get; set; }
	public DbSet<ZipCode> ZipCodes { get; set; }
	public DbSet<ServiceRequest> ServiceRequests { get; set; }
	public DbSet<ServiceRequestExtra> ServiceRequestExtras { get; set; }
	public DbSet<ServiceRequestAddress> ServiceRequestAddresses { get; set; }
	public DbSet<UserAddress> UserAddresses { get; set; }

	protected override void OnModelCreating(ModelBuilder builder)
	{
		base.OnModelCreating(builder);
	}
}