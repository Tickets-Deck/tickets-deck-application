"use client"
import { ReactElement, FunctionComponent, useState, useEffect, FormEvent } from "react";
import styles from "../../styles/AuthStyles.module.scss";
import Image from "next/image";
import images from "../../../public/images";
import { EmailIcon, EyeIcon, FacebookIcon, GoogleIcon, PasswordIcon, UserIcon } from "../SVGs/SVGicons";
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

interface LoginProps {

}

const Login: FunctionComponent<LoginProps> = (): ReactElement => {

    const fetchUserInformation = useFetchUserInformation();
    const dispatch = useDispatch();

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const router = useRouter();
    const { data: session, status } = useSession();

    const [email, setEmail] = useState(retrieveNewlyCreatedUserEmail() ?? '');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [emailErrorMsg, setEmailErrorMsg] = useState(false);
    const [passwordErrorMsg, setPasswordErrorMsg] = useState(false);

    const [message, setMessage] = useState('');

    function retrieveNewlyCreatedUserEmail() {
        const newlyCreatedUserEmail = sessionStorage.getItem(StorageKeys.NewlyCreatedUserEmail);

        if (newlyCreatedUserEmail && newlyCreatedUserEmail !== "" && newlyCreatedUserEmail !== null) {
            return newlyCreatedUserEmail;
        }
    };

    async function handleFetchUserInformation() {
        await fetchUserInformation(session?.user.id as string)
            .then((response) => {
                // Save to redux
                dispatch(updateUserCredentials(response.data));
            })
            .catch((error) => {
                // console.log(error);
                catchError(error);
            })
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

        // Prevent default form submission
        e.preventDefault();

        // Unset message
        setMessage('');

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
        }

        // console.log(userInformation);

        await signIn('credentials', { ...userInformation })
            .then(async (response) => {
                // console.log("login response: ", response);

                // If we have an error
                if (response?.error && !response.error.includes("prisma.users.findUnique" || "Authentication failed")) {
                    setMessage(response.error);
                    // Close loader
                    setIsLoading(false);
                    return;
                }

                if (response && response.status == StatusCodes.Unauthorized) {
                    // Close loader
                    setIsLoading(false);
                    setMessage("An error occurred while logging in. Please check your credentials and try again.");
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
            })
    }

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
        <div className={styles.main}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.content__top}>
                        <h3>Welcome</h3>
                        <p>Log into your account</p>
                    </div>
                    <div className={styles.content__loginOptions}>
                        <div className={styles.option} onClick={async () => await signIn('google')}>
                            <span>
                                <GoogleIcon />
                            </span>
                            <p>Google</p>
                        </div>
                        {/* <div className={styles.option}>
                            <span>
                                <FacebookIcon />
                            </span>
                            <p>Facebook</p>
                        </div> */}
                    </div>
                    <span>OR</span>
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
                                            setEmailErrorMsg(false);
                                            setMessage("");
                                        }
                                        setEmail(e.target.value);
                                    }}
                                />
                            </div>
                            {emailErrorMsg && <span className={styles.errorMsg}>Please enter your email address</span>}
                        </div>
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
                                            setMessage("");
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
                        {message && <span className={styles.errorMsg}>{message}</span>}
                        <button type="submit" disabled={isLoading}>
                            Log in
                            {isLoading && <ComponentLoader isSmallLoader customBackground="#fff" customLoaderColor="#111111" />}
                        </button>
                        <div className={styles.extraOptions}>
                            {/* <span>Forgot password?</span> */}
                            <span>Don't have an account? <Link href={ApplicationRoutes.SignUp}>Sign up</Link></span>
                        </div>
                    </form>
                </div>
                <div className={styles.imagesDisplay}>
                    <span>
                        <Image src={images.logoPurple} alt="Logo" />
                    </span>
                    <div className={styles.images}>
                        <div className={styles.column}>
                            <span><Image src={images.ImageBg6} alt="Event" fill /></span>
                            <span><Image src={images.ImageBg2} alt="Event" fill /></span>
                            <span><Image src={images.ImageBg3} alt="Event" fill /></span>
                            <span><Image src={images.ImageBg1} alt="Event" fill /></span>
                        </div>
                        <div className={styles.column}>
                            <span><Image src={images.ImageBg5} alt="Event" fill /></span>
                            <span><Image src={images.ImageBg4} alt="Event" fill /></span>
                            <span><Image src={images.ImageBg6} alt="Event" fill /></span>
                            <span><Image src={images.ImageBg3} alt="Event" fill /></span>
                        </div>
                        <div className={styles.column}>
                            <span><Image src={images.ImageBg1} alt="Event" fill /></span>
                            <span><Image src={images.ImageBg3} alt="Event" fill /></span>
                            <span><Image src={images.ImageBg5} alt="Event" fill /></span>
                            <span><Image src={images.ImageBg4} alt="Event" fill /></span>
                        </div>
                        <div className={styles.column}>
                            <span><Image src={images.ImageBg4} alt="Event" fill /></span>
                            <span><Image src={images.ImageBg4} alt="Event" fill /></span>
                            <span><Image src={images.ImageBg4} alt="Event" fill /></span>
                            <span><Image src={images.ImageBg4} alt="Event" fill /></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;