import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/user/userSlice'
import themeReducer from './features/theme/themeSlice'
import walletReducer from './features/user/walletSlice'

export const store = configureStore({
  reducer: {
    userCredentials: userReducer,
    wallet: walletReducer,
    theme: themeReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch