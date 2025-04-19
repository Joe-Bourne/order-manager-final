using Microsoft.Data.SqlClient;

namespace OrderManager.Server.Data
{
    public static class SeedDatabase
    {
        //This class runs the SQL setup script to create the database schema and populate with some sample data.
        // SqlCommand doesnt allow you to switch databases part way through and in the beginning there is no database to populate
        // So we first connect to Master, create our [OrderManagerDb] then connect to [OrderManagerDb] to continue setup.
        // The script remains compatible with SQL managerment studio and can be run as a single script in SSMS
        public static void RunSqlScript(IConfiguration configuration, string scriptPath)
        {
            try
            {
                //inline function for running scripts
                var runScript = (string connectionName, string script) =>
                {
                    Console.WriteLine($"Connecting to SQL Server: {connectionName}...");
                    var connectionString = configuration.GetConnectionString(connectionName);
                    Console.WriteLine($"ConnectionString: {connectionString}");
                    using (var connection = new SqlConnection(connectionString))
                    {
                        connection.Open();
                        using var command = new SqlCommand(script, connection);
                        command.ExecuteNonQuery();
                    };
                };

                //we cant switch databaseses mid flow, so we break into two scripts, 
                var sql = File.ReadAllText(scriptPath);                
                var scripts = sql.Split("USE OrderManagerDb;"); //Split where we swap databases

                //Run each of the script sections
                runScript("SetupConnection", scripts[0]);
                runScript("DefaultConnection", scripts[1]);
                

                Console.WriteLine("SQL init script executed successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error running SQL init script: {ex.Message}");
                throw;
            }
        }

    }
}
