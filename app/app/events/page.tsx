import { FunctionComponent, ReactElement } from "react";
import UserEventsPage from "./UserEventsPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

interface UserEventsProps {
    
}
 
const UserEvents: FunctionComponent<UserEventsProps> = async () => {

    const session = await getServerSession(authOptions);

    return ( <UserEventsPage session={session} /> );
}
 
export default UserEvents;