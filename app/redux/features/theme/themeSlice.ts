import { StorageKeys } from "@/app/constants/storageKeys";
import { Theme } from "@/app/enums/Theme";
import { createSlice } from "@reduxjs/toolkit";

export interface ThemeState {
  appTheme: Theme | null;
}

// Check if session Storage is available
const isLocalStorageAvailable = typeof localStorage !== "undefined";

// Try to load app thme from local storage or use an empty value
const storedAppTheme = isLocalStorageAvailable
  ? localStorage.getItem(StorageKeys.AppTheme)
  : null;
//   console.log("storedAppTheme: ", storedAppTheme);
//   console.log("parsed storedAppTheme: ", JSON.parse(storedAppTheme as string));

// Define the initial state using the ThemeState interface
const initialState: ThemeState = storedAppTheme
  ? {appTheme: JSON.parse(storedAppTheme) as Theme}
  : { appTheme: Theme.Light };

export const themeSlice = createSlice({
  name: "appTheme",
  initialState,
  reducers: {
    updateAppTheme: (state, action) => {
      state.appTheme = action.payload;

      // Save updated theme to local storage after modification
      localStorage.setItem(StorageKeys.AppTheme, JSON.stringify(action.payload));
    },
    resetAppTheme: (state) => {
      state.appTheme = null;
    },
  },
});

export const { updateAppTheme, resetAppTheme } = themeSlice.actions;

export default themeSlice.reducer;