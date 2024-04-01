import { ReactElement, FunctionComponent } from "react";
import UserInformationPage from "./UserInformationPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

interface UserInformationProps {
    params: { userId: string }
}

const UserInformation: FunctionComponent<UserInformationProps> = async ({ params }) => {

    const session = await getServerSession(authOptions);

    return (
        <UserInformationPage
            identifier={params.userId}
            session={session}
        />
    );
}

export default UserInformation;