
namespace OrderManager.Server.Models
{
    //Maps to the Employee table in the database
    public class Employee
    {
        public int EmployeeId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string MiddleInitial { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;

    }

    // Used to return additional details about the employee on the API
    public class EmployeeDetails : Employee
    {
        public int OrderCount { get; set; }
        public string DisplayName => $"{FirstName} {MiddleInitial} {LastName}";
    }
}
