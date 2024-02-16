"use client"
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import styles from "../styles/VerifyPaymentPage.module.scss"
import ComponentLoader from "../components/Loader/ComponentLoader";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyPaystackPayment } from "../api/apiClient";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

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
    const userInfo = useSelector((state: RootState) => state.userCredentials.userInfo);
    const verifyPaystackPayment = useVerifyPaystackPayment();

    const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(PaymentStatus.Verifying);

    const trxref = searchParams.get('trxref');

    /**
     * Function to handle the verification of the payment
     * @param trxref is the transaction reference returned from the paystack payment gateway
     */
    // async function handlePaymentVerification(trxref: string) {
    //     try {
    //         setIsVerifyingPayment(true);
    //         const response = await verifyPaystackPayment(trxref);
    //         // console.log(response);
    //         setPaymentStatus(PaymentStatus.Success);
    //         if (response) {
    //             if (userInfo) {
    //                 router.push('/app');
    //                 return;
    //             }
    //             router.push('/');
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         setPaymentStatus(PaymentStatus.Failed);
    //     }
    // }

    async function handlePaymentVerification(trxref: string) {
        // Start loader
        setIsVerifyingPayment(true);

        await verifyPaystackPayment(trxref as string)
            .then((response) => {
                // console.log(response);
                // Set payment status state
                setPaymentStatus(PaymentStatus.Success);

                /// TODO: Show a success message to the user and action button to redirect to user dashboard or home page
                
                // Route to user dashboard
                if (userInfo) {
                    router.push('/app');
                    return;
                } else {
                    router.push('/');
                }
            })
            .catch((error) => {
                // Set payment status state
                setPaymentStatus(PaymentStatus.Failed);
                console.log(error);
            })
    };

    // Write a useEffect to handle the payment verification once the component mounts, and making sure it only runs once

    useEffect(() => {
        if (trxref && !isVerifyingPayment) {
            handlePaymentVerification(trxref);
        }
    }, [trxref]);

    return (
        <main className={styles.verifyPaymentPage}>
            {
                (paymentStatus == PaymentStatus.Verifying || paymentStatus == PaymentStatus.Success) &&
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