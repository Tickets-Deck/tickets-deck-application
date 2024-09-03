export type TransactionFeeRequest = {
  percentage: number;
  flatFee?: number;
  eventId?: string;
};

type EventInfo = {
    title: string;
}

export type TransactionFeeResponse = {
  id: string;
  flatFee: string;
  percentage: string;
  events: EventInfo[];
};
