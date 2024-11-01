"use client"
import { ReactElement, FunctionComponent, useContext, useState, useEffect } from "react";
import styles from "../../styles/ProfilePage.module.scss"
import { ToastContext } from "@/app/extensions/toast";
import { ProfilePageTab } from "@/app/enums/ProfilePageTab";
import { useFetchUserBankAccount, useFetchUserInformation, useUpdateUserInformation } from "@/app/api/apiClient";
import { useSession } from "next-auth/react";
import { catchError } from "@/app/constants/catchError";
import { useRouter } from "next/navigation";
import { UserCredentialsResponse, UserCredentialsUpdateRequest } from "@/app/models/IUser";
import { AddIcon, EditIcon } from "@/app/components/SVGs/SVGicons";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import PhotoUpload from "@/app/components/Modal/PhotoUpload";
import UserAvatarContainer from "@/app/components/ProfilePage/UserAvatarContainer";
import UserNameUpdateContainer from "@/app/components/ProfilePage/UserNameUpdateContainer";
import UserCoverContainer from "@/app/components/ProfilePage/UserCoverContainer";
import AccountSettingsFormContainer from "@/app/components/ProfilePage/AccountSettingsFormContainer";
import Link from "next/link"
import { useDispatch } from "react-redux";
import { updateUserCredentials } from "@/app/redux/features/user/userSlice";
import { updateUserBankAccount } from "@/app/redux/features/user/walletSlice";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import useResponsiveness from "@/app/hooks/useResponsiveness";
import BankInformation from "@/app/components/ProfilePage/BankInformation";
import BankAccountCreationModal from "@/app/components/Modal/BankAccountCreationModal";
import { BankAccount } from "@/app/models/IBankAccount";

interface ProfilePageProps {

}

