"use client";
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import ComponentLoader from "../components/Loader/ComponentLoader";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyPaystackPayment } from "../api/apiClient";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Link from "next/link";
import { ApplicationRoutes } from "../constants/applicationRoutes";

interface VerifyPaymentPageProps {}

enum PaymentStatus {
  Verifying = 1,
  Success = 2,
  Failed = 3,
}

const VerifyPaymentPage: FunctionComponent<
  VerifyPaymentPageProps
> = (): ReactElement => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userInfo = useSelector(
    (state: RootState) => state.userCredentials.userInfo
  );
  const verifyPaystackPayment = useVerifyPaystackPayment();

  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(PaymentStatus.Verifying);

  const trxref = searchParams.get("trxref");

  async function handlePaymentVerification(trxref: string) {
    if (isVerifyingPayment) return;

    // Start loader
    setIsVerifyingPayment(true);

    await verifyPaystackPayment(trxref as string)
      .then((response) => {
        if (response.data && response.data.ticketOrderId) {
          const ticketOrderId = response.data?.ticketOrderId;
          // Set payment status state
          setPaymentStatus(PaymentStatus.Success);
          // Route to order page
          router.push(`/order/${ticketOrderId}`);

          return;
        }

        if (response.data?.metadata) {
          const ticketOrderId = response.data?.metadata.ticketOrderId;
          // Set payment status state
          setPaymentStatus(PaymentStatus.Success);
          // Route to order page
          router.push(`/order/${ticketOrderId}`);
        }
      })
      .catch((error) => {
        console.log("🚀 ~ handlePaymentVerification ~ error:", error);
        if (error.response) {
          if (
            error.response.data.error == "Payment has already been verified"
          ) {
            // Set payment status state
            setPaymentStatus(PaymentStatus.Success);

            setTimeout(() => {
              if (userInfo) {
                router.push("/app");
                return;
              }
              router.push("/events");
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
      });
  }

  // Write a useEffect to handle the payment verification once the component mounts, and making sure it only runs once
  useEffect(() => {
    if (trxref && !isVerifyingPayment) {
      handlePaymentVerification(trxref);
    }
  }, [trxref]);

  return (
    <main className='grid place-items-center min-h-[60vh] p-4 sm:p-0 sm:min-h-[85vh] bg-dark-grey'>
      {paymentStatus == PaymentStatus.Verifying && (
        <div className='flex flex-col items-center text-center'>
          <div className='size-[100px] relative mb-4'>
            <ComponentLoader customLoaderColor='#fff' />
          </div>
          <h3 className='text-xl font-medium text-white mb-1'>
            Verifying payment...
          </h3>
          <p className='text-[0.85rem] text-white text-center'>
            Please wait while we verify your payment.
          </p>
        </div>
      )}
      {paymentStatus == PaymentStatus.Failed && (
        <div className='flex flex-col items-center text-center'>
          <h3 className='text-xl font-medium text-white mb-1'>
            An error occured while verifying your payment
          </h3>
          <p className='text-[0.85rem] text-white text-center'>
            A customer care representative would be in touch soon.
          </p>
          <p className='text-[0.85rem] text-white text-center'>
            You can also&nbsp;
            <Link
              href={ApplicationRoutes.Contact}
              className='text-primary-color-sub-50 underline'
            >
              contact us
            </Link>
            &nbsp; for faster response.
          </p>
        </div>
      )}
      {paymentStatus == PaymentStatus.Success && (
        <div className='flex flex-col items-center text-center'>
          <h3 className='text-xl font-medium text-white mb-1'>
            This payment has been successfully verified
          </h3>
          <p className='text-[0.85rem] text-white text-center'>
            Redirecting you to the order page in seconds.
          </p>
          {/* {
                        userInfo ?
                            <p>You will be redirected to your dashboard in seconds.</p> :
                            <p>You will be redirected to see all events in seconds.</p>
                    } */}
        </div>
      )}
    </main>
  );
};

export default VerifyPaymentPage;
