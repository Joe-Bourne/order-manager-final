using Microsoft.AspNetCore.Mvc;
using OrderManager.Server.Data;
using OrderManager.Server.Models;

namespace OrderManager.Server.Routes
{
    public static class ProductRoutes
    {
        private class ProductRoutesLogger { }

        public static void MapRoutes(IEndpointRouteBuilder routes)
        {
            //List products
            routes.MapGet(ApiConstants.ApiRoutes.Products, async (
                DBContext db, 
                ILogger<ProductRoutesLogger> logger) =>
            {
                try
                {
                    logger.LogInformation("Get Products Called");
                    var products = await db.Products.GetAllAsync();
                    return products?.Count() > 0
                        ? Results.Ok(products)
                        : Results.NotFound();
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error getting products: {Message}", ex.Message);
                    return Results.Problem("An error occurred while retrieving the products.");
                }
            })
            .WithName("GetProductsList")
            .WithDescription("Get Products List")
            .Produces<IEnumerable<ProductDetails>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .WithTags(ApiConstants.ApiTags.Products);
        }
    }
}
