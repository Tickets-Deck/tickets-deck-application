import { PaymentServiceProvider } from "../enums/IPaymentServiceProvider";
import { PaymentStatus } from "../enums/IPaymentStatus";

export type Payout = {
  id: string;
  amount: string;
  payoutDate: string | null;
  status: PaymentStatus;
  paymentMethod: PaymentServiceProvider;
  transactionRef: string | null;
  serviceFees: string | null;
  tax: string | null;
  currency: string;
  notes: string | null;
  organizerId: string;
  createdAt: string;
};
