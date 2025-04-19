using Microsoft.AspNetCore.SignalR;
using OrderManager.Server.Models;

namespace OrderManager.Server.Hubs
{
    public class EventNotifier
    {
        private readonly IHubContext<AppEventsHub> _hub;

        public EventNotifier(IHubContext<AppEventsHub> hub)
        {
            _hub = hub;
        }

        //Customer Events
        public async Task NotifyCustomerCreated(int customerId) =>
            await _hub.Clients.All.SendAsync("CustomerCreated", customerId);

        public async Task NotifyCustomerUpdated(int customerId) =>
            await _hub.Clients.All.SendAsync("CustomerUpdated", customerId);

        public async Task NotifyCustomerDeleted(int customerId) =>
            await _hub.Clients.All.SendAsync("CustomerDeleted", customerId);


        //Order Events

        public async Task NotifyOrderCreated(Order order)  =>
            await _hub.Clients.All.SendAsync("OrderCreated", order);

        public async Task NotifyOrderDeleted(Order order) =>
            await _hub.Clients.All.SendAsync("OrderDeleted", order);
          
    }
}
