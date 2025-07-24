export type TicketsSoldMetrics = {
  id: string;
  title: string;
  totalTicketsSold: number;
  totalAmountPaid: number;
};

export type EventAttendeeMetrics = {
  id: string;
  title: string;
  totalAttendees: number;
  paidAttendees: number;
  freeAttendees: number;
  totalRevenue: number;
  totalAmountPaid: number;
};
