"use client"
import { ReactElement, FunctionComponent, useContext, useState, useEffect } from "react";
import styles from "../../styles/ProfilePage.module.scss"
import Image from "next/image";
import { ToastContext } from "@/app/extensions/toast";
import { ProfilePageTab } from "@/app/enums/ProfilePageTab";
import { useFetchUserInformation } from "@/app/api/apiClient";
import { useSession } from "next-auth/react";
import { catchError } from "@/app/constants/catchError";
import { useRouter } from "next/navigation";
import { UserCredentialsResponse } from "@/app/models/IUser";
import { CheckIcon, CloseIcon, EditIcon } from "@/app/components/SVGs/SVGicons";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import PhotoUpload from "@/app/components/Modal/PhotoUpload";
import UserAvatarContainer from "@/app/components/ProfilePage/UserAvatarContainer";
import UserNameUpdateContainer from "@/app/components/ProfilePage/UserNameUpdateContainer";

interface ProfilePageProps {

}

const ProfilePage: FunctionComponent<ProfilePageProps> = (): ReactElement => {

    const { data: session } = useSession();
    const fetchUserInformation = useFetchUserInformation();
    const toastHandler = useContext(ToastContext);
    const [currentTab, setCurrentTab] = useState(ProfilePageTab.AccountSettings);
    const [isFormFieldsEditable, setIsFormFieldsEditable] = useState(false);
    const [userInformation, setUserInformation] = useState<UserCredentialsResponse>();
    const [isFetchingUserInformation, setIsFetchingUserInformation] = useState(true);
    const [isPhotoUploadModalVisible, setIsPhotoUploadModalVisible] = useState(false);

    function showSuccessToast() {
        toastHandler?.logSuccess("Success", "This is a success message");
    };

    async function handleFetchUserInformation() {

        // Show loading indicator
        setIsFetchingUserInformation(true);

        await fetchUserInformation(session?.user.id as string)
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
        if (session) {
            handleFetchUserInformation();
        }
    }, [session]);

    return (
        <div className={styles.profilePage}>
            {
                !isFetchingUserInformation && userInformation &&
                <>
                    {
                        isPhotoUploadModalVisible && <PhotoUpload visibility={isPhotoUploadModalVisible} setVisibility={setIsPhotoUploadModalVisible} />
                    }
                    <div className={styles.profilePage__header}>
                        {/* <h1>Profile</h1> */}
                        <div className={styles.coverImage}>
                            <Image src="https://placehold.co/1200x300/8133F1/FFFFFF/png?text=Cover" alt="Cover image" fill />
                        </div>
                        <button className={styles.editButton}><EditIcon />Edit Cover Photo</button>
                    </div>
                    <div className={styles.profilePage__body}>
                        <div className={styles.profileInfo}>
                            <div className={styles.basicInfoSection}>
                                <UserAvatarContainer
                                    userInformation={userInformation}
                                    setIsPhotoUploadModalVisible={setIsPhotoUploadModalVisible}
                                />
                                <div className={styles.userInfo}>
                                    <h3>{`${userInformation?.firstName} ${userInformation?.lastName}`}</h3>
                                    <UserNameUpdateContainer userInformation={userInformation} />
                                </div>
                            </div>
                            <div className={styles.stats}>
                                <div className={styles.stat}>
                                    <p>Events</p>
                                    <span>{userInformation?.events?.length}</span>
                                </div>
                                <div className={styles.stat}>
                                    <p>Tickets Sold</p>
                                    <span>10</span>
                                </div>
                                <div className={styles.stat}>
                                    <p>Event likes</p>
                                    <span>10</span>
                                </div>
                            </div>
                            <div className={styles.accountAction}>
                                <button>Change Password</button>
                            </div>
                        </div>
                        <div className={styles.mainProfileInfo}>
                            <div className={styles.optionSelectionContainer}>
                                <span className={currentTab === ProfilePageTab.AccountSettings ? styles.active : ""} onClick={() => setCurrentTab(ProfilePageTab.AccountSettings)}>Account Settings</span>
                                <span className={currentTab === ProfilePageTab.IdentityVerification ? styles.active : ""} onClick={() => setCurrentTab(ProfilePageTab.IdentityVerification)}>Documents</span>
                                <span className={currentTab === ProfilePageTab.BankInformation ? styles.active : ""} onClick={() => setCurrentTab(ProfilePageTab.BankInformation)}>Billing</span>
                                <button className={styles.editButton} onClick={() => { setIsFormFieldsEditable(true) }}><EditIcon /> Edit Profile</button>
                            </div>
                            <div className={styles.settingsFormContainer}>
                                {
                                    currentTab === ProfilePageTab.AccountSettings &&
                                    <div className={styles.accountSettingsFormContainer}>
                                        <div className={styles.formRow}>
                                            <div className={styles.formField}>
                                                <label htmlFor="firstname">First name</label>
                                                <input
                                                    type="text"
                                                    name="firstname"
                                                    value={userInformation?.firstName}
                                                    placeholder="Enter first name"
                                                    onChange={(e) => { }}
                                                    disabled
                                                />
                                                {/* {true && <span className={styles.errorMsg}>Please enter your first name</span>} */}
                                            </div>
                                            <div className={styles.formField}>
                                                <label htmlFor="lastname">Last name</label>
                                                <input
                                                    type="text"
                                                    name="lastname"
                                                    value={userInformation?.lastName}
                                                    placeholder="Enter last name"
                                                    onChange={(e) => { }}
                                                    disabled
                                                />
                                                {/* {true && <span className={styles.errorMsg}>Please enter your last name</span>} */}
                                            </div>
                                        </div>
                                        <div className={styles.formField}>
                                            <label htmlFor="firstname">Email address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={userInformation?.email}
                                                placeholder="Enter email address"
                                                onChange={(e) => { }}
                                                disabled
                                            />
                                            {/* {true && <span className={styles.errorMsg}>Please enter your email address</span>} */}
                                        </div>
                                    </div>
                                }
                                {
                                    isFormFieldsEditable &&
                                    <div className={styles.actionButtonContainer}>
                                        <button onClick={() => showSuccessToast()}>Update</button>
                                        <button onClick={() => setIsFormFieldsEditable(false)}>Cancel</button>
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