const ProfilePage: FunctionComponent<ProfilePageProps> = (): ReactElement => {

    const { data: session, update, status } = useSession();
    const fetchUserInformation = useFetchUserInformation();
    const fetchUserBankAccount = useFetchUserBankAccount();

    const toastHandler = useContext(ToastContext);
    const { push, prefetch } = useRouter();
    const updateUserInformation = useUpdateUserInformation();

    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof (isMobile) == "boolean" && isMobile;
    const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    const [isUpdatingUserInformation, setIsUpdatingUserInformation] = useState(false);
    const [isFetchingUserBankAccounts, setIsFetchingUserBankAccounts] = useState(true);
    const [isFetchingUserInformation, setIsFetchingUserInformation] = useState(true);

    const [currentTab, setCurrentTab] = useState(ProfilePageTab.BasicInformation);
    const [isFormFieldsEditable, setIsFormFieldsEditable] = useState(false);
    const [userInformation, setUserInformation] = useState<UserCredentialsResponse>();
    const [userBankAccounts, setUserBankAccounts] = useState<BankAccount[]>();
    const [retrievedUserInformation, setRetrievedUserInformation] = useState<UserCredentialsResponse>();

    const [isPhotoUploadModalVisible, setIsPhotoUploadModalVisible] = useState(false);
    const [isBankAccountModalVisible, setIsBankAccountModalVisible] = useState(false);

    const [emailErrorMsg, setEmailErrorMsg] = useState(false);
    const [triggerInfoUpdate, setTriggerInfoUpdate] = useState(false);

    const dispatch = useDispatch();

    function showSuccessToast() {
        toastHandler?.logSuccess("Success", "This is a success message");
    };

    async function handleFetchUserInformation() {

        // Show loading indicator
        setIsFetchingUserInformation(true);

        await fetchUserInformation(session?.user.id as string)
            .then((response) => {
                // Save to redux
                dispatch(updateUserCredentials(response.data));
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

    async function handleUpdateUserInformation() {

        // Start loader
        setIsUpdatingUserInformation(true);

        const data: UserCredentialsUpdateRequest = {
            email: retrievedUserInformation?.email || null,
            firstName: retrievedUserInformation?.firstName || null,
            lastName: retrievedUserInformation?.lastName || null,
            phone: retrievedUserInformation?.phone || null,
            facebookUrl: retrievedUserInformation?.facebookUrl || null,
            instagramUrl: retrievedUserInformation?.instagramUrl || null,
            twitterUrl: retrievedUserInformation?.twitterUrl || null,
        }
        // console.log("🚀 ~ handleUpdateUserInformation ~ data:", data);

        // Update user information
        await updateUserInformation(userInformation?.id as string, data)
            .then(async (response) => {
                // console.log(response);

                // Save to redux
                dispatch(updateUserCredentials(response.data));

                // Fetch user information again
                await handleFetchUserInformation();

                // Update the user's profile photo in the session
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        name: `${response.data.firstName} ${response.data.lastName}`,
                        email: response.data.email,
                    },
                })

                setIsUpdatingUserInformation(false);
                setIsFormFieldsEditable(false);
            })
            .catch((error) => {
                if (error.response.data.error == "Email is already taken") {
                    toastHandler?.logError("Error", "Email is already taken");
                    setEmailErrorMsg(true);
                }
                catchError(error);
                setIsUpdatingUserInformation(false);
            })
    };

    async function handleFetchUserBankAccount() {
        // Show loading indicator
        setIsFetchingUserBankAccounts(true);

        // Fetch user bank accounts
        await fetchUserBankAccount(userInformation?.id as string)
            .then((response) => {
                // Save to redux
                dispatch(updateUserBankAccount(response.data));
                setUserBankAccounts(response.data);
            })
            .catch((error) => {
                catchError(error);
            })
            .finally(() => {
                setIsFetchingUserBankAccounts(false);
            })
    };

    useEffect(() => {
        if (session && !userInformation) {
            handleFetchUserInformation();
        }
    }, [session]);

    useEffect(() => {
        if (status === "unauthenticated") {
            push(ApplicationRoutes.SignIn);
        }
    }, [status]);

    useEffect(() => {
        setRetrievedUserInformation(userInformation);
        handleFetchUserBankAccount();
    }, [userInformation]);

    useEffect(() => {
        setTimeout(() => {
            setEmailErrorMsg(false);
        }, 3000);
    }, [emailErrorMsg]);

    useEffect(() => {
        if (triggerInfoUpdate) {
            handleUpdateUserInformation();
        }
    }, [triggerInfoUpdate]);

    return (
        <div className={styles.profilePage}>
            {
                userInformation &&
                <>
                    {
                        isPhotoUploadModalVisible &&
                        <PhotoUpload
                            visibility={isPhotoUploadModalVisible}
                            setVisibility={setIsPhotoUploadModalVisible}
                            handleFetchUserInformation={handleFetchUserInformation}
                        />
                    }
                    <UserCoverContainer
                        userInformation={userInformation}
                        handleFetchUserInformation={handleFetchUserInformation}
                    />
                    <BankAccountCreationModal
                        visibility={isBankAccountModalVisible}
                        setVisibility={setIsBankAccountModalVisible}
                        handleFetchUserBankAccount={handleFetchUserBankAccount}
                    />

                    <div className={styles.profilePage__body}>
                        <div className={styles.profileInfo}>
                            <div className={styles.basicInfoSection}>
                                <UserAvatarContainer
                                    userInformation={userInformation}
                                    setIsPhotoUploadModalVisible={setIsPhotoUploadModalVisible}
                                />
                                <div className={styles.userInfo}>
                                    <h3>{`${userInformation?.firstName} ${userInformation?.lastName}`}</h3>
                                    <UserNameUpdateContainer
                                        userInformation={userInformation}
                                        handleFetchUserInformation={handleFetchUserInformation}
                                    />
                                </div>
                            </div>
                            <div className={styles.stats}>
                                <Link href={ApplicationRoutes.Events} className={styles.stat}>
                                    <p>Events</p>
                                    <span>{userInformation?.eventsCount}</span>
                                </Link>
                                <Link href={`${ApplicationRoutes.EventTickets}?t=1`} className={styles.stat}>
                                    <p>Tickets Sold</p>
                                    <span>{userInformation.ticketsSold}</span>
                                </Link>
                                <div className={styles.stat}>
                                    <p className={styles.userLink}>
                                        <Link target="_blank" href={`${window.location.origin}/u/${userInformation.username ?? userInformation.id}`}>
                                            {`${window.location.origin}/${userInformation.username ?? userInformation.id}`}
                                        </Link>
                                    </p>
                                    <span>&nbsp;</span>
                                </div>
                            </div>
                            <div className={styles.accountAction}>
                                <button>Change Password</button>
                            </div>
                        </div>
                        <div className={styles.mainProfileInfo}>
                            <div className={styles.optionSelectionContainer}>
                                <span className={currentTab === ProfilePageTab.BasicInformation ? styles.active : ""} onClick={() => setCurrentTab(ProfilePageTab.BasicInformation)}>Basic Information</span>
                                {/* <span className={currentTab === ProfilePageTab.IdentityVerification ? styles.active : ""} onClick={() => setCurrentTab(ProfilePageTab.IdentityVerification)}>Identity Verification</span> */}
                                <span className={currentTab === ProfilePageTab.BankInformation ? styles.active : ""} onClick={() => setCurrentTab(ProfilePageTab.BankInformation)}>Bank Information</span>
                                {
                                    onDesktop &&
                                    !isFormFieldsEditable &&
                                    currentTab === ProfilePageTab.BasicInformation &&
                                    <button className={styles.editButton} onClick={() => { setIsFormFieldsEditable(true) }}>
                                        <EditIcon /> Edit Profile
                                    </button>
                                }
                                {
                                    onDesktop &&
                                    (!userBankAccounts || userBankAccounts?.length == 0) &&
                                    currentTab === ProfilePageTab.BankInformation &&
                                    <button className={styles.editButton} onClick={() => setIsBankAccountModalVisible(true)}>
                                        <AddIcon /> Add Bank Account
                                    </button>
                                }
                            </div>
                            <div className={styles.settingsFormContainer}>
                                {
                                    currentTab === ProfilePageTab.BasicInformation &&
                                    <AccountSettingsFormContainer
                                        userInformation={userInformation}
                                        retrievedUserInformation={retrievedUserInformation}
                                        setRetrievedUserInformation={setRetrievedUserInformation}
                                        isFormFieldsEditable={isFormFieldsEditable}
                                        emailErrorMsg={emailErrorMsg}
                                        setTriggerInfoUpdate={setTriggerInfoUpdate}
                                    />
                                }
                                {
                                    currentTab === ProfilePageTab.BankInformation &&
                                    <BankInformation
                                        userBankAccounts={userBankAccounts}
                                        isFetchingUserBankAccounts={isFetchingUserBankAccounts}
                                    />
                                }


                                {
                                    isFormFieldsEditable &&
                                    <div className={styles.actionButtonContainer}>
                                        <button
                                            disabled={isUpdatingUserInformation}
                                            onClick={handleUpdateUserInformation}>
                                            {/* onClick={() => showSuccessToast()}> */}
                                            Update
                                            {isUpdatingUserInformation && <ComponentLoader isSmallLoader customBackground="#8133F1" lightTheme customLoaderColor="#fff" />}
                                        </button>
                                        <button
                                            disabled={isUpdatingUserInformation}
                                            onClick={() => setIsFormFieldsEditable(false)}>
                                            Cancel
                                        </button>
                                    </div>
                                }
                                {
                                    isMobile &&
                                    !isFormFieldsEditable &&
                                    currentTab === ProfilePageTab.BasicInformation &&
                                    <button className={styles.editButton} onClick={() => { setIsFormFieldsEditable(true) }}>
                                        <EditIcon /> Edit Profile
                                    </button>
                                }
                                {
                                    isMobile &&
                                    (!userBankAccounts || userBankAccounts?.length == 0) &&
                                    !isFormFieldsEditable &&
                                    currentTab === ProfilePageTab.BankInformation &&
                                    <button className={styles.editButton} onClick={() => { setIsBankAccountModalVisible(true) }}>
                                        <AddIcon /> Add Bank Account
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </>
            }
            {
                !userInformation && isFetchingUserInformation &&
                <div className={styles.profilePage__loader}>
                    <ComponentLoader customLoaderColor="#fff" />
                </div>
            }
        </div>
    );
}

export default ProfilePage;