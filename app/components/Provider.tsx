'use client'

import { configureStore } from '@reduxjs/toolkit'
import { SessionProvider } from 'next-auth/react'
import userReducer, { updateUserCredentials } from '@/app/redux/features/user/userSlice'
import { Provider, useDispatch } from "react-redux";
import { Session } from 'next-auth';
import { useFetchUserInformation } from '../api/apiClient';
import { catchError } from '../constants/catchError';
import { useEffect } from 'react';

export const store = configureStore({
    reducer: {
        userCredentials: userReducer,
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
