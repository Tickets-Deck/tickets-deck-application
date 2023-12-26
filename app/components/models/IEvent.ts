export interface Publisher {
  name: string;
  joinDate: string;
  eventsHosted: number;
  picture: string;
}

export interface Location {
  blockNumber: string;
  street: string;
  city: string;
  state: string;
  country: string;
}

export interface TicketPrice {
  amount: number;
  currency: string;
}

export interface TicketType {
  name: string;
  price: number;
}

export interface Event {
  id: string;
  title: string;
  dateCreated: string;
  publisher: Publisher;
  eventDateTime: string;
  eventDate: string;
  location: Location;
  ticketPrice: TicketPrice;
  ticketTypes: TicketType[] | null;
  description: string;
  image: string;
}


export interface RetrievedTicketType extends TicketType {
    isSelected: boolean,
    selectedTickets: number
}