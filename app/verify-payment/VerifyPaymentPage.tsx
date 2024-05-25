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
    //             router.push(ApplicationRoutes.Home);
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
                // console.log(response.data.data.metadata.ticketOrderId);
                const ticketOrderId = response.data.metadata.ticketOrderId;

                // Set payment status state
                setPaymentStatus(PaymentStatus.Success);

                /// TODO: Show a success message to the user and action button to redirect to user dashboard or home page

                // Route to order page
                router.push(`/order/${ticketOrderId}`);

                // Route to user dashboard
                // if (userInfo) {
                //     router.push('/app/tickets?t=1');
                //     return;
                // } else {
                //     router.push(ApplicationRoutes.Home);
                // }
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.data.error == "Payment has already been verified") {
                        // Set payment status state
                        setPaymentStatus(PaymentStatus.Success);

                        setTimeout(() => {
                            if (userInfo) {
                                router.push('/app');
                                return;
                            }
                            router.push('/events');
                        }, 5000);

                        return;
                    }
                }

                // Set payment status state
                setPaymentStatus(PaymentStatus.Failed);
                // console.log(error);
            })
    };

    // Write a useEffect to handle the payment verification once the component mounts, and making sure it only runs once

    useEffect(() => {
        if (trxref && !isVerifyingPayment) {
            handlePaymentVerification(trxref);
        }
    }, [trxref]);

    // useEffect(() => {
    //     if(paymentStatus === PaymentStatus.Success) {
    //         setTimeout(() => {
    //             if (userInfo) {
    //                 router.push('/app');
    //                 return;
    //             }
    //             router.push('/events');
    //         }, 5000);
    //     }
    // }, [paymentStatus]);

    return (
        <main className={styles.verifyPaymentPage}>
            {
                (paymentStatus == PaymentStatus.Verifying) &&
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
            {
                paymentStatus == PaymentStatus.Success &&
                <div className={styles.loaderAreaContainer}>
                    <h3>This payment has already been verified</h3>
                    <p>Redirecting you to the order page in seconds.</p>
                    {/* {
                        userInfo ?
                            <p>You will be redirected to your dashboard in seconds.</p> :
                            <p>You will be redirected to see all events in seconds.</p>
                    } */}
                </div>
            }
        </main>
    );
}

export default VerifyPaymentPage;