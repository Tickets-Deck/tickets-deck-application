"use client";
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import styles from "../../styles/AuthStyles.module.scss";
import ComponentLoader from "../Loader/ComponentLoader";
import { useRouter, useSearchParams } from "next/navigation";
import {
    useResendVerificationLink,
    useVerifyUserEmail,
} from "@/app/api/apiClient";
import { catchError } from "@/app/constants/catchError";
import Link from "next/link";
import { Icons } from "../ui/icons";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { StorageKeys } from "@/app/constants/storageKeys";
import { ApplicationError } from "@/app/constants/applicationError";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/app/redux/hook";
import { fetchUserProfile } from "@/app/redux/features/user/userSlice";

interface VerifyEmailPageProps { }

const VerifyEmailPage: FunctionComponent<
    VerifyEmailPageProps
> = (): ReactElement => {
    const router = useRouter();

    const searchParams = useSearchParams();
    const verifyUserEmail = useVerifyUserEmail();
    const resendVerificationLink = useResendVerificationLink();
    const dispatch = useAppDispatch();

    // Get the token from the search params
    const token = searchParams.get("vrtkn");
    const userId = searchParams.get("userId");

    const { data: session, status } = useSession();
    const user = session?.user;

    const [verificationError, setVerificationError] = useState<string>();
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(true);
    const [isResendingEmail, setIsResendingEmail] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    function retrieveNewlyCreatedUserEmail() {
        const newlyCreatedUserEmail = sessionStorage.getItem(
            StorageKeys.NewlyCreatedUserEmail
        );

        if (
            newlyCreatedUserEmail &&
            newlyCreatedUserEmail !== "" &&
            newlyCreatedUserEmail !== null
        ) {
            return newlyCreatedUserEmail;
        }
    }

    function openMailApp() {
        const mailtoLink = "mailto:";
        window.location.href = mailtoLink;
    }

    async function handleVerifyUserEmail() {
        // Set the isVerifyingEmail state to true
        setIsVerifyingEmail(true);

        await verifyUserEmail(token as string, userId as string)
            .then(() => {
                // Set the isEmailVerified state to true
                setIsEmailVerified(true);
            })
            .catch((error) => {
                console.log("🚀 ~ handleVerifyUserEmail ~ error:", error);
                if (error.response.data.errorCode == ApplicationError.EmailAlreadyVerified.Code) {
                    setIsEmailVerified(true);
                }
                catchError(error);
            })
            .finally(() => {
                // Set the isVerifyingEmail state to false
                setIsVerifyingEmail(false);
            });
    }

    async function handleResendVerificationLink() {
        // Set the isResendingEmail state to true
        setIsResendingEmail(true);

        await resendVerificationLink(userId as string)
            .then((response) => {
                router.push(ApplicationRoutes.VerifyEmail);
            })
            .catch((error) => {
                if (error.response.data.errorCode == ApplicationError.EmailAlreadyVerified.Code) {
                    setIsEmailVerified(true);
                }
                catchError(error);
            })
            .finally(() => {
                // Close the loader
                setIsResendingEmail(false);
            });
    }

    useEffect(() => {
        if (token && userId) {
            handleVerifyUserEmail();
        }
    }, [token, userId]);

    // This hook fetches the profile of the user if the user is logged in & the email verified status is true
    useEffect(() => {
        if (!user || !isEmailVerified) return;
        dispatch(fetchUserProfile(session?.user.id as string));
    }, [isEmailVerified, user]);

    return (
        <div className='max-[768px]:sectionPadding flex md:grid place-items-center py-[5rem] min-h-[90vh] bg-dark-grey'>
            <div
                className={`bg-dark-grey-2 text-white rounded-[1.25rem] flex w-screen max-h-none md:mx-auto md:max-h-fit md:w-[70vw] xl:w-[35vw] h-fit overflow-hidden max-w-[450px]`}
            >
                {
                    // If there is no token in the search params
                    !token && (
                        <div className='py-6 flex px-5 w-full flex-col gap-6'>
                            <div className='flex items-center flex-col gap-1 mb-3'>
                                <h3 className='font-semibold text-xl mb-3'>Verify your email</h3>
                                <p className='text-center text-base w-[80%]'>
                                    We have sent a verification link to your email address
                                    {retrieveNewlyCreatedUserEmail() && (
                                        <>
                                            &nbsp;<span className="font-medium text-primary-color-sub underline">{retrieveNewlyCreatedUserEmail()}</span>
                                        </>
                                    )}
                                </p>
                            </div>
                            <div className='flex flex-col gap-4 md:min-w-[25rem] w-full min-w-[auto]'>
                                <button
                                    className='p-[0.65rem] rounded-lg bg-white text-dark-grey text-center cursor-pointer border-none outline-none hover:opacity-80'
                                    type='submit'
                                    onClick={openMailApp}
                                    disabled={isVerifyingEmail}
                                >
                                    Open email
                                </button>
                            </div>
                        </div>
                    )
                }
                {
                    // If there is a token in the search params, and the user's email isn't verified yet, and the email is being verified
                    token && !isEmailVerified && isVerifyingEmail && (
                        <div className="py-6 flex px-5 w-full flex-col gap-6">
                            <h3 className='font-semibold text-xl text-center mb-3'>Verifying your email...</h3>
                            <div className={styles.loader}>
                                <ComponentLoader customLoaderColor='#111111' />
                            </div>
                            {verificationError && (
                                <span className={styles.errorMsg}>{verificationError}</span>
                            )}
                        </div>
                    )
                }
                {
                    // If there is a token in the search params, and the email has been verified successfully
                    token && isEmailVerified && !isVerifyingEmail && (
                        <div className='py-6 flex px-5 w-full flex-col items-center gap-6'>
                            <h3 className='font-semibold text-xl mb-3'>Email verified</h3>
                            <span>
                                <span className="w-20 h-20 grid place-items-center mx-auto">
                                    <Icons.Verified className="w-14 h-14 [&_path]:fill-success-color" />
                                </span>
                            </span>
                            <p className="text-center">
                                Your email has been verified successfully.
                                {!user && "You can now login to your account."}
                            </p>
                            {
                                user ?
                                    <Link
                                        className='w-full p-[0.65rem] rounded-lg bg-white text-dark-grey text-center cursor-pointer border-none outline-none hover:opacity-80'
                                        href={ApplicationRoutes.Home}>
                                        Go to homepage
                                    </Link> :
                                    <Link
                                        className='w-full p-[0.65rem] rounded-lg bg-white text-dark-grey text-center cursor-pointer border-none outline-none hover:opacity-80'
                                        href={ApplicationRoutes.SignIn}>
                                        Login
                                    </Link>
                            }
                        </div>
                    )
                }
                {
                    // If there is a token in the search params, and the email verification failed
                    token && !isEmailVerified && !isVerifyingEmail && (
                        <div className="py-6 flex px-5 w-full flex-col gap-6 text-center">
                            <h3 className='font-semibold text-xl mb-3'>Failed to verify email</h3>
                            <p>
                                An error occurred while verifying your email. Please click the
                                button below to resend the verification email.
                            </p>
                            <button
                                className='p-[0.65rem] rounded-lg bg-white text-dark-grey text-center cursor-pointer border-none outline-none hover:opacity-80'
                                type='submit'
                                onClick={() => handleResendVerificationLink()}
                                disabled={isResendingEmail}
                            >
                                Resend verification email
                            </button>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default VerifyEmailPage;
