import { ReactElement, FunctionComponent } from "react";
import UserInformationPage from "./UserInformationPage";

interface UserInformationProps {
    params: { userId: string }
}

const UserInformation: FunctionComponent<UserInformationProps> = ({ params }): ReactElement => {
    return (
        <UserInformationPage userId={params.userId} />
    );
}

export default UserInformation;