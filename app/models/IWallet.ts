import { PaymentServiceProvider } from "../enums/IPaymentServiceProvider";
import { PaymentStatus } from "../enums/IPaymentStatus";

export type WalletBalance = {
  balance: number;
  totalRevenue: number;
  totalWithdrawn: number;
};

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
  customerId: string;
  eventId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};
