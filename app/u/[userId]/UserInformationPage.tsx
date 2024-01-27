import { ReactElement, FunctionComponent } from "react";

interface UserInformationPageProps {
    userId: string
}

const UserInformationPage: FunctionComponent<UserInformationPageProps> = ({ userId }): ReactElement => {
    return (
        <div>User information page - {userId}</div>
    );
}

export default UserInformationPage;