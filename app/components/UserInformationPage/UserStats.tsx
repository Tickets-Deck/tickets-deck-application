import { UserCredentialsResponse } from "@/app/models/IUser";
import { ReactElement, FunctionComponent } from "react";
import styles from "@/app/styles/UserInformationPage.module.scss";

interface UserStatsProps {
    userInformation: UserCredentialsResponse
}

const UserStats: FunctionComponent<UserStatsProps> = ({ userInformation }): ReactElement => {
    return (
        <div className={styles.userStats}>
            <div className={styles.stat}>
                <p className={styles.stat__number}>
                    {userInformation.eventsCount}
                </p>
                <p className={styles.stat__label}>
                    Events
                </p>
            </div>
            {/* <div className={styles.stat}>
                                <p className={styles.stat__number}>
                                    {userInformation.ticketOrdersCount}
                                </p>
                                <p className={styles.stat__label}>
                                    Tickets
                                </p>
                            </div> */}
            <div className={styles.stat}>
                <p className={styles.stat__number}>
                    {userInformation.followersCount}
                </p>
                <p className={styles.stat__label}>
                    {userInformation.followersCount > 1 ? "Followers" : "Follower"}
                </p>
            </div>
            <div className={styles.stat}>
                <p className={styles.stat__number}>
                    {userInformation.followingCount}
                </p>
                <p className={styles.stat__label}>
                    Following
                </p>
            </div>
        </div>
    );
}

export default UserStats;