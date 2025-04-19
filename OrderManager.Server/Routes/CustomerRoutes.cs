using Microsoft.AspNetCore.Mvc;
using OrderManager.Server.Data;
using OrderManager.Server.Models;

namespace OrderManager.Server.Routes
{
    public static class CustomerRoutes
    {   //Keep all the Customer routes in here

        private class CustomerRoutesLogger { }

        public static void MapRoutes(IEndpointRouteBuilder routes)
        {
            //Get List of customers
            routes.MapGet(ApiConstants.ApiRoutes.Customers, async (
                DBContext db, 
                ILogger<CustomerRoutesLogger> logger) =>
            {
                try
                {
                    logger.LogInformation("Get Customers Called");
                    var customers = await db.Customers.GetAllAsync();
                    return customers?.Count() > 0
                        ? Results.Ok(customers)
                        : Results.NotFound();
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error getting customers: {Message}", ex.Message);
                    return Results.Problem("An error occurred while retrieving the customers.");
                }
            })
            .WithName("GetCustomersList")
            .WithDescription("Get Customer List")
            .Produces<CustomerDetails>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .WithTags(ApiConstants.ApiTags.Customers);


            //Get Single Customer Summary
            routes.MapGet(ApiConstants.ApiRoutes.CustomerById, async (
                DBContext db,
                int customerId, 
                ILogger<CustomerRoutesLogger> logger) =>
            {
                try
                {
                    logger.LogDebug($"Get Customer For ID: {customerId}");
                    CustomerDetails? customer = await db.Customers.GetCustomer(customerId);
                    return customer is not null
                        ? Results.Ok(customer)
                        : Results.NotFound();
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, $"Error getting customer with ID {customerId}: {ex.Message}");
                    return Results.Problem("An error occurred while retrieving the customer.");
                }
            })
            .WithName("GetCustomerForID")
            .WithDescription("Get Customer For ID")
            .Produces<CustomerDetails>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .WithTags(ApiConstants.ApiTags.Customers);



            //Insert Customer
            routes.MapPost(ApiConstants.ApiRoutes.Customers, async (
                DBContext db, 
                Customer customer, 
                ILogger<CustomerRoutesLogger> logger) =>
            {
                try
                {
                    logger.LogDebug($"Insert Customer: {customer.ToString()}");
                    var id = await db.Customers.CreateCustomer(customer);
                    return id > 0
                        ? Results.Created(ApiConstants.ApiRoutes.CustomerById, new { id })
                        : Results.BadRequest("Failed to create customer");
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, $"Error creating customer: {ex.Message}");
                    return Results.Problem("An error occurred while creating the customer.");
                }
            })
            .WithName("InsertCustomer")
            .WithDescription("Insert Customer")
            .Produces<CustomerDetails>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .WithTags(ApiConstants.ApiTags.Customers);



            //Update Customer
            routes.MapPut(ApiConstants.ApiRoutes.CustomerById, async (
                DBContext db,
                int customerId, 
                Customer updatedCustomer,
                ILogger<CustomerRoutesLogger> logger) =>
            {
                try
                {
                    logger.LogDebug($"Update Customer: {updatedCustomer.ToString()}");
                    var success = await db.Customers.UpdateCustomer(customerId, updatedCustomer);
                    return success
                        ? Results.Ok()
                        : Results.NotFound($"Customer with ID {customerId} not found.");
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, $"Error updating customer with ID {customerId}: {ex.Message}");
                    return Results.Problem("An error occurred while updating the customer.");
                }
            })
            .WithName("Update Customer")
            .WithDescription("Update Customer")
            .Produces<CustomerDetails>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .WithTags(ApiConstants.ApiTags.Customers);



            //Delete Customer
            routes.MapDelete(ApiConstants.ApiRoutes.CustomerById, async (
                DBContext db,
                int customerId, 
                ILogger<CustomerRoutesLogger> logger) =>
            {
                try
                {
                    logger.LogDebug($"Delete Customer: {customerId.ToString()}");
                    var success = await db.Customers.DeleteCustomer(customerId);
                    return success
                        ? Results.Ok()
                        : Results.NotFound($"Failed to delete Customer with ID {customerId}.");
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, $"Error deleting customer with ID {customerId}: {ex.Message}");
                    return Results.Problem("An error occurred while deleting the customer.");
                }
            })
            .WithName("Delete Customer")
            .WithDescription("Delete Customer")
            .Produces<CustomerDetails>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .WithTags(ApiConstants.ApiTags.Customers);

        }
    }
}
