export interface PaymentResultDataMetadata {
    ticketOrderId: string;
}
export interface PaymentResultCustomerData {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string;
    customer_code: string;
    phone: string | null;
    metadata: any;
    risk_action: string;
    international_format_phone: string | null;
  }

export interface PaymentResultData {
  id: number;
  domain: string;
  status: string;
  reference: string;
  receipt_number: number | null;
  amount: number;
  message: string;
  gateway_response: string;
  paid_at: string;
  created_at: string;
  channel: string;
  currency: string;
  ip_address: string;
  metadata: PaymentResultDataMetadata;
  fees: number;
  fees_split: number | null;
  customer: PaymentResultCustomerData;
}
