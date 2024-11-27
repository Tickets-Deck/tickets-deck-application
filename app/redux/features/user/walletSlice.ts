import { createSlice } from "@reduxjs/toolkit";
import { BankAccount } from "@/app/models/IBankAccount";

export interface WalletState {
  bankAccount: BankAccount[] | null;
}

// Define the initial state using the walletState interface
const initialState: WalletState = { bankAccount: null };

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    updateUserBankAccount: (state, action) => {
      state.bankAccount = action.payload;
    },
    clearUserBankAccount: (state) => {
      state.bankAccount = null;
    },
  },
});

export const { updateUserBankAccount, clearUserBankAccount } =
  walletSlice.actions;

export default walletSlice.reducer;
