namespace OrderManager.Server.Routes
{   
    public static class ApiConstants
    {
        public static class ApiRoutes
        {   //Constants for routes
            public const string Customers = "/api/customers";
            public const string CustomerById = "/api/customers/{customerId}";
            public const string CustomerOrders = "/api/customers/{customerId}/orders";

            public const string Employees = "/api/employees";
            public const string Products = "/api/products";
            public const string Orders = "/api/orders";
            public const string OrderById = "/api/orders/{orderId}";

            public const string Ping = "/api/ping";
            public const string WebSockets = "/api/events";

        }

        //Tag/Category names for Swagger
        public static class ApiTags
        {
            public const string System = "System";
            public const string Customers = "Customers";
            public const string Orders = "Orders";
            public const string Products = "Products";
            public const string Employees = "Employees";
        }
    }

    

}
