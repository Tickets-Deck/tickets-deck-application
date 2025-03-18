import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserCredentialsResponse } from "@/app/models/IUser";
import { RootState } from "../../store";
import { useFetchUserInformation } from "@/app/api/apiClient";

// Define the initial state
export interface UserState {
  userInfo: UserCredentialsResponse | null;
  flags: Record<string, boolean> | null; // Store flags as a key-value object for easy access
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Define the initial state using the userstate interface
const initialState: UserState = {
  userInfo: null,
  flags: {}, // Initialize as an empty object
  status: "idle",
  error: null,
};

// Async thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (userId: string, { rejectWithValue }) => {
    const fetchUserInformation = useFetchUserInformation();

    return await fetchUserInformation(userId)
      .then((response) => {
        // if (!response.ok) throw new Error("Failed to fetch user profile");
        console.log("User information on layout: ", response.data);

        const data = response.data;

        // Convert flags array into an object
        const flagsObject: Record<string, boolean> | null =
          data.flags?.reduce((acc: Record<string, boolean>, flag: any) => {
            acc[flag.flagName] = flag.flagValue;
            return acc;
          }, {}) || null;

        console.log("🚀 ~ flagsObject:", flagsObject);

        return { userInfo: data, flags: flagsObject };
      })
      .catch((error) => {
        return rejectWithValue(error.message);
      });
  }
);

export const userSlice = createSlice({
  name: "userCredentials",
  initialState,
  reducers: {
    updateUserCredentials: (state, action) => {
      state.userInfo = action.payload;
    },
    clearUserCredentials: (state) => {
      state.userInfo = null;
      state.flags = {};
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userInfo = action.payload.userInfo;
        state.flags = action.payload.flags; // Store flags in Redux
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const selectUserFlags = (state: RootState) =>
  state.userCredentials.flags;

export const { updateUserCredentials, clearUserCredentials } =
  userSlice.actions;

// export const selectUserCredentials = (state: any) => state.user.userInfo;

export default userSlice.reducer;
