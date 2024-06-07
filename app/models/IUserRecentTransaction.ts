import { OrderStatus } from "../enums/IOrderStatus";

export interface UserRecentTransaction {
    eventName: string;
    orderId: string;
    amount: string;
    date: Date;
    status: OrderStatus;
}