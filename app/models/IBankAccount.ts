export type BankAccountDetailsRequest = {
  accountNumber: string;
  bankCode: string;
};

export type BankAccount = {
  bankName: string;
  accountName: string;
  accountNumber: string;
};

export type BankAccountResponse = BankAccount & {
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type BankAccountRequest = BankAccount & {};

//* ============== Below are the models for the Paystack Bank API ==============
export type Bank = {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string;
  pay_with_bank: boolean;
  supports_transfer: boolean;
  active: boolean;
  country: string;
  currency: string;
  type: string;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BankVerificationResponse = {
  account_number: string;
  account_name: string;
  bank_id: number;
};
