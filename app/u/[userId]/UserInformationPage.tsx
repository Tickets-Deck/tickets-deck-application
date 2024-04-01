"use client"
import { ReactElement, FunctionComponent, useState, useEffect } from "react";
import styles from "../../styles/UserInformationPage.module.scss";
import { UserCredentialsResponse } from "@/app/models/IUser";
import { useFetchUserInformation, useFetchUserInformationByUserName } from "@/app/api/apiClient";
import { catchError } from "@/app/constants/catchError";
import UserAvatarContainer from "@/app/components/ProfilePage/UserAvatarContainer";
import Link from "next/link";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import UserCoverContainer from "@/app/components/ProfilePage/UserCoverContainer";
import { FacebookIcon, InstagramIcon, TwitterIcon } from "@/app/components/SVGs/SVGicons";
import { Session } from "next-auth";
import UserPersonalInfo from "@/app/components/UserInformationPage/UserPersonalInfo";
import UserSocials from "@/app/components/UserInformationPage/UserSocials";
import UserStats from "@/app/components/UserInformationPage/UserStats";
import UserHighlights from "@/app/components/UserInformationPage/UserHighlights";

interface UserInformationPageProps {
    identifier: string
    session: Session | null
}

const UserInformationPage: FunctionComponent<UserInformationPageProps> = ({ identifier, session }): ReactElement => {

    const fetchUserInformation = useFetchUserInformation();
    const fetchUserInformationByUsername = useFetchUserInformationByUserName();
    const [userInformation, setUserInformation] = useState<UserCredentialsResponse>();
    const [isFetchingUserInformation, setIsFetchingUserInformation] = useState(true);
    const [isPhotoUploadModalVisible, setIsPhotoUploadModalVisible] = useState(false);

    const isForUser = session?.user.id === userInformation?.id;


    async function handleFetchUserInformation() {
        console.log("Fetching user information", identifier);

        // Identifier could be username or userId...
        // Check if identifier is a userId; that is if it includes a hyphen
        const userId = identifier.includes('-') ? identifier : undefined;
        const username = identifier.includes('-') ? undefined : identifier;

        // console.log({ userId, username })

        // Show loading indicator
        setIsFetchingUserInformation(true);

        await fetchUserInformationByUsername(userId ? { userId } : username ? { username } : {})
            .then((response) => {
                console.log(response.data);
                setUserInformation(response.data);
            })
            .catch((error) => {
                console.log(error);
                catchError(error);
            })
            .finally(() => {
                setIsFetchingUserInformation(false);
            })
    };

    useEffect(() => {
        if (identifier) {
            handleFetchUserInformation();
        }
    }, [identifier]);

    return (
        <div className={styles.profilePage}>
            {
                userInformation &&
                <>
                    <UserCoverContainer
                        userInformation={userInformation}
                        handleFetchUserInformation={handleFetchUserInformation}
                        forUser
                    />
                    <div className={styles.profilePage__body}>
                        <UserPersonalInfo
                            userInformation={userInformation}
                        />
                        <UserSocials
                            userInformation={userInformation}
                        />
                        <UserStats
                            userInformation={userInformation}
                        />
                        {isForUser &&
                            <Link href="/app/profile" className={styles.updateProfileBtn}>
                                Update Profile
                            </Link>
                        }
                        <UserHighlights
                            userInformation={userInformation}
                        />
                    </div>
                </>
            }
            {
                !userInformation && isFetchingUserInformation &&
                <div className={styles.profilePage__loader}>
                    <ComponentLoader customLoaderColor="#fff" />
                </div>
            }
            {
                !userInformation && !isFetchingUserInformation &&
                <div className={styles.profilePage__notFound}>
                    <h3>User not found</h3>
                    <p>Sorry, we couldn't find the user you're looking for.</p>
                </div>
            }
        </div>
    );
}

export default UserInformationPage;