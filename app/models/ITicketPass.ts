import { ReactNode } from "react";
import { TicketEventOrderResponse } from "./ITicketOrder";

export interface TicketPass {
    eventInfo: TicketEventOrderResponse;
    ticketType: string;
    qr: ReactNode;
    orderId: string;
}