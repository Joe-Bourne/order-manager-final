using Microsoft.AspNetCore.SignalR;
using OrderManager.Server.Models;



namespace OrderManager.Server.Hubs
{
    public class AppEventsHub :Hub
    {

        //public async Task NewMessage(string username, string message) =>
        //    await Clients.All.SendAsync("messageReceived", username, message);

        
        public async Task SubscribeToCustomers()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"customers");
        }
        public async Task UnSubscribeToCustomers()
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"customers");
        }

        public async Task SubscribeToCustomer(string customerId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"customer-{customerId}");
        }

        public async Task UnsubscribeFromCustomer(string customerId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"customer-{customerId}");
        }



    }
}
