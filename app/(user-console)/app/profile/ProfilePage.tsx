"use client";
import {
  ReactElement,
  FunctionComponent,
  useContext,
  useState,
  useEffect,
} from "react";
import { ProfilePageTab } from "@/app/enums/ProfilePageTab";
import {
  useFetchUserBankAccount,
  useFetchUserInformation,
  useUpdateUserProfileInformation,
} from "@/app/api/apiClient";
import { useSession } from "next-auth/react";
import { catchError } from "@/app/constants/catchError";
import { useRouter } from "next/navigation";
import {
  UserCredentialsResponse,
  UserCredentialsUpdateRequest,
} from "@/app/models/IUser";
import { Icons } from "@/app/components/ui/icons";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import PhotoUpload from "@/app/components/Modal/PhotoUpload";
import UserAvatarContainer from "@/app/components/ProfilePage/UserAvatarContainer";
import UserNameUpdateContainer from "@/app/components/ProfilePage/UserNameUpdateContainer";
import UserCoverContainer from "@/app/components/ProfilePage/UserCoverContainer";
import AccountSettingsFormContainer from "@/app/components/ProfilePage/AccountSettingsFormContainer";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { updateUserCredentials } from "@/app/redux/features/user/userSlice";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import useResponsiveness from "@/app/hooks/useResponsiveness";
import BankInformation from "@/app/components/ProfilePage/BankInformation";
import BankAccountCreationModal from "@/app/components/Modal/BankAccountCreationModal";
import { BankAccount } from "@/app/models/IBankAccount";
import { ToastContext } from "@/app/context/ToastCardContext";
import { serializeProfilePageTab } from "@/app/constants/serializer";
import { ChangePasswordDialog } from "@/app/components/Modal/ChangePasswordDialog";

interface ProfilePageProps {}

