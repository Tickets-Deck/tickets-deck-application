"use client";
import {
    ReactElement,
    FunctionComponent,
    useState,
    useEffect,
    FormEvent,
} from "react";
import styles from "../../styles/AuthStyles.module.scss";
import Image from "next/image";
import images from "../../../public/images";
import {
    EmailIcon,
    EyeIcon,
    FacebookIcon,
    GoogleIcon,
    PasswordIcon,
    UserIcon,
} from "../SVGs/SVGicons";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { catchError } from "@/app/constants/catchError";
import { redirect, useRouter } from "next/navigation";
import ComponentLoader from "../Loader/ComponentLoader";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { StorageKeys } from "@/app/constants/storageKeys";
import { updateUserCredentials } from "@/app/redux/features/user/userSlice";
import { useFetchUserInformation } from "@/app/api/apiClient";
import { useDispatch } from "react-redux";
import ImagesDisplay from "./ImagesDisplay";

interface LoginProps { }

const Login: FunctionComponent<LoginProps> = (): ReactElement => {
    const fetchUserInformation = useFetchUserInformation();
    const dispatch = useDispatch();

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const router = useRouter();
    const { data: session, status } = useSession();

    const [email, setEmail] = useState(retrieveNewlyCreatedUserEmail() ?? "");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [emailErrorMsg, setEmailErrorMsg] = useState(false);
    const [passwordErrorMsg, setPasswordErrorMsg] = useState(false);

    const [message, setMessage] = useState("");

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

    async function handleFetchUserInformation() {
        await fetchUserInformation(session?.user.id as string)
            .then((response) => {
                // Save to redux
                dispatch(updateUserCredentials(response.data));
            })
            .catch((error) => {
                // console.log(error);
                catchError(error);
            });
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        // Prevent default form submission
        e.preventDefault();

        // Unset message
        setMessage("");

        if (!email || !password) {
            if (!email) {
                setEmailErrorMsg(true);
            } else {
                setEmailErrorMsg(false);
            }
            if (!password) {
                setPasswordErrorMsg(true);
            } else {
                setPasswordErrorMsg(false);
            }
            return;
        }
        setEmailErrorMsg(false);
        setPasswordErrorMsg(false);

        // Start loader
        setIsLoading(true);

        const userInformation = {
            email,
            password,
            redirect: false,
        };

        // console.log(userInformation);

        await signIn("credentials", { ...userInformation })
            .then(async (response) => {
                // console.log("login response: ", response);

                // If we have an error
                if (
                    response?.error
                ) {
                    setMessage(response.error);
                    // Close loader
                    setIsLoading(false);
                    return;
                }

                if (response && response.status == StatusCodes.Unauthorized) {
                    // Close loader
                    setIsLoading(false);
                    setMessage(
                        "An error occurred while logging in. Please check your credentials and try again."
                    );
                    return;
                }
                // console.log('Login successful');
            })
            .catch((error) => {
                // console.log("Error logging in: ", error);
                setMessage("An error occurred while logging in. Please try again.");
                catchError(error);
                // Close loader
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if (status === "authenticated") {
            // Refresh the page so we get the new session state to the server side
            router.refresh();
            // Fetch user information
            handleFetchUserInformation();
            // Clear newly created user email
            sessionStorage.removeItem(StorageKeys.NewlyCreatedUserEmail);
            // Push to homepage
            router.push(ApplicationRoutes.Home);
        }
    }, [status]);

    // useEffect(() => {
    //     if (retrieveNewlyCreatedUserEmail()) {
    //         setEmail(retrieveNewlyCreatedUserEmail() as string);
    //     }
    // }, [retrieveNewlyCreatedUserEmail()])

    return (
        <div className='max-[768px]:sectionPadding flex md:grid place-items-center py-[5rem] min-h-[90vh] bg-dark-grey'>
            <div className='bg-dark-grey-2 text-white rounded-[1.25rem] flex w-screen max-w-[500px] max-h-none md:mx-auto md:max-h-fit md:w-[70vw] xl:w-[35vw] h-fit overflow-hidden'>
                <div className='py-6 flex px-5 w-full flex-col gap-6'>
                    <div className='flex items-center flex-col gap-1 mb-2'>
                        <h3 className='font-semibold'>Welcome</h3>
                        <p className='text-center text-lg'>Log into your account</p>
                    </div>
                    <div className='flex gap-1'>
                        <div
                            className='w-full flex flex-col gap-1 items-center rounded-[1rem] p-2 cursor-pointer hover:bg-white/10'
                            onClick={async () => await signIn("google")}
                        >
                            <span className='size-[2.5rem] grid place-items-center [&_svg]:size-8'>
                                <GoogleIcon />
                            </span>
                            <p className='text-sm font-light'>Google</p>
                        </div>
                        {/* <div className={styles.option}>
                            <span>
                                <FacebookIcon />
                            </span>
                            <p>Facebook</p>
                        </div> */}
                    </div>
                    <span className='text-center text-sm relative block w-full after:w-[45%] after:h-[0.0313rem] after:bg-white/50 after:absolute after:top-[50%] after:left-auto after:right-0 after:translate-y-1/2 before:w-[45%] before:h-[0.0313rem] before:bg-white/50 before:absolute before:top-1/2 before:left-0 before:translate-y-1/2'>
                        OR
                    </span>
                    <form
                        className='flex flex-col gap-4 w-full min-w-[auto] md:min-w-[25rem]'
                        onSubmit={(e) => handleSubmit(e)}
                    >
                        <div className='flex flex-col gap-1'>
                            <label htmlFor='email' className='text-sm font-light'>
                                Email address
                            </label>
                            <div className='flex rounded-lg overflow-hidden'>
                                <span className='p-2 bg-white/10 grid place-items-center [&_svg]:size-[1.5rem]'>
                                    <EmailIcon />
                                </span>
                                <input
                                    type='email'
                                    name='email'
                                    placeholder='email@example.com'
                                    value={email}
                                    className='w-full outline-none border-none text-white bg-white/10 text-base'
                                    onChange={(e) => {
                                        // If we have a value, clear email error message
                                        if (e.target.value) {
                                            setEmailErrorMsg(false);
                                            setMessage("");
                                        }
                                        setEmail(e.target.value);
                                    }}
                                />
                            </div>
                            {emailErrorMsg && (
                                <span className='text-failed-color text-xs'>
                                    Please enter your email address
                                </span>
                            )}
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor='password' className='text-sm font-light'>
                                Password
                            </label>
                            <div className='flex rounded-lg overflow-hidden'>
                                <span className='p-2 bg-white/10 grid place-items-center [&_svg]:size-[1.5rem]'>
                                    <PasswordIcon />
                                </span>
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    name='password'
                                    placeholder='password'
                                    className='w-full outline-none border-none text-white bg-white/10 text-base'
                                    onChange={(e) => {
                                        // If we have a value, clear email error message
                                        if (e.target.value) {
                                            setPasswordErrorMsg(false);
                                            setMessage("");
                                        }
                                        setPassword(e.target.value);
                                    }}
                                />
                                <span
                                    className='p-2 bg-white/10 grid place-items-center [&_svg]:size-[1.5rem] cursor-pointer hover:text-white/20'
                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                >
                                    <EyeIcon clicked={!isPasswordVisible} />
                                </span>
                            </div>
                            {passwordErrorMsg && (
                                <span className='text-failed-color text-xs'>
                                    Please enter your password
                                </span>
                            )}
                        </div>
                        <Link
                            className='text-sm font-light w-fit text-primary-color-sub ml-auto'
                            href={ApplicationRoutes.ForgotPassword}
                        >
                            Forgot password?
                        </Link>
                        {message && (
                            <span className='text-failed-color text-xs'>{message}</span>
                        )}
                        <button
                            className='p-[0.65rem] rounded-lg mt-4 bg-white text-dark-grey text-center cursor-pointer border-none outline-none hover:opacity-80'
                            type='submit'
                            disabled={isLoading}
                        >
                            Log in
                            {isLoading && (
                                <ComponentLoader
                                    isSmallLoader
                                    customBackground='#fff'
                                    customLoaderColor='#111111'
                                />
                            )}
                        </button>
                        <div className='flex flex-col gap-2'>
                            {/* <span>Forgot password?</span> */}
                            <span className='text-sm font-light text-center'>
                                Don't have an account?{" "}
                                <Link
                                    className='text-primary-color-sub'
                                    href={ApplicationRoutes.SignUp}
                                >
                                    Sign up
                                </Link>
                            </span>
                        </div>
                    </form>
                </div>
                {/* <ImagesDisplay /> */}
            </div>
        </div>
    );
};

export default Login;
