"use client";
import React, { createContext, useState, ReactNode } from "react";
import { IToastOptions } from "../models/toastOptions";
import { ToastMessageType } from "../enums/ToastMessageType";
import useOuterClick from "../hooks/useOuterClick";

interface IToastContext {
  toastOptions?: IToastOptions;
  logSuccess: (title: string, description: string, timeout?: number) => void;
  logInfo: (title: string, description: string, timeout?: number) => void;
  logWarning: (title: string, description: string, timeout?: number) => void;
  logError: (title: string, description: string, timeout?: number) => void;
  closeToast: () => void;
}

export const ToastContext = createContext<IToastContext | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toastOptions, setToastOptions] = useState<IToastOptions>({
    type: ToastMessageType.Info,
    title: "Welcome",
    description: "",
    timeout: 0.01,
    visible: false,
  });

  // Define functions to update toast state
  const logSuccess = (
    title: string,
    description: string,
    timeout: number = 4000
  ) => {
    setToastOptions({
      type: ToastMessageType.Success,
      title,
      description,
      timeout,
      visible: true,
    });
  };

  const logInfo = (
    title: string,
    description: string,
    timeout: number = 4000
  ) => {
    setToastOptions({
      type: ToastMessageType.Info,
      title,
      description,
      timeout,
      visible: true,
    });
  };

  const logWarning = (
    title: string,
    description: string,
    timeout: number = 4000
  ) => {
    setToastOptions({
      type: ToastMessageType.Warning,
      title,
      description,
      timeout,
      visible: true,
    });
  };

  const logError = (
    title: string,
    description: string,
    timeout: number = 4000
  ) => {
    setToastOptions({
      type: ToastMessageType.Error,
      title,
      description,
      timeout,
      visible: true,
    });
  };

  const closeToast = () => {
    setToastOptions({
      type: ToastMessageType.None,
      title: "",
      description: "",
      timeout: 0.01,
      visible: false,
    });
  };

  return (
    <ToastContext.Provider
      value={{
        toastOptions,
        logSuccess,
        logInfo,
        logWarning,
        logError,
        closeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}