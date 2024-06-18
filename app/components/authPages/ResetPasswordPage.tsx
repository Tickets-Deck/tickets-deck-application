"use client"
import { FunctionComponent, ReactElement, useState } from "react";
import styles from "@/app/styles/AuthStyles.module.scss";
import { EyeIcon, PasswordIcon } from "../SVGs/SVGicons";
import ComponentLoader from "../Loader/ComponentLoader";
import { PasswordResetLinkRequest, PasswordResetRequest } from "@/app/models/IPassword";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPassword } from "@/app/api/apiClient";
import { toast } from "sonner";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";

interface ResetPasswordPageProps {

}

enum MessageStatus {
    Success = "success",
    Error = "error"
}

const ResetPasswordPage: FunctionComponent<ResetPasswordPageProps> = (): ReactElement => {

    const resetPassword = useResetPassword();
    const { push } = useRouter();

    // Get the url query params
    const searchParams = useSearchParams();
    // Get the token from the search params
    const token = searchParams.get("token");

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [passwordErrorMsg, setPasswordErrorMsg] = useState(false);
    const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] = useState<string | null>(null);
    const [[message, status], setMessage] = useState<[string, MessageStatus | null]>(["", MessageStatus.Error]);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function validatePassword() {

        if (!password) {
            setPasswordErrorMsg(true);
            return false;
        }
        setPasswordErrorMsg(false);

        if (!confirmPassword) {
            setConfirmPasswordErrorMsg("Please confirm your password");
            return false;
        }
        setPasswordErrorMsg(false);

        if (password !== confirmPassword) {
            setConfirmPasswordErrorMsg("Passwords do not match");
            return false;
        }
        setConfirmPasswordErrorMsg(null);

        return true;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        // Prevent default form submission
        e.preventDefault();

        // Validate password
        if (!validatePassword()) {
            return;
        }

        // Create request object
        const data: PasswordResetRequest = {
            token: token as string,
            newPassword: password
        };

        // Show loader
        setIsLoading(true);

        await resetPassword(data)
            .then((response) => {
                if (response) {
                    setMessage([response.data.message, MessageStatus.Success]);

                    // Clear form fields
                    setPassword("");
                    setConfirmPassword("");

                    // Display success message
                    toast.success("Password reset successful. You can now login with your new password.");

                    // Redirect to login page
                    push(ApplicationRoutes.SignIn);
                }
            })
            .catch((error) => {
                // If the error code is PASSWORD_1004 or USER_1002, it implies that the password reset link has expired or the token is invalid
                if (error.response?.data.errorCode === "PASSWORD_1004" || "USER_1002") {
                    setMessage(["This password reset link has either expired or is invalid. Please request a new password reset link.", MessageStatus.Error]);
                    return;
                }
                // If the error code is PASSWORD_1005, it implies that the new password is the same as the old password
                if (error.response?.data.errorCode === "PASSWORD_1005") {
                    setMessage(["This password seems to be the same as your old password. Please enter a new password.", MessageStatus.Error]);
                    return;
                }

                setMessage(["An error occurred while resetting your password.", MessageStatus.Error]);
            })
            .finally(() => {
                // Hide loader
                setIsLoading(false);
            });
    }

    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <div className={`${styles.content} ${styles.resetPwdContent}`}>
                    <div className={styles.content__top}>
                        <h3>Reset Password</h3>
                        <p>You can now reset your password.</p>
                    </div>
                    <form className={styles.content__form} onSubmit={(e) => handleSubmit(e)}>
                        <div className={styles.formFieldContainer}>
                            <label htmlFor="password">Password</label>
                            <div className={styles.formField}>
                                <span><PasswordIcon /></span>
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    name="password"
                                    placeholder="password"
                                    onChange={(e) => {
                                        // If we have a value, clear email error message
                                        if (e.target.value) {
                                            setPasswordErrorMsg(false);
                                            setMessage(["", null]);
                                        }
                                        setPassword(e.target.value);
                                    }}
                                />
                                <span
                                    className={styles.clickable}
                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                                    <EyeIcon clicked={!isPasswordVisible} />
                                </span>
                            </div>
                            {passwordErrorMsg && <span className={styles.errorMsg}>Please enter your password</span>}
                        </div>
                        <div className={styles.formFieldContainer}>
                            <label htmlFor="password_confirmation">Confirm Password</label>
                            <div className={styles.formField}>
                                <span><PasswordIcon /></span>
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                    onChange={(e) => {
                                        // If we have a value, clear email error message
                                        if (e.target.value) {
                                            setConfirmPasswordErrorMsg(null);
                                            setMessage(["", null]);
                                        }
                                        setConfirmPassword(e.target.value);
                                    }}
                                />
                                <span
                                    className={styles.clickable}
                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                                    <EyeIcon clicked={!isPasswordVisible} />
                                </span>
                            </div>
                            {confirmPasswordErrorMsg && <span className={styles.errorMsg}>{confirmPasswordErrorMsg}</span>}
                        </div>
                        {message && <span className={status == MessageStatus.Success ? styles.successMsg : MessageStatus.Error ? styles.errorMsg : ""}>{message}</span>}
                        <button type="submit" disabled={isLoading}>
                            Reset password
                            {isLoading && <ComponentLoader isSmallLoader customBackground="#fff" customLoaderColor="#111111" />}
                        </button>
                    </form>
                </div>
                {/* <ImagesDisplay /> */}
            </div>
        </div>
    );
}

export default ResetPasswordPage;