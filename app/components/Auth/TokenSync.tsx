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
            if (session && Date.now() > session.user?.accessTokenExpires) {
                console.log("Access token expired, refreshing...");

                const updatedSession = await update();
                console.log("Updated session: ", updatedSession);
            }
        }, 5 * 60 * 1000); // Check every 5 minutes

        return () => clearInterval(interval);
    }, [session, update]);

    return null;
};

export default TokenSync;