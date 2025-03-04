"use client"
import { useFetchUserWalletBalance } from "@/app/api/apiClient";
import BetaTestModal from "@/app/components/Modal/BetaTestModal";
import { catchError } from "@/app/constants/catchError";
import { RootState } from "@/app/redux/store";
import { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

interface WalletPageProps {

}

const WalletPage: FunctionComponent<WalletPageProps> = (): ReactElement => {

    const fetchUserWalletBalance = useFetchUserWalletBalance();
    const userInfo = useSelector((state: RootState) => state.userCredentials.userInfo);

    const [showBetaTestModal, setShowBetaTestModal] = useState(false);
    const [walletBalance, setWalletBalance] = useState<number>();
    const [showWalletBalance, setShowWalletBalance] = useState(false);

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
        if (userInfo)
            handleFetchUserWalletBalance();
    }, [userInfo]);

    return (
        <>
            <BetaTestModal
                visibility={showBetaTestModal}
                setVisibility={setShowBetaTestModal}
            />
            <main className="px-4 py-8 min-h-screen">
                <div className="mb-4 flex flex-row justify-between w-full">
                    <h2 className="text-2xl font-medium text-gray-300">Wallet page</h2>
                    <button className="w-fit h-fit rounded-full cursor-pointer text-sm p-4 py-2 border-none bg-primary-color text-white hover:bg-white hover:text-primary-color" onClick={() => setShowBetaTestModal(true)}>Request payment</button>
                </div>

                {/* KPI Section */}
                <div className="w-full grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl flex flex-col bg-dark-grey">
                        <span className="text-2xl font-semibold mb-4 font-Mona-Sans-Wide">&#8358;{walletBalance?.toLocaleString() || 0}</span>
                        <span className="text-sm font-light text-text-grey">Wallet Balance</span>
                    </div>
                    <div className="p-6 rounded-2xl flex flex-col bg-dark-grey">
                        <span className="text-2xl font-semibold mb-4 font-Mona-Sans-Wide">&#8358;0</span>
                        <span className="text-sm font-light text-text-grey">Total Witdrawals</span>
                    </div>
                </div>
                {/* <div className="flex mt-4">
                </div> */}


                {
                    false &&
                    <div className="mt-6 w-full">
                        <h3 className="mb-1 text-xl">Payouts</h3>
                        <div className="max-h-[65vh] w-full overflow-y-auto rounded-2xl relative bg-container-grey">
                            <table className="bg-white w-full text-dark-grey">
                                <tbody>
                                    <tr>
                                        <th className="p-3 border-b-[1px] text-left text-sm font-semibold">Transaction Reference</th>
                                        <th className="p-3 border-b-[1px] text-left text-sm font-semibold">Amount</th>
                                        <th className="p-3 border-b-[1px] text-left text-sm font-semibold">Date</th>
                                        <th className="p-3 border-b-[1px] text-left text-sm font-semibold">Status</th>
                                        <th className="p-3 border-b-[1px] text-left text-sm font-semibold">Payment Method</th>
                                        <th className="p-3 border-b-[1px] text-left text-sm font-semibold">Service Fee</th>
                                        <th className="p-3 border-b-[1px] text-left text-sm font-semibold">Tax</th>
                                    </tr>

                                    <tr>
                                        <td className="p-3 border-b-[1px] text-left text-sm">1722343534-sdwerndfy</td>
                                        <td className="p-3 border-b-[1px] text-left text-sm">&#8358;450,000</td>
                                        <td className="p-3 border-b-[1px] text-left text-sm">Mon 15th Jan, 2024 | 04:25pm</td>
                                        <td className="p-3 border-b-[1px] text-left text-sm">Paid</td>
                                        <td className="p-3 border-b-[1px] text-left text-sm">Bank Transfer</td>
                                        <td className="p-3 border-b-[1px] text-left text-sm">5%</td>
                                        <td className="p-3 border-b-[1px] text-left text-sm">
                                            {/* <span className={showTagStyle(OrderStatus.Pending)}> */}
                                            <span className="bg-success-color w-fit px-2 py-4 rounded-xl text-white text-lg">
                                                5%
                                            </span>
                                        </td>
                                    </tr>
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
                }
            </main>
        </>
    );
}

export default WalletPage;