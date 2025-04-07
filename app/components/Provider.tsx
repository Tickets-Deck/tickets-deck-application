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
import TawkToChat from '../context/TawkToChat';
import ThemeProvider from './ThemeProvider';

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
            <TawkToChat />
            <WebSocketListener />
            <AppProvider>
                <ToastProvider>
                    <Provider store={store}>
                        <ThemeProvider />
                        {children}
                    </Provider>
                </ToastProvider>
            </AppProvider>
        </SessionProvider>
    );
};

export default GlobalProvider;