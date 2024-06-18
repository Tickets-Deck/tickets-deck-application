"use client"
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import styles from "../../styles/AuthStyles.module.scss";
import ComponentLoader from "../Loader/ComponentLoader";
import { useParams, useSearchParams } from "next/navigation";
import { useResendVerificationLink, useVerifyUserEmail } from "@/app/api/apiClient";
import { catchError } from "@/app/constants/catchError";
import Link from "next/link";
import { CheckIcon, VerifiedIcon } from "../SVGs/SVGicons";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { StorageKeys } from "@/app/constants/storageKeys";

interface VerifyEmailPageProps {

}

const VerifyEmailPage: FunctionComponent<VerifyEmailPageProps> = (): ReactElement => {

    const searchParams = useSearchParams();
    const verifyUserEmail = useVerifyUserEmail();
    const resendVerificationLink = useResendVerificationLink();

    // Get the token from the search params
    const token = searchParams.get("vrtkn");

    const [verificationError, setVerificationError] = useState<string>();
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
    const [isResendingEmail, setIsResendingEmail] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    function retrieveNewlyCreatedUserEmail() {
        const newlyCreatedUserEmail = sessionStorage.getItem(StorageKeys.NewlyCreatedUserEmail);

        if (newlyCreatedUserEmail && newlyCreatedUserEmail !== "" && newlyCreatedUserEmail !== null) {
            return newlyCreatedUserEmail;
        }
    }

    function openMailApp() {
        const mailtoLink = 'mailto:';
        window.location.href = mailtoLink;
    };

    async function handleVerifyUserEmail() {

        // Set the isVerifyingEmail state to true
        setIsVerifyingEmail(true);

        await verifyUserEmail(token as string)
            .then((response) => {

                if (response.data.user) {
                    const email = response.data.user.email;

                    // Save the email to session storage
                    sessionStorage.setItem(StorageKeys.NewlyCreatedUserEmail, email);
                }

                // Set the isEmailVerified state to true
                setIsEmailVerified(true);
            })
            .catch((error) => {
                console.log("Verification error: ", error);
                catchError(error);
            })
            .finally(() => {
                // Set the isVerifyingEmail state to false
                setIsVerifyingEmail(false);
            });
    };

    async function handleResendVerificationLink() {

        // Set the isResendingEmail state to true
        setIsResendingEmail(true);

        await resendVerificationLink(retrieveNewlyCreatedUserEmail() as string)
            .then((response) => {
                console.log("Resend response: ", response);

                if (response.data.error) {
                    // setVerificationError(response.data.error);
                }
            })
            .catch((error) => {
                catchError(error);
            })
            .finally(() => {
                // Close the loader
                setIsResendingEmail(false);
            });
    };

    useEffect(() => {
        if (token && !isVerifyingEmail) {
            handleVerifyUserEmail();
        }
    }, [token])

    return (
        <div className={styles.main}>
            <div className={`${styles.container} ${styles.verifyEmailContainer}`}>

                {
                    // If there is no token in the search params
                    !token &&
                    <div className={styles.content}>
                        <div className={styles.content__top}>
                            <h3>Verify your email</h3>
                            <br />
                            <br />
                            <br />
                            <p>
                                We have sent a verification link to your email address{retrieveNewlyCreatedUserEmail() && <>&nbsp;<strong>{retrieveNewlyCreatedUserEmail()}</strong></>}.
                            </p>
                        </div>
                        <div className={styles.content__form}>
                            <button type="submit" onClick={openMailApp} disabled={isVerifyingEmail}>
                                Open email
                            </button>
                        </div>
                    </div>
                }
                {
                    // If there is a token in the search params, and the user's email isn't verified yet, and the email is being verified
                    token && !isEmailVerified && isVerifyingEmail &&
                    <div className={styles.verifyingContent}>
                        <h3>Verifying your email...</h3>
                        <div className={styles.loader}>
                            <ComponentLoader customLoaderColor="#111111" />
                        </div>
                        {verificationError && <span className={styles.errorMsg}>{verificationError}</span>}
                    </div>
                }
                {
                    // If there is a token in the search params, and the email has been verified successfully
                    token && isEmailVerified && !isVerifyingEmail &&
                    <div className={styles.verifiedContent}>
                        <h3>Email verified</h3>
                        <span>
                            <span className={styles.verifiedIcon}><VerifiedIcon /></span>
                        </span>
                        <p>
                            Your email has been verified successfully.
                            You can now login to your account.
                        </p>
                        <Link href={ApplicationRoutes.SignIn}>
                            Login
                        </Link>
                    </div>
                }
                {
                    // If there is a token in the search params, and the email verification failed
                    token && !isEmailVerified && !isVerifyingEmail &&
                    <div className={styles.verifiedContent}>
                        <h3>Failed to verify email</h3>
                        <p>
                            An error occurred while verifying your email.
                            Please click the button below to resend the verification email.
                        </p>
                        <button type="submit" onClick={() => handleResendVerificationLink()} disabled={isResendingEmail}>
                            Resend verification email
                        </button>
                    </div>
                }
            </div>
        </div>
    );
}

export default VerifyEmailPage;