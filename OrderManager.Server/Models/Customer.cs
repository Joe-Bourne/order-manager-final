
namespace OrderManager.Server.Models
{
    //Maps to the Customer table in the database
    public class Customer
    {
        public int CustomerId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string MiddleInitial { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
    }

    //Used to return additional details about the customer on the API
    public class CustomerDetails:Customer
    {
        public int OrderCount { get; set; }
        public string DisplayName => $"{FirstName} {MiddleInitial} {LastName}";
    }

}
