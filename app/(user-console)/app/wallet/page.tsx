import { FunctionComponent, ReactElement } from "react";
import WalletPage from "./WalletPage";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { Payout, WalletBalance } from "@/app/models/IWallet";
import { useFetchUserPayouts, useFetchUserWalletBalance } from "@/app/api/apiClient";

interface WalletProps {

}

async function getWalletBalance(userId: string, token: string): Promise<WalletBalance | null> {
    const fetchUserWalletBalance = useFetchUserWalletBalance();

    try {
        const response = await fetchUserWalletBalance(userId, token);
        return response.data as WalletBalance;
    } catch (error) {
        console.error("Error fetching wallet balance:", error);
        return null;
    }
}

async function getUserPayouts(userId: string, token: string): Promise<Payout[] | null> {
    const fetchUserPayouts = useFetchUserPayouts();

    try {
        const response = await fetchUserPayouts(userId, token);
        return response.data as Payout[];
    } catch (error) {
        console.error("Error fetching user payouts:", error);
        return null;
    }
}

const Wallet: FunctionComponent<WalletProps> = async () => {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    const walletBalanceInfo = await getWalletBalance(user?.id as string, user?.token as string);
    const userPayouts = await getUserPayouts(user?.id as string, user?.token as string);

    return (
        <WalletPage
            walletBalanceInfo={walletBalanceInfo}
            userPayouts={userPayouts}
        />
    );
}

export default Wallet;