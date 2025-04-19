using Dapper;
using Microsoft.AspNetCore.SignalR;
using OrderManager.Server.Hubs;
using OrderManager.Server.Models;
using System.Reflection.Metadata.Ecma335;

namespace OrderManager.Server.Data
{
    public class CustomerRepository :Repository
    {
        private readonly EventNotifier _eventNotifier;
        private readonly ILogger<CustomerRepository> _logger;

        public CustomerRepository(DBContext context, EventNotifier nottifier, ILogger<CustomerRepository> logger) : base(context)
        {
            _logger = logger;
            _eventNotifier = nottifier;
        }


        public async Task<IEnumerable<CustomerDetails>> GetAllAsync()
        {
            try
            {
                _logger.LogInformation("Get Customers Called");
                var sql = @"
                       SELECT 
                           c.CustomerId,
                           c.FirstName,
                           c.MiddleInitial,
                           c.LastName,
                           ISNULL(r.OrderCount, 0) AS OrderCount
                       FROM Customers c
                       LEFT JOIN (
                           SELECT CustomerId, COUNT(1) AS OrderCount 
                           FROM Orders 
                           GROUP BY CustomerId
                       ) r ON r.CustomerId = c.CustomerId                       
                     ";
                using var conn = _context.CreateConnection();
                var result = await conn.QueryAsync<CustomerDetails>(sql);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting customers: {Message}", ex.Message);
                throw;
            }
            
        }


        public async Task<CustomerDetails?>? GetCustomer(int customerId)
        {
            try
            {
                _logger.LogDebug($"Get Customer For ID: {customerId}");
                var sqlParams = new { CustomerId = customerId };

                var sql = @"
                       SELECT 
                           c.CustomerId,
                           c.FirstName,
                           c.MiddleInitial,
                           c.LastName,
                           ISNULL(r.OrderCount, 0) AS OrderCount
                       FROM Customers c
                       LEFT JOIN (
                           SELECT CustomerId, COUNT(1) AS OrderCount 
                           FROM Orders 
                           GROUP BY CustomerId
                       ) r ON r.CustomerId = c.CustomerId
                       WHERE c.CustomerId = @CustomerId
                     ";
                using var conn = _context.CreateConnection();
                return await conn.QuerySingleOrDefaultAsync<CustomerDetails>(sql, sqlParams);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting customer with ID {customerId}: {ex.Message}");
                throw;
            }
            
        }

        public async Task<int?> CreateCustomer( Customer newCustomer)
        {
            try
            {
                _logger.LogDebug($"Insert Customer: {newCustomer.ToString()}");
                var sql = @"
                    INSERT INTO Customers (FirstName, MiddleInitial, LastName)
                    VALUES (@FirstName, @MiddleInitial, @LastName);
                    SELECT CAST(SCOPE_IDENTITY() as int);";

                using var conn = _context.CreateConnection();
                var newId = await conn.ExecuteScalarAsync<int>(sql, newCustomer);

                if (newId > 0)
                {
                    _eventNotifier?.NotifyCustomerCreated(newId);
                    return newId;
                }

                return 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error creating customer: {ex.Message}");
                throw;
            }
            
            
        }


        public async Task<bool> UpdateCustomer(int customerId, Customer updateCustomer)
        {
            try
            {
                _logger.LogDebug($"Update Customer: {updateCustomer.ToString()}");
                updateCustomer.CustomerId = customerId;
                var sql = @"
                UPDATE Customers SET 
                FirstName = @FirstName,
                MiddleInitial = @MiddleInitial,
                LastName = @LastName
                WHERE CustomerID = @CustomerId";

                using var conn = _context.CreateConnection();
                var affectedRecords = await conn.ExecuteAsync(sql, updateCustomer);

                if (affectedRecords > 0)
                {
                    _eventNotifier?.NotifyCustomerUpdated(customerId);
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating customer: {ex.Message}");
                throw;
            }
            
        }

        public async Task<bool> DeleteCustomer(int customerId)
        {
            try
            {
                _logger.LogDebug($"Delete Customer: {customerId}");
                var sql = "DELETE FROM Customers WHERE customerId = @CustomerId ";
                var sqlParams = new { CustomerId = customerId };

                using var conn = _context.CreateConnection();
                var affectedRecords = await conn.ExecuteAsync(sql, sqlParams);

                if (affectedRecords > 0)
                {
                    _eventNotifier?.NotifyCustomerDeleted(customerId);
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting customer: {ex.Message}");
                throw;
            }
            
        }


    }

}
