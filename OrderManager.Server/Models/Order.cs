namespace OrderManager.Server.Models
{
    //Maps to the Order table in the database
    public class Order
    {
        public int OrderId { get; set; }
        public int CustomerId { get; set; }
        public int SalesPersonId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    //Used to return nested details about the order on the API
    public class OrderDetails
    {
        public int OrderId { get; set; }
        public int Quantity { get; set; }
        public decimal OrderTotal { get; set; }
        public Customer?  Customer { get; set; }
        public  Employee? SalesPerson { get; set; }
        public Product? Product { get; set; }

        
        //public decimal Price { get; set; } = 0;
        //public decimal OrderTotal => Product.Price * this.Quantity;


    }

}
