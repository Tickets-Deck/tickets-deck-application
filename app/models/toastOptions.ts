import { ToastMessageType } from "../enums/ToastMessageType";


/**
 * The application toast options
 */
export interface IToastOptions {
    type: ToastMessageType;
    title: string;
    description: string;
    timeout: number;
    visible: boolean;
}