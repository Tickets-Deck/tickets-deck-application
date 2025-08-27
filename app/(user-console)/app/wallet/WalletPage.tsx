"use client";
import {
  useFetchUserPayouts,
  useFetchUserWalletBalance,
  useRequestUserWithdrawals,
} from "@/app/api/apiClient";
// import BetaTestModal from "@/app/components/Modal/BetaTestModal";
import PayoutModal from "@/app/components/Modal/PayoutRequestModal";
import { catchError } from "@/app/constants/catchError";
import { NairaPrice } from "@/app/constants/priceFormatter";
import { useToast } from "@/app/context/ToastCardContext";
import { PaymentServiceProvider } from "@/app/enums/IPaymentServiceProvider";
import { PaymentStatus } from "@/app/enums/IPaymentStatus";
import { Payout, WalletBalance } from "@/app/models/IWallet";
import moment from "moment";
import { useSession } from "next-auth/react";
import { FunctionComponent, ReactElement, useMemo, useState } from "react";

interface WalletPageProps {
  walletBalanceInfo: WalletBalance | null;
  initialUserPayouts: Payout[] | null;
}

const WalletPage: FunctionComponent<WalletPageProps> = ({
  walletBalanceInfo,
  initialUserPayouts,
}): ReactElement => {
  const toastHandler = useToast();
  const fetchUserWalletBalance = useFetchUserWalletBalance();
  const initiateUserWithdrawals = useRequestUserWithdrawals();
  const fetchUserPayouts = useFetchUserPayouts();

  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState<WalletBalance>();
  //   const [showWalletBalance, setShowWalletBalance] = useState(false);
  const [userPayouts, setUserPayouts] = useState<Payout[] | null>(
    initialUserPayouts
  );

  const { data: session } = useSession();
  const user = session?.user;

  const handleFetchUserWalletBalance = async () => {
    await fetchUserWalletBalance(user?.id as string, user?.token as string)
      .then((response) => {
        setWalletBalance(response.data);
      })
      .catch((error) => {
        catchError(error);
        toastHandler.logError("Error", "Failed to fetch user wallet balance");
      });
  };

  const handleInitiateUserWithdrawals = async (amount: number) => {
    await initiateUserWithdrawals(
      user?.id as string,
      user?.token as string,
      amount
    )
      .then((response) => {
        if (response.data) {
          handleFetchUserPayouts();
          toastHandler.logSuccess(
            "Success",
            "Your payout request has been initiated"
          );
          return;
        }
      })
      .catch((error) => {
        if (error.response) throw new Error(error.response.data.message);
      });
  };

  const handleFetchUserPayouts = async () => {
    await fetchUserPayouts(user?.id as string, user?.token as string)
      .then((response) => {
        setUserPayouts(response.data);
      })
      .catch((error) => {});
  };

  const showPaymentStatus = (paymentStatus: PaymentStatus) => {
    switch (paymentStatus) {
      case PaymentStatus.Paid:
        return "Paid";
      case PaymentStatus.Pending:
        return "Pending";
      case PaymentStatus.Failed:
        return "Cancelled";
      default:
        return "";
    }
  };

  const showPaymentMethod = (paymentMethod: PaymentServiceProvider) => {
    switch (paymentMethod) {
      case PaymentServiceProvider.BankTransfer:
        return "Bank Transfer";
      case PaymentServiceProvider.Cash:
        return "Cash";
      case PaymentServiceProvider.Paystack:
        return "Paystack";
      default:
        return "";
    }
  };

  useMemo(() => {
    if (user) handleFetchUserWalletBalance();
  }, [user]);

  return (
    <>
      {/* <BetaTestModal
                visibility={showBetaTestModal}
                setVisibility={setShowBetaTestModal}
            /> */}
      <PayoutModal
        walletBalance={walletBalance || null}
        visibility={showPayoutModal}
        setVisibility={setShowPayoutModal}
        onRequestPayout={handleInitiateUserWithdrawals}

        // modalVisibility={true}
        // setModalVisibility={() => { }}
        // walletBalance={walletBalanceInfo?.balance || 0}
        // onRequestPayout={async () => { }}
      />

      <main className="px-4 py-8 min-h-screen text-white">
        <div className="mb-4 flex flex-row justify-between w-full">
          <h2 className="text-2xl font-medium text-gray-300">Wallet page</h2>
          <button
            className="w-fit h-fit rounded-full cursor-pointer text-sm p-4 py-2 border-none bg-primary-color text-white hover:bg-white hover:text-primary-color"
            onClick={() => setShowPayoutModal(true)}
          >
            Request payment
          </button>
        </div>

        {/* KPI Section */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl flex flex-col bg-dark-grey">
            <span className="text-2xl font-semibold mb-4 font-Mona-Sans-Wide">
              {NairaPrice.format(walletBalanceInfo?.totalRevenue || 0)}
            </span>
            <span className="text-sm font-light text-text-grey">
              Total Revenue
            </span>
          </div>
          <div className="p-6 rounded-2xl flex flex-col bg-dark-grey">
            <span className="text-2xl font-semibold mb-4 font-Mona-Sans-Wide">
              {NairaPrice.format(walletBalanceInfo?.netEarnings || 0)}
            </span>
            <span className="text-sm font-light text-text-grey">
              Net Earnings
            </span>
          </div>
          <div className="p-6 rounded-2xl flex flex-col bg-dark-grey">
            <span className="text-2xl font-semibold mb-4 font-Mona-Sans-Wide">
              {NairaPrice.format(walletBalanceInfo?.balance || 0)}
            </span>
            <span className="text-sm font-light text-text-grey">
              Wallet Balance
            </span>
          </div>
          <div className="p-6 rounded-2xl flex flex-col bg-dark-grey">
            <span className="text-2xl font-semibold mb-4 font-Mona-Sans-Wide">
              {NairaPrice.format(walletBalanceInfo?.totalWithdrawn || 0)}
            </span>
            <span className="text-sm font-light text-text-grey">
              Total Witdrawals
            </span>
          </div>
        </div>

        <div className="mt-6 w-full">
          <h3 className="mb-2 text-xl">Payouts</h3>
          <div className="max-h-[65vh] w-full overflow-y-auto rounded-2xl relative bg-container-grey">
            <table className="bg-white w-full text-dark-grey">
              <tbody>
                <tr>
                  <th className="p-3 border-b-[1px] text-left text-sm font-semibold">
                    Transaction Reference
                  </th>
                  <th className="p-3 border-b-[1px] text-left text-sm font-semibold">
                    Amount
                  </th>
                  <th className="p-3 border-b-[1px] text-left text-sm font-semibold">
                    Date
                  </th>
                  <th className="p-3 border-b-[1px] text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="p-3 border-b-[1px] text-left text-sm font-semibold">
                    Payment Method
                  </th>
                  <th className="p-3 border-b-[1px] text-left text-sm font-semibold">
                    Service Fee
                  </th>
                  {/* <th className='p-3 border-b-[1px] text-left text-sm font-semibold'>
                                        Tax
                                    </th> */}
                </tr>

                {userPayouts?.map((payout, index) => {
                  return (
                    <tr key={index}>
                      <td className="p-3 border-b-[1px] text-left text-sm">
                        {payout.transactionRef}
                      </td>
                      <td className="p-3 border-b-[1px] text-left text-sm">
                        {NairaPrice.format(Number(payout.amount))}
                      </td>
                      <td className="p-3 border-b-[1px] text-left text-sm">
                        {moment(payout.createdAt).format(
                          "ddd Do MMM, YYYY | h:mma"
                        )}
                      </td>
                      <td className="p-3 border-b-[1px] text-left text-sm">
                        {showPaymentStatus(payout.status)}
                      </td>
                      <td className="p-3 border-b-[1px] text-left text-sm">
                        {showPaymentMethod(payout.paymentMethod)}
                      </td>
                      <td className="p-3 border-b-[1px] text-left text-sm">
                        {NairaPrice.format(Number(payout.serviceFees) || 0)}
                      </td>
                      {/* <td className='p-3 border-b-[1px] text-left text-sm'>
                                        <span className='bg-success-color w-fit px-2 py-4 rounded-xl text-white text-lg'>
                                            5%
                                        </span>
                                    </td> */}
                    </tr>
                  );
                })}
                {/* <tr key={index}>
                                            <td>{userRecentTransaction.eventName}</td>
                                            <td>{userRecentTransaction.orderId}</td>
                                            {
                                                userRecentTransaction.amount == "0" ?
                                                    <td>Free</td> :
                                                    <td>&#8358;{Number(userRecentTransaction.amount).toLocaleString()}</td>
                                            }
                                            <td>{moment(userRecentTransaction.date).format("ddd Do MMM, YYYY | hh:mma")}</td>
                                            <td>
                                                <span className={showTagStyle(userRecentTransaction.status)}>
                                                    {serializeOrderStatus(userRecentTransaction.status)}
                                                </span>
                                            </td>
                                        </tr> */}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
};

export default WalletPage;
