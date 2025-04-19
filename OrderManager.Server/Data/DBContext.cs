using Microsoft.Data.SqlClient;
using OrderManager.Server.Hubs;
using System.Data;

namespace OrderManager.Server.Data
{
    public class DBContext
    {
        private readonly IConfiguration _configuration;
        private readonly string? _connectionString;
        private readonly EventNotifier _eventNotifier;
        private readonly ILoggerFactory _loggerFactory;

        public DBContext(IConfiguration configuration, EventNotifier nottifier, ILoggerFactory loggerFactory)
        {
            _loggerFactory = loggerFactory;
            _configuration = configuration;
            _eventNotifier = nottifier;
            _connectionString = _configuration.GetConnectionString("DefaultConnection");
        }

        public IDbConnection CreateConnection()
            => new SqlConnection(_connectionString);


        //Object repositories
        public CustomerRepository Customers => new CustomerRepository(this, _eventNotifier, _loggerFactory.CreateLogger<CustomerRepository>());
        public OrdersRepository Orders => new OrdersRepository(this, _eventNotifier, _loggerFactory.CreateLogger<OrdersRepository>());
        public ProductRepository Products => new ProductRepository(this, _loggerFactory.CreateLogger<ProductRepository>());
        public EmployeesRepository Employees => new EmployeesRepository(this, _loggerFactory.CreateLogger<EmployeesRepository>());        

    }
}