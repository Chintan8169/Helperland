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
	public DbSet<Rating> Ratings { get; set; }
	public DbSet<FavoriteAndBlocked> FavoriteAndBlocked { get; set; }

	protected override void OnModelCreating(ModelBuilder builder)
	{
		base.OnModelCreating(builder);
		builder.Entity<FavoriteAndBlocked>(entity =>
		{
			entity.HasOne(fab => fab.FromUser)
				.WithMany(u => u.FromUser)
				.HasForeignKey(fab => fab.UserId)
				.OnDelete(DeleteBehavior.NoAction);

			entity.HasOne(fab => fab.TargetUser)
				.WithMany(u => u.TargetUser)
				.HasForeignKey(fab => fab.TargetUserId)
				.OnDelete(DeleteBehavior.NoAction);
		});

		builder.Entity<Rating>(entity =>
		{
			entity.HasOne(r => r.RatingFromUser)
				.WithMany(u => u.RatingFromUser)
				.HasForeignKey(r => r.RatingFrom)
				.OnDelete(DeleteBehavior.NoAction);

			entity.HasOne(r => r.RatingToUser)
				.WithMany(u => u.RatingToUser)
				.HasForeignKey(r => r.RatingTo)
				.OnDelete(DeleteBehavior.NoAction);

			entity.HasOne(r => r.RatingNavigation)
				.WithMany(sr => sr.RatingNavigation)
				.HasForeignKey(r => r.ServiceRequestId)
				.OnDelete(DeleteBehavior.NoAction);
		});
	}
}