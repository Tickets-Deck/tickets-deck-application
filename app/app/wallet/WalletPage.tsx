"use client";
import {
    useFetchUserPayouts,
    useFetchUserWalletBalance,
    useInitiateWitdrawal,
} from "@/app/api/apiClient";
import BetaTestModal from "@/app/components/Modal/BetaTestModal";
import WitdrawalModal from "@/app/components/Modal/WitdrawalModal";
import { ApplicationError } from "@/app/constants/applicationError";
import { catchError } from "@/app/constants/catchError";
import { OrderStatus } from "@/app/enums/IOrderStatus";
import { Payout } from "@/app/models/IWallet";
import { RootState } from "@/app/redux/store";
import moment from "moment";
import {
    FunctionComponent,
    ReactElement,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

interface WalletPageProps { }

const WalletPage: FunctionComponent<WalletPageProps> = (): ReactElement => {
    const fetchUserWalletBalance = useFetchUserWalletBalance();
    const fetchUserPayouts = useFetchUserPayouts();
    const initiateWitdrawal = useInitiateWitdrawal();

    const userInfo = useSelector(
        (state: RootState) => state.userCredentials.userInfo
    );
    const userBankAccount = useSelector(
        (state: RootState) => state.wallet.bankAccount
    );

    const [userPayouts, setUserPayouts] = useState<Payout[]>();
    const [isFetchingPayouts, setIsFetchingPayouts] = useState(false);
    const [walletBalance, setWalletBalance] = useState<number>();
    const [showWalletBalance, setShowWalletBalance] = useState(true);
    const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
    const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);
    const [withdrawalAmount, setWithdrawalAmount] = useState<number>();

    const handleFetchUserWalletBalance = async () => {
        await fetchUserWalletBalance(userInfo?.id as string)
            .then((response) => {
                setWalletBalance(response.data.balance);
            })
            .catch((error) => {
                catchError(error);
                toast.error("Failed to fetch user wallet balance");
            });
    };

    const handleInitiateWithdrawal = async () => {
        if (!withdrawalAmount) {
            toast.error("Please enter the amount to withdraw");
            return;
        }
        if (withdrawalAmount < 5000) {
            toast.error("Minimum withdrawal amount is 5000 naira");
            return;
        }

        setIsProcessingWithdrawal(true);

        await initiateWitdrawal(userInfo?.id as string, withdrawalAmount.toString())
            .then(async (response) => {
                await handleFetchUserPayouts();
                toast.success("Withdrawal initiated successfully");
                setShowWithdrawalModal(false);
            })
            .catch((error) => {
                catchError(error);

                console.log("🚀 ~ handleInitiateWithdrawal ~ error.response.errorCode:", error.response.errorCode)
                if (error?.response?.data.errorCode == ApplicationError.InsufficientBalance.Code) {
                    toast.error("Insufficient balance");
                    return;
                }

                toast.error("Failed to initiate withdrawal");
            })
            .finally(() => {
                setIsProcessingWithdrawal(false);
            });
    };

    const handleFetchUserPayouts = async () => {
        await fetchUserPayouts(userInfo?.id as string)
            .then((response) => {
                setUserPayouts(response.data);
            })
            .catch((error) => {
                console.log("🚀 ~ handleFetchUserPayouts ~ error:", error);
            })
            .finally(() => {
                setIsFetchingPayouts(false);
            });
    };

    // function showTagStyle(orderStatus: OrderStatus) {
    //     switch (orderStatus) {
    //         case OrderStatus.Pending:
    //             return "";
    //         case OrderStatus.PaymentInitiated:
    //             return styles.initiatedTag;
    //         case OrderStatus.Confirmed:
    //             return styles.completedTag;
    //         case OrderStatus.Cancelled:
    //             return styles.cancelledTag;
    //         default:
    //             return styles.pendingTag;
    //     }
    // }

    useMemo(() => {
        if (userInfo) {
            handleFetchUserWalletBalance();
            handleFetchUserPayouts();
        }
    }, [userInfo]);

    useEffect(() => {
        if (!showWithdrawalModal) {
            setWithdrawalAmount(undefined);
        }
    }, [showWithdrawalModal]);

    return (
        <>
            <WitdrawalModal
                visibility={showWithdrawalModal}
                setVisibility={setShowWithdrawalModal}
                isBankAccountAdded={userBankAccount?.length !== 0}
                isProcessingWithdrawal={isProcessingWithdrawal}
                withdrawalAmount={withdrawalAmount}
                setWithdrawalAmount={setWithdrawalAmount}
                handleInitiateWithdrawal={handleInitiateWithdrawal}
            />
            <main className='px-4 py-8 min-h-screen'>
                <div className='mb-4 flex flex-row justify-between w-full'>
                    <h2 className='text-2xl font-medium text-gray-300'>Wallet page</h2>
                    <button
                        className='w-fit h-fit rounded-full cursor-pointer text-sm p-4 py-2 border-none bg-primary-color text-white hover:bg-white hover:text-primary-color'
                        onClick={() => setShowWithdrawalModal(true)}
                    >
                        Request payment
                    </button>
                </div>

                {/* KPI Section */}
                {/* <div className='w-full flex flex-col md:flex-row gap-4'>
                    <div className='p-6 rounded-2xl flex flex-col w-full justify-between gap-1 bg-dark-grey'>
                        <span className='text-sm font-light text-white'>
                            Total Witdrawals
                        </span>
                        <span className='text-2xl font-semibold font-Mona-Sans-Wide'>
                            &#8358;0
                        </span>
                    </div>
                    <div className='p-6 rounded-2xl flex flex-col w-full justify-between gap-1 bg-dark-grey'>
                        <span className='text-sm font-light text-white'>
                            Current Witdrawable Amount
                        </span>
                        <span className='text-2xl font-semibold font-Mona-Sans-Wide'>
                            &#8358;{(55700).toLocaleString()}
                        </span>
                    </div>
                </div> */}

                {/* <div className="w-full flex flex-col mt-5">
                    <h3 className='mb-3 text-xl'>Events Payments</h3>
                    <div className="w-full flex flex-row gap-4">
                        <div className='p-6 rounded-2xl flex flex-col w-full justify-between gap-1 bg-primary-color basis-1/5'>
                            <span className='text-sm font-light text-white'>
                                Drek House Party
                            </span>
                            <span className='text-2xl font-semibold font-Mona-Sans-Wide'>
                                &#8358;55450
                            </span>
                        </div>
                        <div className='p-6 rounded-2xl flex flex-col w-full justify-between gap-1 bg-primary-color basis-1/5'>
                            <span className='text-sm font-light text-white'>
                                Autem quia event
                            </span>
                            <span className='text-2xl font-semibold font-Mona-Sans-Wide'>
                                &#8358;5450
                            </span>
                        </div>
                    </div>
                </div> */}

                {userBankAccount && userBankAccount[0] && (
                    <div className='mt-5 flex flex-col gap-2'>
                        <h4>Bank details</h4>
                        <div className='bg-text-grey/30 p-5 rounded-2xl w-fit'>
                            <div>
                                <h4>Bank name: {userBankAccount[0].bankName}</h4>
                                <h4>Account number: {userBankAccount[0].accountNumber}</h4>
                                <h4>Account name: {userBankAccount[0].accountName}</h4>
                            </div>
                        </div>
                    </div>
                )}

                {!isFetchingPayouts && userPayouts && (
                    <div className='mt-6 w-full'>
                        <h3 className='mb-3 text-xl'>Payouts</h3>
                        <div className='max-h-[65vh] w-full overflow-y-auto rounded-2xl relative bg-container-grey'>
                            <table className='bg-white w-full text-dark-grey'>
                                <tbody>
                                    <tr className="bg-dark-grey text-white">
                                        {/* <th className='p-3 border-b-[1px] text-left text-sm font-semibold'>
                      Transaction Reference
                    </th> */}
                                        <th className='p-3 border-b-[1px] text-left text-sm font-semibold'>
                                            Amount
                                        </th>
                                        <th className='p-3 border-b-[1px] text-left text-sm font-semibold'>
                                            Date Requested
                                        </th>
                                        <th className='p-3 border-b-[1px] text-left text-sm font-semibold'>
                                            Date Paid
                                        </th>
                                        <th className='p-3 border-b-[1px] text-left text-sm font-semibold'>
                                            Status
                                        </th>
                                        <th className='p-3 border-b-[1px] text-left text-sm font-semibold'>
                                            Payment Method
                                        </th>
                                        <th className='p-3 border-b-[1px] text-left text-sm font-semibold'>
                                            Service Fee
                                        </th>
                                        <th className='p-3 border-b-[1px] text-left text-sm font-semibold'>
                                            Tax
                                        </th>
                                    </tr>

                                    {
                                        userPayouts.map((payout, index) => (
                                            <tr key={index}>
                                                {/* <td className='p-3 border-b-[1px] text-left text-sm'>
                        {payout.transactionRef ?? "Unavailable"}
                      </td> */}
                                                <td className='p-3 border-b-[1px] text-left text-sm'>
                                                    &#8358;{payout.amount}
                                                </td>
                                                <td className='p-3 border-b-[1px] text-left text-sm'>
                                                    {moment(payout.createdAt).format(
                                                        "Do MMM, YYYY | hh:mma"
                                                    )}
                                                </td>
                                                <td className='p-3 border-b-[1px] text-left text-sm'>
                                                    {payout.payoutDate
                                                        ? moment(payout.payoutDate).format(
                                                            "Do MMM, YYYY | hh:mma"
                                                        )
                                                        : ""}
                                                </td>
                                                <td className='p-3 border-b-[1px] text-left text-sm'>
                                                    {payout.status}
                                                </td>
                                                <td className='p-3 border-b-[1px] text-left text-sm'>
                                                    {payout.paymentMethod}
                                                </td>
                                                <td className='p-3 border-b-[1px] text-left text-sm'>{`${payout.serviceFees ?? 0
                                                    }%`}</td>
                                                <td className='p-3 border-b-[1px] text-left text-sm'>{`${payout.tax ?? 0
                                                    }%`}</td>
                                                {/* <td className="p-3 border-b-[1px] text-left text-sm">
                                                    <span className="bg-success-color w-fit px-2 py-4 rounded-xl text-white text-lg">
                                                        5%
                                                    </span>
                                                </td> */}
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
};

export default WalletPage;
