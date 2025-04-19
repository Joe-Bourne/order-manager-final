using OrderManager.Server.Hubs;


namespace OrderManager.Server.Routes
{
    public static class WebSocketsRoutes
    {
        //private class WebSocketsRoutesLogger { }

        public static void MapRoutes(IEndpointRouteBuilder routes)
        {
            routes.MapHub<AppEventsHub>(ApiConstants.ApiRoutes.WebSockets);
        }

    }
}
