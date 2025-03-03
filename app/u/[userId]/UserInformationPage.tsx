"use client"
import { ReactElement, FunctionComponent, useState, useEffect } from "react";
import styles from "../../styles/UserInformationPage.module.scss";
import { UserCredentialsResponse } from "@/app/models/IUser";
import { useFetchUserFollowMetrics, useFetchUserInformationByUserName, useFollowUser } from "@/app/api/apiClient";
import { catchError } from "@/app/constants/catchError";
import Link from "next/link";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import UserCoverContainer from "@/app/components/ProfilePage/UserCoverContainer";
import { Session } from "next-auth";
import UserPersonalInfo from "@/app/components/UserInformationPage/UserPersonalInfo";
import UserSocials from "@/app/components/UserInformationPage/UserSocials";
import UserStats from "@/app/components/UserInformationPage/UserStats";
import UserHighlights from "@/app/components/UserInformationPage/UserHighlights";
import { FollowsActionType, IUserFollowMetrics } from "@/app/models/IFollows";
import { toast } from "sonner";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";

interface UserInformationPageProps {
    identifier: string
    session: Session | null
}

const UserInformationPage: FunctionComponent<UserInformationPageProps> = ({ identifier, session }): ReactElement => {

    const followUser = useFollowUser();
    const fetchUserFollowMetrics = useFetchUserFollowMetrics();
    const fetchUserInformationByUsername = useFetchUserInformationByUserName();

    const [userInformation, setUserInformation] = useState<UserCredentialsResponse>();
    const [isFetchingUserInformation, setIsFetchingUserInformation] = useState(true);
    const [isInteractingWithUserProfile, setIsInteractingWithUserProfile] = useState(false);
    const [isFollowingUser, setIsFollowingUser] = useState<boolean | null>(null);

    const isForUser = session?.user.id === userInformation?.id;

    async function handleFetchUserInformation(hideLoader?: boolean) {
        // console.log("Fetching user information", identifier);

        // Identifier could be username or userId...
        // Check if identifier is a userId; that is if it includes a hyphen
        const userId = identifier.includes('-') ? identifier : undefined;
        const username = identifier.includes('-') ? undefined : identifier;

        // console.log({ userId, username })

        // Show loading indicator
        !hideLoader && setIsFetchingUserInformation(true);

        await fetchUserInformationByUsername(username as string)
            .then((response) => {
                console.log("🚀 ~ .then ~ response:", response)
                // console.log(response.data);
                setUserInformation(response.data);
            })
            .catch((error) => {
                // console.log(error);
                catchError(error);
            })
            .finally(() => {
                setIsFetchingUserInformation(false);
            })
    };

    async function handleFetchUserFollowMetrics() {
        await fetchUserFollowMetrics(userInformation?.id as string, session?.user.id as string)
            .then((response) => {
                // console.log("Fetched metrics: ", response.data);

                const result = response.data as IUserFollowMetrics;

                if (result.isFollowing == true) {
                    setIsFollowingUser(true);
                }
                if (result.isFollowing == false) {
                    setIsFollowingUser(false);
                }
            })
            .catch((error) => {
                // console.log("Failed to fetch user follow metrics: ", error);
                catchError(error);
            })
    }

    async function handleInteractWithUser(followActionType: FollowsActionType) {

        // Spin up loader
        setIsInteractingWithUserProfile(true);

        await followUser(session?.user.id as string, userInformation?.id as string, followActionType)
            .then(async () => {

                handleFetchUserFollowMetrics();

                // Refetch user information
                await handleFetchUserInformation(true);
            })
            .catch((error) => {
                catchError(error);
                toast.error("Failed to follow user");
            })
            .finally(() => {
                setIsInteractingWithUserProfile(false);
            })
    }

    useEffect(() => {
        if (identifier) {
            handleFetchUserInformation();
        }
    }, [identifier]);

    useEffect(() => {
        if (userInformation) {
            handleFetchUserFollowMetrics();
        }
    }, [userInformation]);

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
                        {isForUser && session ?
                            <Link href={ApplicationRoutes.Profile} className={styles.updateProfileBtn}>
                                Update Profile
                            </Link> :
                            <>
                                {
                                    session && isFollowingUser !== null &&
                                    <button
                                        className={styles.updateProfileBtn}
                                        disabled={isInteractingWithUserProfile}
                                        onClick={() => handleInteractWithUser(isFollowingUser ? FollowsActionType.Unfollow : FollowsActionType.Follow)}>
                                        {isFollowingUser ? "Unfollow" : "Follow"}
                                    </button>
                                }
                            </>
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