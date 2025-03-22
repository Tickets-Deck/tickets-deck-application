"use client"
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { AppProvider } from '../context/ApplicationContext';
import userReducer from '@/app/redux/features/user/userSlice';
import themeReducer from '@/app/redux/features/theme/themeSlice';
import { ToastProvider } from '../context/ToastCardContext';
import WebSocketListener from './WebSocket/WebSocketListener';

const store = configureStore({
    reducer: {
        userCredentials: userReducer,
        theme: themeReducer,
    },
});

type Props = {
    children?: React.ReactNode
}

const GlobalProvider = ({ children }: Props) => {
    return (
        <SessionProvider>
            <WebSocketListener />
            <AppProvider>
                <ToastProvider>
                    <Provider store={store}>
                        {children}
                    </Provider>
                </ToastProvider>
            </AppProvider>
        </SessionProvider>
    );
};

export default GlobalProvider;