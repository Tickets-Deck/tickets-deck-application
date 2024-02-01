import { ReactElement, FunctionComponent } from "react";
import styles from "@/app/styles/UserInformationPage.module.scss";
import { UserCredentialsResponse } from "@/app/models/IUser";

interface UserHighlightsProps {
    userInformation: UserCredentialsResponse
}

const UserHighlights: FunctionComponent<UserHighlightsProps> = ({ userInformation }): ReactElement => {
    return (
        <div className={styles.userHighlights}>
            <h3>Recent Events</h3>
            <div className={styles.noHighlightsContainer}>
                <p>No events yet</p>
            </div>
        </div>
    );
}

export default UserHighlights;