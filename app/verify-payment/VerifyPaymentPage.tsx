"use client"
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import styles from "../styles/VerifyPaymentPage.module.scss"
import ComponentLoader from "../components/Loader/ComponentLoader";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyPaystackPayment } from "../api/apiClient";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Link from "next/link";
import { ApplicationRoutes } from "../constants/applicationRoutes";

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
        if (isVerifyingPayment) return;

        // Start loader
        setIsVerifyingPayment(true);

        await verifyPaystackPayment(trxref as string)
            .then((response) => {
                if (response.data.message && response.data.ticketOrderId && response.data.message == "Payment successfully processed.") {
                    const ticketOrderId = response.data?.ticketOrderId;
                    // Set payment status state
                    setPaymentStatus(PaymentStatus.Success);
                    // Route to order page
                    router.push(`/order/${ticketOrderId}`);
                    return;
                }

                const ticketOrderId = response.data?.metadata.ticketOrderId;

                // Set payment status state
                setPaymentStatus(PaymentStatus.Success);

                // Route to order page
                router.push(`/order/${ticketOrderId}`);
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
                    // if (error.response.data.error == "Payment was not successful.") {
                    //     // Set payment status state
                    //     setPaymentStatus(PaymentStatus.Failed);

                    //     setTimeout(() => {
                    //         if (userInfo) {
                    //             router.push('/app');
                    //             return;
                    //         }
                    //         router.push('/events');
                    //     }, 5000);

                    //     return;
                    // }
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
                    <p>
                        You can also&nbsp;
                        <Link href={ApplicationRoutes.Contact} className="text-primary-color-sub-50 underline">contact us</Link>&nbsp;
                        for faster response.
                    </p>
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