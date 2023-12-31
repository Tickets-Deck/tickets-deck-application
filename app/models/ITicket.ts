export type TicketRequest = {
  role: string;
  price: number;
  quantity: number;
  remainingTickets: number;
};

export type TicketResponse = TicketRequest & {
  id: string;
  eventId: string;
  createdAt: string;
  updatedAt: string;
};

export type RetrievedTicketResponse = TicketResponse & {
    selectedTickets: number
    isSelected: boolean
}