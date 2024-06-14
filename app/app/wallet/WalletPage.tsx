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
                <div className="mb-3">
                    <h2 className="text-2xl font-medium text-gray-300">Wallet page</h2>
                </div>

                {/* KPI Section */}
                <div className="w-full grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl flex flex-col bg-dark-grey">
                        <span className="text-2xl font-semibold mb-4 font-Mona-Sans-Wide">&#8358;{walletBalance && (walletBalance).toLocaleString()}</span>
                        <span className="text-sm font-light text-text-grey">Wallet Balance</span>
                    </div>
                    <div className="p-6 rounded-2xl flex flex-col bg-dark-grey">
                        <span className="text-2xl font-semibold mb-4 font-Mona-Sans-Wide">&#8358;0</span>
                        <span className="text-sm font-light text-text-grey">Total witdrawals</span>
                    </div>
                </div>
                <div className="flex mt-4">
                    <button className="w-fit h-fit rounded-2xl cursor-pointer text-base py-4 px-6 border-none bg-primary-color text-white mx-auto" onClick={() => setShowBetaTestModal(true)}>Request payment</button>
                </div>
            </main>
        </>
    );
}

export default WalletPage;