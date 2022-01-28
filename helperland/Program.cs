var builder = WebApplication.CreateBuilder(args);


builder.Services.AddMvc();
builder.Services.AddLogging();







var app = builder.Build();


app.UseFileServer();



app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute("default", "{controller=Static}/{action=Index}");



app.Run();
