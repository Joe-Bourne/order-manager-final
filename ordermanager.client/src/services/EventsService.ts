// src/services/EventService.ts
import API_URL from "../config/apiConfig";
import * as signalR from "@microsoft/signalr";
import { Order } from "../models/Order";

type EventType = "created" | "updated" | "deleted";
type OrderEventHandler = (order: Order, eventType: EventType) => void;
type CustomerEventHandler = (customerId: number, eventType: EventType) => void;

class EventsService {
  private connection: signalR.HubConnection;
  private customerEventHandlers = new Set<CustomerEventHandler>();
  private orderEventHandlers = new Set<OrderEventHandler>();

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/events`)
      .withAutomaticReconnect()
      .build();

    this.connection.onreconnected(() =>
      console.log("[WebSockets] Reconnected")
    );
    this.connection.onclose(() => console.warn("[WebSockets] Disconnected"));
  }
  public async start() {
    if (this.connection.state !== signalR.HubConnectionState.Disconnected)
      return;

    console.log("[WebSockets] Starting...");
    await this.connection.start();
    console.log("[WebSockets] Connected");

    const notifyCustomerChanges = (
      customerId: number,
      eventType: EventType
    ) => {
      this.customerEventHandlers.forEach((cb) => cb(customerId, eventType));
    };

    // First clear any previous handlers
    this.connection.off("CustomerCreated");
    this.connection.off("CustomerUpdated");
    this.connection.off("CustomerDeleted");
    this.connection.off("OrderCreated");
    this.connection.off("OrderDeleted");

    // re-bind handlers
    this.connection.on("CustomerCreated", (customerId: number) =>
      notifyCustomerChanges(customerId, "created")
    );
    this.connection.on("CustomerUpdated", (customerId: number) =>
      notifyCustomerChanges(customerId, "updated")
    );
    this.connection.on("CustomerDeleted", (customerId: number) =>
      notifyCustomerChanges(customerId, "deleted")
    );

    this.connection.on("OrderCreated", (order: Order) => {
      this.orderEventHandlers.forEach((cb) => cb(order, "created"));
    });

    this.connection.on("OrderDeleted", (order: Order) => {
      this.orderEventHandlers.forEach((cb) => cb(order, "deleted"));
    });
  }

  public async stop() {
    if (this.connection.state == signalR.HubConnectionState.Disconnected)
      return;

    console.log("[WebSockets] Stopping...");
    await this.connection.stop();
    console.log("[WebSockets] Stopped");
  }

  // Register customer events
  public subscribeCustomerEvents(handler: CustomerEventHandler) {
    this.customerEventHandlers.add(handler);
  }
  public unsubscribeCustomerEvents(handler: CustomerEventHandler) {
    this.customerEventHandlers.delete(handler);
  }

  // Order Created Event Callbacks
  public subscribeOrderEvents(handler: OrderEventHandler) {
    this.orderEventHandlers.add(handler);
  }
  public unsubscribeOrderEvents(handler: OrderEventHandler) {
    this.orderEventHandlers.delete(handler);
  }
}

const eventsService = new EventsService();
export default eventsService;

export type { CustomerEventHandler, OrderEventHandler, EventType };
