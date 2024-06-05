'use client'

import { configureStore } from '@reduxjs/toolkit'
import { SessionProvider } from 'next-auth/react'
import userReducer from '@/app/redux/features/user/userSlice'
import themeReducer from '@/app/redux/features/theme/themeSlice'
import { Provider } from "react-redux";

export const store = configureStore({
    reducer: {
        userCredentials: userReducer,
        theme: themeReducer,
    },
})

type Props = {
    children?: React.ReactNode
}

export const GlobalProvider = ({ children }: Props) => {

    return <Provider store={store}>
        <SessionProvider>
            {children}
        </SessionProvider>
    </Provider>
}
