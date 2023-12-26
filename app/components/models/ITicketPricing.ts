interface TicketPrice {
  currency: string;
  total: string;
}
interface TicketPriceBreakdown {
  base: number;
  taxesAndFees: number;
  total: number;
}

export interface ITicketPricing {
  ticketId: string;
  ticketType: string;
  price: TicketPrice;
  priceBreakdown: TicketPriceBreakdown;
}
