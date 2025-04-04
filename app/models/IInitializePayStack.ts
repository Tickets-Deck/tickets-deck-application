
export interface InitializePayStack {
    ticketOrderId: string;
    callbackUrl: string;
    socketId: string;
    couponCode?: string; 
    organizerAmount: number;
}