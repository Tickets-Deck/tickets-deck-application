import { ToastMessageType } from "./ToastMessageType";

/**
 * The application toast options
 */
export interface IToastOptions {
    type: ToastMessageType;
    title: string;
    description: string;
    timeout: number;
    visible: Boolean;
}