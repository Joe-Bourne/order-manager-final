using Dapper;
using OrderManager.Server.Hubs;
using OrderManager.Server.Models;

namespace OrderManager.Server.Data
{
    public class OrdersRepository :Repository
    {
        private readonly EventNotifier _eventNotifier;
        private readonly ILogger<OrdersRepository> _logger;

        //Inject the DB context and the event notifier 
        public OrdersRepository(DBContext context, EventNotifier notifier, ILogger<OrdersRepository> logger) : base(context)
        {
            _logger = logger;
            _eventNotifier = notifier;
        }

        public async Task<IEnumerable<OrderDetails>?>? GetOrdersForCustomer(Customer? customer) => await GetOrdersForCustomer(customer.CustomerId);
        public async Task<IEnumerable<OrderDetails>?>? GetOrdersForCustomer(int customerId)
        {
            try
            {
                _logger.LogDebug($"Get Order For Customer: {customerId}");
                var sql = @" 
                        SELECT 
                            o.OrderId,
                            o.Quantity,                 
                            p.Price * o.Quantity as OrderTotal,
                            c.CustomerId, c.FirstName, c.MiddleInitial, c.LastName,
                            p.ProductId, p.Name, p.Price,
                            e.EmployeeId, e.FirstName, e.MiddleInitial, e.LastName
                        FROM Orders o
                        JOIN Customers c ON o.CustomerId = c.CustomerId
                        JOIN Products p ON o.ProductId = p.ProductId
                        JOIN Employees e ON o.SalesPersonId = e.EmployeeId
                        WHERE o.CustomerId = @CustomerId
                       ";


                using var conn = _context.CreateConnection();
                //Use Dapper Multimapping to nest the objects in the OrderSummery
                var orders = await conn.QueryAsync<OrderDetails, Customer, Product, Employee, OrderDetails>(
                    sql,
                     (order, customer, product, employee) =>
                     {
                         order.Customer = customer;
                         order.Product = product;
                         order.SalesPerson = employee;
                         return order;
                     },
                     param: new { CustomerId = customerId },

                    splitOn: "CustomerId,ProductId,EmployeeId"
                );

                return orders;

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting orders for customer with ID {customerId}: {ex.Message}");
                throw;
            }
            
        }



        public async Task<int> CreateOrder(Order order)
        {
            try
            {
                _logger.LogDebug($"Add Order: {order.ToString()}");
                var sql = @"
                        INSERT INTO Orders (CustomerId, SalesPersonId, ProductId, Quantity )
                        VALUES (@CustomerId, @SalesPersonId, @ProductId, @Quantity);
                        SELECT CAST(SCOPE_IDENTITY() as int);
                       ";

                using var conn = _context.CreateConnection();
                var id = await conn.ExecuteScalarAsync<int>(sql, order);

                if (id > 0)
                {
                    order.OrderId = id;
                    await _eventNotifier.NotifyOrderCreated(order);
                }
                return id;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error creating order: {ex.Message}");
                throw;
            }
            
        }


        public async Task<bool> DeleteOrder(Order order) => await DeleteOrder(order.CustomerId, order.OrderId);

        //requires CustomerID and OrderID to help prevent accidently deletions
        public async Task<bool> DeleteOrder(int customerId, int orderId)
        {
            try
            {
                _logger.LogDebug($"Delete Order: {orderId.ToString()}");
                var sql = "DELETE FROM Orders WHERE CustomerId =@CustomerId AND  OrderId = @OrderId";
                var order = new Order { CustomerId = customerId, OrderId = orderId };
                //var sqlParams = new { CustomerId = customerId,    OrderId = orderId };

                using var conn = _context.CreateConnection();
                var affectedRecords = await conn.ExecuteAsync(sql, order);

                if (affectedRecords > 0)
                    await _eventNotifier.NotifyOrderDeleted(order);

                return affectedRecords == 1;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting order with ID {orderId}: {ex.Message}");
                throw;
            }

            
        }

    }
}