const ProfilePage: FunctionComponent<ProfilePageProps> = (): ReactElement => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const fetchUserInformation = useFetchUserInformation();
  const fetchUserBankAccount = useFetchUserBankAccount();

  const toastHandler = useContext(ToastContext);
  const { push, prefetch } = useRouter();
  const updateUserInformation = useUpdateUserProfileInformation();

  const windowRes = useResponsiveness();
  const isMobile = windowRes.width && windowRes.width < 768;
  const onMobile = typeof isMobile == "boolean" && isMobile;
  const onDesktop = typeof isMobile == "boolean" && !isMobile;

  const [isUpdatingUserInformation, setIsUpdatingUserInformation] =
    useState(false);
  const [isFetchingUserBankAccounts, setIsFetchingUserBankAccounts] =
    useState(true);
  const [isFetchingUserInformation, setIsFetchingUserInformation] =
    useState(true);

  const [currentTab, setCurrentTab] = useState(ProfilePageTab.BasicInformation);
  const [isFormFieldsEditable, setIsFormFieldsEditable] = useState(false);
  const [userInformation, setUserInformation] =
    useState<UserCredentialsResponse>();
  const [userBankAccounts, setUserBankAccounts] = useState<BankAccount[]>();
  const [retrievedUserInformation, setRetrievedUserInformation] =
    useState<UserCredentialsResponse>();

  const [isPhotoUploadModalVisible, setIsPhotoUploadModalVisible] =
    useState(false);
  const [isBankAccountModalVisible, setIsBankAccountModalVisible] =
    useState(false);

  const [emailErrorMsg, setEmailErrorMsg] = useState(false);
  const [triggerInfoUpdate, setTriggerInfoUpdate] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const dispatch = useDispatch();

  function showSuccessToast() {
    toastHandler?.logSuccess("Success", "This is a success message");
  }

  async function handleFetchUserInformation() {
    // Show loading indicator
    setIsFetchingUserInformation(true);

    await fetchUserInformation(session?.user.id as string)
      .then((response) => {
        // Save to redux
        // dispatch(updateUserCredentials(response.data));
        // console.log(response.data);
        setUserInformation(response.data);
      })
      .catch((error) => {
        // console.log(error);
        catchError(error);
      })
      .finally(() => {
        setIsFetchingUserInformation(false);
      });
  }

  async function handleUpdateUserInformation() {
    // Start loader
    setIsUpdatingUserInformation(true);

    const data: UserCredentialsUpdateRequest = {
      email: retrievedUserInformation?.email || null,
      firstName: retrievedUserInformation?.firstName || null,
      lastName: retrievedUserInformation?.lastName || null,
      phone: retrievedUserInformation?.phone || null,
      socialLinks: {
        facebookUrl: retrievedUserInformation?.socialLinks?.facebookUrl || null,
        instagramUrl:
          retrievedUserInformation?.socialLinks?.instagramUrl || null,
        twitterUrl: retrievedUserInformation?.socialLinks?.twitterUrl || null,
      },
    };
    // console.log("🚀 ~ handleUpdateUserInformation ~ data:", data);

    // Update user information
    await updateUserInformation(
      user?.token as string,
      userInformation?.id as string,
      data
    )
      .then(async (response) => {
        // Save to redux
        // dispatch(updateUserCredentials(response.data));

        // Fetch user information again
        await handleFetchUserInformation();

        setIsUpdatingUserInformation(false);
        setIsFormFieldsEditable(false);

        toastHandler?.logSuccess("Success", "Profile updated successfully");
      })
      .catch((error) => {
        if (error.response.data.error == "Email is already taken") {
          toastHandler?.logError("Error", "Email is already taken");
          setEmailErrorMsg(true);
        }
        catchError(error);
        setIsUpdatingUserInformation(false);
      });
  }

  async function handleFetchUserBankAccount() {
    // Show loading indicator
    setIsFetchingUserBankAccounts(true);

    // Fetch user bank accounts
    await fetchUserBankAccount(
      user?.token as string,
      userInformation?.id as string
    )
      .then((response) => {
        setUserBankAccounts(response.data);
      })
      .catch((error) => {
        catchError(error);
      })
      .finally(() => {
        setIsFetchingUserBankAccounts(false);
      });
  }

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
    <div className="">
      {userInformation && (
        <>
          {isPhotoUploadModalVisible && (
            <PhotoUpload
              visibility={isPhotoUploadModalVisible}
              setVisibility={setIsPhotoUploadModalVisible}
              handleFetchUserInformation={handleFetchUserInformation}
              userImageUrl={userInformation.profilePhoto}
            />
          )}
          <UserCoverContainer
            userInformation={userInformation}
            handleFetchUserInformation={handleFetchUserInformation}
          />
          <BankAccountCreationModal
            visibility={isBankAccountModalVisible}
            setVisibility={setIsBankAccountModalVisible}
            handleFetchUserBankAccount={handleFetchUserBankAccount}
          />

          <div className="md:py-6 md:px-8 translate-y-[-5rem] z-[3] flex gap-6 relative flex-col md:flex-row p-4">
            <div className="flex flex-col items-center gap-2 z-[3] text-dark-grey bg-white h-fit basis-full max-w-full md:basis-[30%] md:max-w-[30%] pb-4">
              <div className="w-full flex flex-col items-center gap-2 p-4">
                <UserAvatarContainer
                  userInformation={userInformation}
                  setIsPhotoUploadModalVisible={setIsPhotoUploadModalVisible}
                />
                <div className="flex flex-col items-center gap-[0.15rem]">
                  <h3 className="text-[20px] font-medium">{`${userInformation?.firstName} ${userInformation?.lastName}`}</h3>
                  <UserNameUpdateContainer
                    userInformation={userInformation}
                    handleFetchUserInformation={handleFetchUserInformation}
                  />
                </div>
              </div>
              <div className="w-full flex flex-col">
                <Link
                  href={ApplicationRoutes.Events}
                  className="flex items-center justify-between py-2 px-4 border-y border-dark-grey/10 cursor-pointer hover:bg-dark-grey/[0.035]"
                >
                  <p className="text-sm max-w-[85%] whitespace-nowrap overflow-hidden text-ellipsis">
                    Events
                  </p>
                  <span className="font-medium">
                    {userInformation?.stats?.eventsCount || 0}
                  </span>
                </Link>
                <Link
                  href={`${ApplicationRoutes.EventTickets}?t=1`}
                  className="flex items-center justify-between py-2 px-4 border-y border-dark-grey/10 cursor-pointer hover:bg-dark-grey/[0.035]"
                >
                  <p className="text-sm max-w-[85%] whitespace-nowrap overflow-hidden text-ellipsis">
                    Tickets Sold
                  </p>
                  <span className="font-medium">
                    {userInformation.stats?.ticketsSold || 0}
                  </span>
                </Link>
                <div className="flex items-center justify-between py-2 px-4 border-y border-dark-grey/10 cursor-pointer hover:bg-dark-grey/[0.035]">
                  <p className="text-primary-color text-xs">
                    <Link
                      target="_blank"
                      href={`${window.location.origin}/u/${
                        userInformation.username || userInformation.id
                      }`}
                    >
                      {`${window.location.origin}/${
                        userInformation.username || userInformation.id
                      }`}
                    </Link>
                  </p>
                  <span className="font-medium">&nbsp;</span>
                </div>
              </div>
              <div className="w-full py-2 px-4">
                <button
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="primaryButton !w-full justify-center !bg-failed-color hover:!text-white hover:!bg-[darken(#dc143c,_amount:_10%)]"
                >
                  Change Password
                </button>
              </div>
            </div>

            <div className="z-[3] text-dark-grey bg-white basis-full md:basis-[70%] h-fit">
              <div className="w-full flex items-center max-[768px]:overflow-x-auto">
                {Object.values(ProfilePageTab).map((tab) => {
                  if (
                    isNaN(Number(tab)) ||
                    tab == ProfilePageTab.IdentityVerification
                  ) {
                    return;
                  }
                  return (
                    <span
                      key={tab}
                      className={`
                    py-2 px-4 text-[14px] cursor-pointer border-b-2 hover:opacity-100 text-nowrap [&]:not(.active):hover:border-primary-color
                    ${
                      currentTab === tab
                        ? "border-primary-color bg-dark-grey/5 opacity-100 pointer-events-none"
                        : "opacity-50 border-transparent"
                    }`}
                      onClick={() => setCurrentTab(tab as ProfilePageTab)}
                    >
                      {serializeProfilePageTab(Number(tab))}
                    </span>
                  );
                })}
                {onDesktop &&
                  !isFormFieldsEditable &&
                  currentTab === ProfilePageTab.BasicInformation && (
                    <button
                      className="tertiaryButton py-[0.4rem] px-[0.8rem] text-xs ml-auto gap-1 [&_svg_path]:fill-dark-grey"
                      onClick={() => {
                        setIsFormFieldsEditable(true);
                      }}
                    >
                      <Icons.Edit /> Edit Profile
                    </button>
                  )}
                {onDesktop &&
                  (!userBankAccounts || userBankAccounts?.length == 0) &&
                  currentTab === ProfilePageTab.BankInformation && (
                    <button
                      className="tertiaryButton py-[0.4rem] px-[0.8rem] text-xs ml-auto gap-1 [&_svg_path]:fill-dark-grey"
                      onClick={() => setIsBankAccountModalVisible(true)}
                    >
                      <Icons.Add /> Add Bank Account
                    </button>
                  )}
              </div>
              <div className="p-4">
                {currentTab === ProfilePageTab.BasicInformation && (
                  <AccountSettingsFormContainer
                    retrievedUserInformation={retrievedUserInformation}
                    setRetrievedUserInformation={setRetrievedUserInformation}
                    isFormFieldsEditable={isFormFieldsEditable}
                    emailErrorMsg={emailErrorMsg}
                    setTriggerInfoUpdate={setTriggerInfoUpdate}
                  />
                )}
                {currentTab === ProfilePageTab.BankInformation && (
                  <BankInformation
                    userBankAccounts={userBankAccounts}
                    isFetchingUserBankAccounts={isFetchingUserBankAccounts}
                  />
                )}

                {isFormFieldsEditable &&
                  currentTab === ProfilePageTab.BasicInformation && (
                    <div className="flex justify-start gap-4 mt-8">
                      <button
                        className="primaryButton hover:!bg-[darken(#8133f1,_amount:_10%)] !text-white hover:!text-primary-color"
                        disabled={isUpdatingUserInformation}
                        onClick={handleUpdateUserInformation}
                      >
                        {/* onClick={() => showSuccessToast()}> */}
                        Update
                        {isUpdatingUserInformation && (
                          <ComponentLoader
                            isSmallLoader
                            customBackground="#8133F1"
                            lightTheme
                            customLoaderColor="#fff"
                          />
                        )}
                      </button>
                      <button
                        className="tertiaryButton"
                        disabled={isUpdatingUserInformation}
                        onClick={() => setIsFormFieldsEditable(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                {isMobile &&
                  !isFormFieldsEditable &&
                  currentTab === ProfilePageTab.BasicInformation && (
                    <button
                      className="tertiaryButton py-[0.4rem] px-[0.8rem] text-xs ml-auto gap-1 [&_svg_path]:fill-dark-grey"
                      onClick={() => {
                        setIsFormFieldsEditable(true);
                      }}
                    >
                      <Icons.Edit /> Edit Profile
                    </button>
                  )}
                {isMobile &&
                  (!userBankAccounts || userBankAccounts?.length == 0) &&
                  !isFormFieldsEditable &&
                  currentTab === ProfilePageTab.BankInformation && (
                    <button
                      className="tertiaryButton py-[0.4rem] px-[0.8rem] text-xs ml-auto gap-1 [&_svg_path]:fill-dark-grey"
                      onClick={() => {
                        setIsBankAccountModalVisible(true);
                      }}
                    >
                      <Icons.Add /> Add Bank Account
                    </button>
                  )}
              </div>
            </div>
          </div>
        </>
      )}
      {!userInformation && isFetchingUserInformation && (
        <div className="md:h-[40vh] grid place-items-center h-[calc(100vh-50px)]">
          <ComponentLoader customLoaderColor="#fff" />
        </div>
      )}
      <ChangePasswordDialog
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
};

export default ProfilePage;
