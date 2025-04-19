using Microsoft.AspNetCore.Mvc;
using OrderManager.Server.Data;
using OrderManager.Server.Models;

namespace OrderManager.Server.Routes
{
    public static class OrderRoutes
    {
        private class OrdersRouterLogger { }
        public static void MapRoutes(IEndpointRouteBuilder routes)
        {  

            routes.MapGet(ApiConstants.ApiRoutes.CustomerOrders, async (
                DBContext db, 
                int customerId, 
                ILogger<OrdersRouterLogger> logger) =>
            {
                try
                {
                    logger.LogDebug($"Get Order For Customer: {customerId}");
                    var orders = await db.Orders.GetOrdersForCustomer(customerId);

                    return orders?.Count() > 0
                        ? Results.Ok(orders)
                        : Results.Ok(new List<OrderDetails>());
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, $"Error getting orders for customer with ID {customerId}: {ex.Message}");
                    return Results.Problem("An error occurred while retrieving the orders.");
                }
            })
            .WithName("GetCustomerOrdersList")
            .WithDescription("Get Orders for a customer")
            .Produces<IEnumerable<OrderDetails>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .WithTags(ApiConstants.ApiTags.Orders);

            //Add Order
            routes.MapPost(ApiConstants.ApiRoutes.Orders, async (
                DBContext db, 
                Order order, 
                ILogger<OrdersRouterLogger> logger) =>
            {
                try
                {
                    logger.LogDebug($"Add Order: {order.ToString()}");
                    var id = await db.Orders.CreateOrder(order);

                    return id > 0
                        ? Results.Created($"{ApiConstants.ApiRoutes.Orders}/{id}", new { id })
                        : Results.BadRequest("Failed to create order.");
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, $"Error creating order: {ex.Message}");
                    return Results.Problem("An error occurred while creating the order.");
                }
            })
            .WithName("AddOrder")
            .WithDescription("Add and order for a customer")
            .Produces<string>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .WithTags(ApiConstants.ApiTags.Orders);



            //requires CustomerID and OrderID to help prevent accidently deletions
            routes.MapDelete(ApiConstants.ApiRoutes.Orders, async (
                DBContext db, 
                int customerId, 
                int orderId, 
                ILogger<OrdersRouterLogger> logger) =>
            {
                try
                {
                    logger.LogDebug($"Delete Order: {orderId.ToString()}");
                    var deleted = await db.Orders.DeleteOrder(customerId, orderId);

                    return deleted
                        ? Results.Ok("Order Deleted")
                        : Results.BadRequest("Failed to delete order.");
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, $"Error deleting order: {ex.Message}");
                    return Results.Problem("An error occurred while deleting the order.");
                }
            })
            .WithName("DeleteOrder")
            .WithDescription("Add and order for a customer")
            .Produces<string>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .WithTags(ApiConstants.ApiTags.Orders);



        }

    }
}
