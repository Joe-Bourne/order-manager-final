using Microsoft.AspNetCore.Mvc;
using OrderManager.Server.Data;
using OrderManager.Server.Models;

namespace OrderManager.Server.Routes
{
    public static class EmployeeRoutes
    {
        private class EmployeeRoutesLogger { }

        public static void MapRoutes(IEndpointRouteBuilder routes)
        {   
            //List employees
            routes.MapGet(ApiConstants.ApiRoutes.Employees, async (
                DBContext db, 
                ILogger<EmployeeRoutesLogger> logger) =>
            {
                try
                {
                    logger.LogInformation("Get Employees Called");
                    var employees = await db.Employees.GetAllAsync();
                    return employees?.Count() > 0
                        ? Results.Ok(employees)
                        : Results.NotFound();
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error getting employees: {Message}", ex.Message);
                    return Results.Problem("An error occurred while retrieving the employees.");
                }
            })
            .WithName("GetEmployeesList")
            .WithDescription("Get Employees List")
            .Produces<Employee>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .WithTags(ApiConstants.ApiTags.Employees);

        }

    }
}
