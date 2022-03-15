using helperland.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using helperland.Controllers;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddMvc();
builder.Services.AddLogging();
builder.Services.AddHttpClient();
builder.Services.AddDbContextPool<HelperlandContext>(option =>
	option.UseSqlServer(builder.Configuration.GetConnectionString("DBConnection"))
);
builder.Services.AddIdentity<User, IdentityRole>()
.AddEntityFrameworkStores<HelperlandContext>()
.AddDefaultTokenProviders();
builder.Services.AddScoped<Email>();



var app = builder.Build();

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute("default", "{controller=Static}/{action=Index}");



app.Run();
