"use client";
import { FunctionComponent, ReactElement, useContext, useState } from "react";
import { Icons } from "../ui/icons";
import ComponentLoader from "../Loader/ComponentLoader";
import {
    PasswordResetRequest,
} from "@/app/models/IPassword";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPassword } from "@/app/api/apiClient";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { ToastContext, useToast } from "@/app/context/ToastCardContext";

interface ResetPasswordPageProps { }

enum MessageStatus {
    Success = "success",
    Error = "error",
}

const ResetPasswordPage: FunctionComponent<
    ResetPasswordPageProps
> = (): ReactElement => {
    const resetPassword = useResetPassword();
    const { push } = useRouter();
    const toast = useToast();

    // Get the url query params
    const searchParams = useSearchParams();
    // Get the token from the search params
    const token = searchParams.get("token");
    const userId = searchParams.get("userId");

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [passwordErrorMsg, setPasswordErrorMsg] = useState(false);
    const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] = useState<
        string | null
    >(null);
    const [[message, status], setMessage] = useState<
        [string, MessageStatus | null]
    >(["", MessageStatus.Error]);
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
            password,
            userId: userId as string,
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
                    toast.logSuccess(
                        "Password reset successful",
                        "We are redirecting you to the login page"
                    );

                    // Redirect to login page
                    push(ApplicationRoutes.SignIn);
                }
            })
            .catch((error) => {
                // If the error code is PASSWORD_1004 or USER_1002, it implies that the password reset link has expired or the token is invalid
                if (error.response?.data.errorCode === "PASSWORD_1004" || "USER_1002") {
                    setMessage([
                        "This password reset link has either expired or is invalid. Please request a new password reset link.",
                        MessageStatus.Error,
                    ]);
                    return;
                }
                // If the error code is PASSWORD_1005, it implies that the new password is the same as the old password
                if (error.response?.data.errorCode === "PASSWORD_1005") {
                    setMessage([
                        "This password seems to be the same as your old password. Please enter a new password.",
                        MessageStatus.Error,
                    ]);
                    return;
                }

                setMessage([
                    "An error occurred while resetting your password.",
                    MessageStatus.Error,
                ]);

                // Hide loader
                setIsLoading(false);
            })
    }

    return (
        <div className='max-[768px]:sectionPadding flex md:grid place-items-center py-[5rem] min-h-[90vh] bg-dark-grey'>
            <div className='bg-dark-grey-2 text-white rounded-[1.25rem] flex w-screen max-w-[500px] max-h-none md:mx-auto md:max-h-fit md:w-[70vw] xl:w-[35vw] h-fit overflow-hidden'>
                <div className='py-6 flex px-5 w-full flex-col gap-6 basis-full'>
                    <div className='flex items-center flex-col gap-1 mb-2'>
                        <h3 className='font-semibold'>Reset Password</h3>
                        <p className='text-center text-lg'>
                            You can now reset your password.
                        </p>
                    </div>
                    <form
                        className='flex flex-col gap-4 w-full min-w-[auto] md:min-w-[25rem]'
                        onSubmit={(e) => handleSubmit(e)}
                    >
                        <div className='flex flex-col gap-1'>
                            <label htmlFor='password' className='text-sm font-light'>
                                Password
                            </label>
                            <div className='flex rounded-lg overflow-hidden'>
                                <span className='p-2 bg-white/10 grid place-items-center [&_svg]:size-[1.5rem]'>
                                    <Icons.Password />
                                </span>
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    name='password'
                                    className='w-full outline-none border-none text-white bg-white/10 text-base'
                                    placeholder='password'
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
                                    className='p-2 bg-white/10 grid place-items-center [&_svg]:size-[1.5rem] cursor-pointer hover:text-white/20'
                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                >
                                    <Icons.Eye clicked={!isPasswordVisible} />
                                </span>
                            </div>
                            {passwordErrorMsg && (
                                <span className='text-failed-color text-xs'>
                                    Please enter your password
                                </span>
                            )}
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label
                                className='text-sm font-light'
                                htmlFor='password_confirmation'
                            >
                                Confirm Password
                            </label>
                            <div className='flex rounded-lg overflow-hidden'>
                                <span className='p-2 bg-white/10 grid place-items-center [&_svg]:size-[1.5rem]'>
                                    <Icons.Password />
                                </span>
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    className='w-full outline-none border-none text-white bg-white/10 text-base'
                                    name='password_confirmation'
                                    placeholder='Confirm password'
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
                                    className='p-2 bg-white/10 grid place-items-center [&_svg]:size-[1.5rem] cursor-pointer hover:text-white/20'
                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                >
                                    <Icons.Eye clicked={!isPasswordVisible} />
                                </span>
                            </div>
                            {confirmPasswordErrorMsg && (
                                <span className='text-failed-color text-xs'>
                                    {confirmPasswordErrorMsg}
                                </span>
                            )}
                        </div>
                        {message && (
                            <span
                                className={
                                    status == MessageStatus.Success
                                        ? "text-xs text-success-color"
                                        : status == MessageStatus.Error
                                            ? "text-failed-color text-xs"
                                            : ""
                                }
                            >
                                {message}
                            </span>
                        )}
                        <button
                            className='p-[0.65rem] rounded-lg mt-4 bg-white text-dark-grey text-center cursor-pointer border-none outline-none hover:opacity-80'
                            type='submit'
                            disabled={isLoading}
                        >
                            Reset password
                            {isLoading && (
                                <ComponentLoader
                                    isSmallLoader
                                    customBackground='#fff'
                                    customLoaderColor='#111111'
                                />
                            )}
                        </button>
                    </form>
                </div>
                {/* <ImagesDisplay /> */}
            </div>
        </div>
    );
};

export default ResetPasswordPage;
