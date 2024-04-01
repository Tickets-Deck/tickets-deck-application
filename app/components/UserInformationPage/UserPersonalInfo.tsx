import { ReactElement, FunctionComponent } from "react";
import UserAvatarContainer from "../ProfilePage/UserAvatarContainer";
import styles from "@/app/styles/UserInformationPage.module.scss";
import { UserCredentialsResponse } from "@/app/models/IUser";

interface UserPersonalInfoProps {
    userInformation: UserCredentialsResponse
}

const UserPersonalInfo: FunctionComponent<UserPersonalInfoProps> = ({ userInformation }): ReactElement => {
    return (
        <div className={styles.userPersonalInfo}>
            <div className={styles.userPersonalInfo__avatar}>
                <UserAvatarContainer
                    userInformation={userInformation}
                    userAvatarSize={140}
                />
            </div>
            <div className={styles.userPersonalInfo__info}>
                <h3 className={styles.userPersonalInfo__info__name}>
                    {userInformation?.firstName} {userInformation?.lastName}
                </h3>
                {
                    userInformation?.username &&
                    <p className={styles.userPersonalInfo__info__username}>
                        @{userInformation?.username}
                    </p>
                }
            </div>
        </div>
    );
}

export default UserPersonalInfo;