using Dapper;
using OrderManager.Server.Models;

namespace OrderManager.Server.Data
{
    public class ProductRepository: Repository
    {
        private readonly ILogger<ProductRepository> _logger;

        public ProductRepository(DBContext context, ILogger<ProductRepository> logger ) : base(context)
        {
            _logger = logger;
        }        

        public async Task<IEnumerable<ProductDetails>> GetAllAsync()
        {
            try
            {
                _logger.LogInformation("Get Products Called");
                var sql = "SELECT * FROM Products";
                using var conn = _context.CreateConnection();
                return await conn.QueryAsync<ProductDetails>(sql);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products: {Message}", ex.Message);
                throw;
            }           
        }

        //TODO:
        //Add a new product
        //update the product
        //delete the product
        //Get a product by id

    }
}
