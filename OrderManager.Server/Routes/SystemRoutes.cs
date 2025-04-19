using Microsoft.AspNetCore.Mvc;
using OrderManager.Server.Models;

namespace OrderManager.Server.Routes
{
    public static class SystemRoutes
    {
        private class SystemRoutesLogger { }

        public static void MapRoutes(IEndpointRouteBuilder routes)
        {
            // This is our Ping server - the client pings this endpoint to check the API in online.
            // It also helps to keep the server alive 
            routes.MapGet(ApiConstants.ApiRoutes.Ping, (
                ILogger<SystemRoutesLogger> logger) =>
                 {
                     try
                     {
                         logger.LogDebug("Ping received at {time}", DateTime.UtcNow);
                         return Results.Ok("pong");
                     }
                     catch (Exception ex)
                     {
                         logger.LogError(ex, "Error pinging server: {Message}", ex.Message);
                         return Results.Problem("An error occurred while pinging the server.");
                     }
                 })
                .WithName("PingServer")
                .WithDescription("Ping the server to see if its alive")
                .Produces(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status404NotFound)
                .WithTags(ApiConstants.ApiTags.System);
        }

    }
}
