"use client"
import { createContext } from "react";
import { IToastOptions } from "../models/toastOptions";

interface IToastContext {
    toastOptions?: IToastOptions;
    logSuccess: (title: string, description: string, timeout?: number) => void;
    logInfo: (title: string, description: string, timeout?: number) => void;
    logWarning: (title: string, description: string, timeout?: number) => void;
    logError: (title: string, description: string, timeout?: number) => void;
    closeToast: () => void;
}

export const ToastContext = createContext<IToastContext | null>(null);
