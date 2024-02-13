import { ReactElement, FunctionComponent } from "react";
import VerifyPaymentPage from "./VerifyPaymentPage";
import { Metadata } from "next";

interface VerifyPaymentProps {
}

export const metadata: Metadata = {
    title: 'Verify payment | Events@Ticketsdeck',
    description: 'Unlocking best experiences, easily.'
}

const VerifyPayment: FunctionComponent<VerifyPaymentProps> = (): ReactElement => {
    
    return (
        <VerifyPaymentPage />
    );
}

export default VerifyPayment;