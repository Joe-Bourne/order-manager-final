using OrderManager.Server.Data;
using OrderManager.Server.Hubs;
using OrderManager.Server.Routes;


var builder = WebApplication.CreateBuilder(args);

//Configure Logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Order Manager API",
        Version = "v1",
        Description = "An API for managing Customers, Orders, Products, and Employees in the Order Management System.",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact() { Name = "Joe Bourne" }
    });
});


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(["http://localhost:5173", "http://localhost:8080"]) //5173 for debugging Vite, 8080 for docker
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });

});

//WebSockets magic
builder.Services.AddSignalR();
builder.Services.AddSingleton<EventNotifier>();

builder.Services.AddSingleton<DBContext>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapFallbackToFile("index.html"); //Essential for SPA to work



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("Docker"))
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors();
    // Reset the database for every run
    Console.WriteLine("Seeding Database...");
    SeedDatabase.RunSqlScript(app.Configuration, "DBScripts/Schema.sql");
}


Console.WriteLine($"Running in {app.Environment.EnvironmentName} environment.");

//Lets avoid certificate errros for this demo 
//app.UseHttpsRedirection();

//Map the various routes
SystemRoutes.MapRoutes(app);
CustomerRoutes.MapRoutes(app);
OrderRoutes.MapRoutes(app);
ProductRoutes.MapRoutes(app);
EmployeeRoutes.MapRoutes(app);
WebSocketsRoutes.MapRoutes(app);

app.Run();

