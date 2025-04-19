using Dapper;
using OrderManager.Server.Models;

namespace OrderManager.Server.Data
{
    public class EmployeesRepository :Repository
    {
        private readonly ILogger<EmployeesRepository> _logger;

        public EmployeesRepository(DBContext context, ILogger<EmployeesRepository> logger) : base(context)
        {
            _logger = logger;
        }


        public async Task<IEnumerable<Employee>> GetAllAsync()
        {
            try
            {
                _logger.LogInformation("Get Employees Called");
                var sql = "SELECT * FROM Employees";
                using var conn = _context.CreateConnection();
                return await conn.QueryAsync<Employee>(sql);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting employees: {Message}", ex.Message);
                throw;
            }
            
        }

    }
}
