import { EventInformationTab } from "../enums/EventInformationTab";
import { EventVisibility } from "../enums/IEventVisibility";
import { OrderStatus } from "../enums/IOrderStatus";
import { ProfilePageTab } from "../enums/ProfilePageTab";

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

export function serializeProfilePageTab(tab: number) {
  switch (tab) {
    case ProfilePageTab.BasicInformation:
      return "Basic Information";
    case ProfilePageTab.IdentityVerification:
      return "Identity Verification";
    case ProfilePageTab.BankInformation:
      return "Bank Information";
    default:
      return "";
  }
}

export function serializeEventInformationTab(tab: number) {
  switch (tab) {
    case EventInformationTab.Overview:
      return "Overview";
    case EventInformationTab.Tickets:
      return "Tickets";
    // case EventInformationTab.Analytics:
    //   return "Analytics";
    case EventInformationTab.Settings:
      return "Settings";
    default:
      return "";
  }
}