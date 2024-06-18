import { EventVisibility } from "../enums/IEventVisibility";
import { OrderStatus } from "../enums/IOrderStatus";

export function serializeOrderStatus(status: OrderStatus) {
  switch (status) {
    case OrderStatus.Pending:
      return "Pending";
    case OrderStatus.PaymentInitiated:
      return "Initiated";
    case OrderStatus.Confirmed:
      return "Completed";
    case OrderStatus.Cancelled:
      return "Cancelled";
    default:
      return "Unknown";
  }
}

export function deserializeEventVisibility(status: string) {
  switch (status) {
    case "PUBLIC":
      return EventVisibility.PUBLIC;
    case "PRIVATE":
      return EventVisibility.PRIVATE;
    default:
      return EventVisibility.PUBLIC;
  }
}