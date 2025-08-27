import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

type TokenSyncProps = {
    session: Session | null
}

const TokenSync = ({ session }: TokenSyncProps) => {
    const { update } = useSession();

    useEffect(() => {
        const interval = setInterval(async () => {
            if (session && session.user?.accessTokenExpires) {
                // Only refresh if token expires in less than 1 minute
                const timeUntilExpiry = session.user.accessTokenExpires - Date.now();
                if (timeUntilExpiry > 0 && timeUntilExpiry < 60 * 1000) {
                    const updatedSession = await update();
                }
            }
        }, 30 * 1000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, [session, update]);

    return null;
};

export default TokenSync;