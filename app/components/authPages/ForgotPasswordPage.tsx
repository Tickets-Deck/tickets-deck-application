"use client"
import { FunctionComponent, ReactElement, useState } from "react";
import styles from "@/app/styles/AuthStyles.module.scss";
import Link from "next/link";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import ComponentLoader from "../Loader/ComponentLoader";
import { EmailIcon } from "../SVGs/SVGicons";
import PasswordResetLinkModal from "../Modal/PasswordResetLinkModal";
import { useRequestPasswordResetLink } from "@/app/api/apiClient";
import { toast } from "sonner";
import { emailRegex } from "@/app/constants/emailRegex";

interface ForgotPasswordPageProps {

}

const ForgotPasswordPage: FunctionComponent<ForgotPasswordPageProps> = (): ReactElement => {
    const requestPasswordResetLink = useRequestPasswordResetLink();

    const [emailErrorMsg, setEmailErrorMsg] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordResetModalVisible, setIsPasswordResetModalVisible] = useState(false);

    const hostUrl = window.origin;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        // Prevent default form submission
        e.preventDefault();

        // If email is empty, show error message
        if (!email) {
            setEmailErrorMsg("Please enter your email address");
            return;
        }
        if (emailRegex.test(email) === false) {
            setEmailErrorMsg("Please enter a valid email address");
            return;
        }

        // Show loader
        setIsLoading(true);

        await requestPasswordResetLink({ email })
            .then((response) => {
                if (response) {
                    // console.log("Reset Password Link: ", response.data);
                    setIsPasswordResetModalVisible(true);
                }
            })
            .catch((error) => {
                console.log("🚀 ~ handleSubmit ~ error:", error);

                if (error.response?.data.errorCode === "USER_1017") {
                    // This implies that the user signed up with Google
                    setEmailErrorMsg("It appears that you signed up with Google. Please sign in with Google.");
                    return;
                }

                if (error.response?.data.errorCode === "USER_1003") {
                    // This implies that the user with the email does not exist
                    setEmailErrorMsg("This email address does not exist. Please enter a valid email address.");
                    return;
                }

                setMessage(error.response?.data.message);
                toast.error("An error occurred. Please try again.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    return (
        <>
            <PasswordResetLinkModal
                visibility={isPasswordResetModalVisible}
                setVisibility={setIsPasswordResetModalVisible}
                moreInfo={
                    <>
                        <h4>Didn&apos;t get the email?</h4>
                        <p>If you don&apos;t see an email from us within 5 minutes, one of the things could have happened:</p>
                        <br />
                        <ul>
                            <li>The email is in your spam/junk folder. (If you use Gmail, please check your Promotions tab as well.)</li>
                            <li>You accidentally entered a different email address.</li>
                            <li>Confirm that <span>{email}</span> is spelt correctly and check your spam/junk folder.</li>
                        </ul>
                    </>
                }
            />

            <div className={styles.main}>
                <div className={styles.container}>
                    <div className={`${styles.content} ${styles.forgotPwdContent}`}>
                        <div className={styles.content__top}>
                            <h3>Forgot Password</h3>
                            <p>Enter your email address below and we&apos;ll send you a link to reset your password.</p>
                        </div>
                        <form className={styles.content__form} onSubmit={(e) => handleSubmit(e)}>
                            <div className={styles.formFieldContainer}>
                                <label htmlFor="email">Email address</label>
                                <div className={styles.formField}>
                                    <span><EmailIcon /></span>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="email@example.com"
                                        value={email}
                                        onChange={(e) => {
                                            // If we have a value, clear email error message
                                            if (e.target.value) {
                                                setEmailErrorMsg(null);
                                                setMessage("");
                                            }
                                            setEmail(e.target.value);
                                        }}
                                    />
                                </div>
                                {emailErrorMsg && <span className={styles.errorMsg}>{emailErrorMsg}</span>}
                            </div>
                            {message && <span className={styles.errorMsg}>{message}</span>}
                            <button type="submit" disabled={isLoading}>
                                Reset password
                                {isLoading && <ComponentLoader isSmallLoader customBackground="#fff" customLoaderColor="#111111" />}
                            </button>
                            <div className={styles.extraOptions}>
                                {/* <span>Forgot password?</span> */}
                                <span>Go back to <Link href={ApplicationRoutes.SignIn}>Login</Link></span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotPasswordPage;