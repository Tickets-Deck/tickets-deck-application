"use client"
import { ReactElement, FunctionComponent, useContext, useState, useEffect } from "react";
import styles from "../../styles/ProfilePage.module.scss"
import Image from "next/image";
import { ToastContext } from "@/app/extensions/toast";
import { ProfilePageTab } from "@/app/enums/ProfilePageTab";
import { useFetchUserInformation, useUpdateUserInformation } from "@/app/api/apiClient";
import { useSession } from "next-auth/react";
import { catchError } from "@/app/constants/catchError";
import { useRouter } from "next/navigation";
import { UserCredentialsRequest, UserCredentialsResponse, UserCredentialsUpdateRequest } from "@/app/models/IUser";
import { CheckIcon, CloseIcon, EditIcon } from "@/app/components/SVGs/SVGicons";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import PhotoUpload from "@/app/components/Modal/PhotoUpload";
import UserAvatarContainer from "@/app/components/ProfilePage/UserAvatarContainer";
import UserNameUpdateContainer from "@/app/components/ProfilePage/UserNameUpdateContainer";
import UserCoverContainer from "@/app/components/ProfilePage/UserCoverContainer";
import AccountSettingsFormContainer from "@/app/components/ProfilePage/AccountSettingsFormContainer";
import Link from "next/link"

interface ProfilePageProps {

}

const ProfilePage: FunctionComponent<ProfilePageProps> = (): ReactElement => {

    const { data: session, update } = useSession();
    const fetchUserInformation = useFetchUserInformation();
    const toastHandler = useContext(ToastContext);
    const updateUserInformation = useUpdateUserInformation();

    const [isUpdatingUserInformation, setIsUpdatingUserInformation] = useState(false);
    const [currentTab, setCurrentTab] = useState(ProfilePageTab.AccountSettings);
    const [isFormFieldsEditable, setIsFormFieldsEditable] = useState(false);
    const [userInformation, setUserInformation] = useState<UserCredentialsResponse>();
    const [retrievedUserInformation, setRetrievedUserInformation] = useState<UserCredentialsResponse>();
    const [isFetchingUserInformation, setIsFetchingUserInformation] = useState(true);
    const [isPhotoUploadModalVisible, setIsPhotoUploadModalVisible] = useState(false);

    const [emailErrorMsg, setEmailErrorMsg] = useState(false);
    const [triggerInfoUpdate, setTriggerInfoUpdate] = useState(false);

    function showSuccessToast() {
        toastHandler?.logSuccess("Success", "This is a success message");
    };

    async function handleFetchUserInformation() {

        // Show loading indicator
        setIsFetchingUserInformation(true);

        await fetchUserInformation(session?.user.id as string)
            .then((response) => {
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
        }
        // console.log("🚀 ~ handleUpdateUserInformation ~ data:", data);

        // Update user information
        await updateUserInformation(userInformation?.id as string, data)
            .then(async (response) => {
                console.log(response);
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
    }

    useEffect(() => {
        if (session && !userInformation) {
            handleFetchUserInformation();
        }
    }, [session]);

    useEffect(() => {
        setRetrievedUserInformation(userInformation);
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
    }, [triggerInfoUpdate])

    return (
        <div className={styles.profilePage}>
            {
                userInformation &&
                <>
                    {
                        isPhotoUploadModalVisible && <PhotoUpload
                            visibility={isPhotoUploadModalVisible}
                            setVisibility={setIsPhotoUploadModalVisible}
                            handleFetchUserInformation={handleFetchUserInformation}
                        />
                    }
                    <UserCoverContainer
                        userInformation={userInformation}
                        handleFetchUserInformation={handleFetchUserInformation}
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
                                <div className={styles.stat}>
                                    <p>Events</p>
                                    <span>{userInformation?.events?.length}</span>
                                </div>
                                <div className={styles.stat}>
                                    <p>Tickets Sold</p>
                                    <span>0</span>
                                </div> 
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
                                <span className={currentTab === ProfilePageTab.AccountSettings ? styles.active : ""} onClick={() => setCurrentTab(ProfilePageTab.AccountSettings)}>Account Settings</span>
                                <span className={currentTab === ProfilePageTab.IdentityVerification ? styles.active : ""} onClick={() => setCurrentTab(ProfilePageTab.IdentityVerification)}>Identity Verification</span>
                                <span className={currentTab === ProfilePageTab.BankInformation ? styles.active : ""} onClick={() => setCurrentTab(ProfilePageTab.BankInformation)}>Bank Information</span>
                                <button className={styles.editButton} onClick={() => { setIsFormFieldsEditable(true) }}><EditIcon /> Edit Profile</button>
                            </div>
                            <div className={styles.settingsFormContainer}>
                                {
                                    currentTab === ProfilePageTab.AccountSettings &&
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