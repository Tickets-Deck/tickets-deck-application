"use client"
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import styles from "../styles/VerifyPaymentPage.module.scss"
import ComponentLoader from "../components/Loader/ComponentLoader";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyPaystackPayment } from "../api/apiClient";

interface VerifyPaymentPageProps {

}

enum PaymentStatus {
    Verifying = 1,
    Success = 2,
    Failed = 3
}

const VerifyPaymentPage: FunctionComponent<VerifyPaymentPageProps> = (): ReactElement => {

    const searchParams = useSearchParams();
    const router = useRouter();
    const verifyPaystackPayment = useVerifyPaystackPayment();

    const [isVerifyingPayment, setIsVerifyingPayment] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState(PaymentStatus.Verifying);

    const trxref = searchParams.get('trxref');

    async function handlePaymentVerification() {

        await verifyPaystackPayment(trxref as string)
            .then((response) => {
                console.log(response);
                // Set payment status state
                setPaymentStatus(PaymentStatus.Success);
                // Route to user dashboard
                router.push('app');
            })
            .catch((error) => {
                // Set payment status state
                setPaymentStatus(PaymentStatus.Failed);
                console.log(error);
            })
    };

    useEffect(() => {
        if (trxref) {
            handlePaymentVerification();
        }
    }, [router])

    return (
        <main className={styles.verifyPaymentPage}>
            {
                paymentStatus == PaymentStatus.Verifying &&
                <div className={styles.loaderAreaContainer}>
                    <div className={styles.loaderArea}>
                        <ComponentLoader customLoaderColor="#fff" />
                    </div>
                    <h3>Verifying payment...</h3>
                    <p>Please wait while we verify your payment.</p>
                </div>
            }
            {
                paymentStatus == PaymentStatus.Failed &&
                <div className={styles.loaderAreaContainer}>
                    <h3>An error occured while verifying your payment</h3>
                    <p>A customer care representative would be in touch soon.</p>
                </div>
            }
        </main>
    );
}

export default VerifyPaymentPage;