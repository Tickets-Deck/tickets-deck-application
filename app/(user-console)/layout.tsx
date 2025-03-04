import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Layout from "./app/shared/Layout";

export default async function ConsoleLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    return (
        <Layout
            children={children}
            session={session}
        />
    );
}