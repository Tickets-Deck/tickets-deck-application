import { createSlice } from "@reduxjs/toolkit";
import { prisma } from "../../../../lib/prisma";
import { UserCredentialsResponse } from "@/app/models/IUser";

export interface UserState {
  userInfo: UserCredentialsResponse | null;
}

// Define the initial state using the cartState interface
const initialState: UserState = { userInfo: null };

export const userSlice = createSlice({
  name: "userCredentials",
  initialState,
  reducers: {
    updateUserCredentials: (state, action) => {
      state.userInfo = action.payload;
    },
    clearUserCredentials: (state) => {
      state.userInfo = null;
    },
  },
});

export const { updateUserCredentials, clearUserCredentials } = userSlice.actions;

// export const selectUserCredentials = (state: any) => state.user.userInfo;

export default userSlice.reducer;
