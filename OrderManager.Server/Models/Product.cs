namespace OrderManager.Server.Models
{
    //Maps to the Product table in the database
    public class Product
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; } = 0;

    }

    //Used to return additional details about the product on the API
    public class ProductDetails : Product
    {
        //public int OrderCount { get; set; }
        public string DisplayName => $"{Name} - {Price:C}";
    }
}
