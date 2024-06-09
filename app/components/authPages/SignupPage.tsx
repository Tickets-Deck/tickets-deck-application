"use client"
import { ReactElement, FunctionComponent, useState, FormEvent, useContext, useEffect } from "react";
import styles from "../../styles/AuthStyles.module.scss";
import Image from "next/image";
import images from "../../../public/images";
import { EmailIcon, EyeIcon, GoogleIcon, PasswordIcon, UserIcon } from "../SVGs/SVGicons";
import Link from "next/link";
import { UserCredentialsRequest } from "../../models/IUser";
import { emailRegex } from "../../constants/emailRegex";
import { ToastContext } from "../../extensions/toast";
import ComponentLoader from "../Loader/ComponentLoader";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useCreateUser } from "@/app/api/apiClient";
import { toast } from "sonner";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";

interface SignupPageProps {

}

enum PasswordConfirmationStatus {
    Empty = 1,
    NoMatch = 2,
    Match = 3
}

enum EmailConfirmationStatus {
    Empty = 1,
    Invalid = 2,
    Valid = 3
}

const SignupPage: FunctionComponent<SignupPageProps> = (): ReactElement => {

    const router = useRouter();
    const createUser = useCreateUser();
    const { status } = useSession();

    const toastHandler = useContext(ToastContext);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState<string>();
    const [isCreatingUser, setIsCreatingUser] = useState(false);

    const [firstNameErrorMsg, setFirstNameErrorMsg] = useState<boolean>();
    const [lastNameErrorMsg, setLastNameErrorMsg] = useState<boolean>();
    const [emailErrorMsg, setEmailErrorMsg] = useState<{ value: string, status: EmailConfirmationStatus }>();
    const [passwordErrorMsg, setPasswordErrorMsg] = useState<boolean>();
    const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] = useState<{ value: string, status: PasswordConfirmationStatus }>();

    const [formValues, setFormValues] = useState<UserCredentialsRequest>();
    const [registrationError, setRegistrationError] = useState<string>();

    function onFormValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        // Desctructure the name and value from the event target
        const { name, value } = e.target;

        setFormValues({ ...formValues as UserCredentialsRequest, [name]: value });
    };

    function validateForm() {
        // Check if all fields are filled
        if (formValues?.firstName && formValues.lastName && (formValues.email && emailRegex.test(formValues.email.trim())) && formValues.password && (formValues.password === confirmPassword)) {
            // Close all error messages
            setFirstNameErrorMsg(false);
            setLastNameErrorMsg(false);
            setEmailErrorMsg({ value: '', status: EmailConfirmationStatus.Valid });
            setPasswordErrorMsg(false);
            setConfirmPasswordErrorMsg({ value: '', status: PasswordConfirmationStatus.Match });
            return true;
        }
        else {
            if (!formValues?.firstName) {
                setFirstNameErrorMsg(true);
            } else {
                setFirstNameErrorMsg(false);
            }

            if (!formValues?.lastName) {
                setLastNameErrorMsg(true);
            } else {
                setLastNameErrorMsg(false);
            }

            if (!formValues?.email) {
                setEmailErrorMsg({ value: 'Please enter your email address', status: EmailConfirmationStatus.Empty });
            } else {
                if (!emailRegex.test(formValues.email.trim())) {
                    setEmailErrorMsg({ value: 'Please enter a valid email address', status: EmailConfirmationStatus.Invalid });
                } else {
                    setEmailErrorMsg({ value: '', status: EmailConfirmationStatus.Valid });
                }
            }

            if (!formValues?.password) {
                setPasswordErrorMsg(true);
            } else {
                setPasswordErrorMsg(false);
            }

            if (!confirmPassword) {
                setConfirmPasswordErrorMsg({ value: 'Please confirm your password', status: PasswordConfirmationStatus.Empty });
            } else {
                if (formValues?.password !== confirmPassword) {
                    setConfirmPasswordErrorMsg({ value: 'Passwords do not match', status: PasswordConfirmationStatus.NoMatch });
                } else {
                    setConfirmPasswordErrorMsg({ value: '', status: PasswordConfirmationStatus.Match });
                }
            }

            return false;
        }
    };

    async function handleFormSubmission(e: FormEvent<HTMLFormElement>) {

        // Prevent default behaviour of the form
        e.preventDefault();

        // Validate form 

        // If validation fails, or returns false
        if (!validateForm() || !formValues) {
            // do nothing
            return;
        }

        // Start loading
        setIsCreatingUser(true);

        await createUser(formValues)
            .then(() => {
                // Display success message
                toastHandler?.logSuccess('Success', 'Account created successfully!');

                // Clear input fields
                setFormValues({} as UserCredentialsRequest);
                setConfirmPassword('');

                // Redirect to verification page
                router.push('/auth/verify');
                // router.push('/auth/signin');
            })
            .catch((error) => {
                console.log(error);
                // console.log(error.response.data);
                if (error.response && error.response.data.detail == "User with this email already exist.") {
                    console.log(error.response.data.detail);
                    setRegistrationError('User with this email already exists!');
                }
                // Display error message
                // toastHandler?.logError('Error', 'An error occurred while creating your account');
                toast.error("An error occurred while creating your account");

                // Stop loading
                setIsCreatingUser(false);
            })
    };

    useEffect(() => {
        if (registrationError) {
            setTimeout(() => {
                setRegistrationError(undefined);
            }, 3000);
        }
    }, [registrationError])

    useEffect(() => {
        if (status === "authenticated") {
            // Refresh the page so we get the new session state to the server side
            router.refresh();
            // // Push to homepage 
            router.push(ApplicationRoutes.Home);
        }
    }, [status]);

    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <form className={styles.content} onSubmit={(e) => handleFormSubmission(e)}>
                    <div className={styles.content__top}>
                        <h3>Create your account</h3>
                        {/* <p>Create your account</p> */}
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
                    <div className={styles.content__form}>
                        <div className={styles.rowFormFieldContainer}>
                            <div className={styles.formFieldContainer}>
                                <label htmlFor="firstName">First name</label>
                                <div className={styles.formField}>
                                    <span><UserIcon /></span>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First name"
                                        value={formValues?.firstName}
                                        onChange={(e) => onFormValueChange(e)}
                                    />
                                </div>
                                {firstNameErrorMsg && <span className={styles.errorMsg}>Please enter your first name</span>}
                            </div>
                            <div className={styles.formFieldContainer}>
                                <label htmlFor="lastName">Last name</label>
                                <div className={styles.formField}>
                                    <span><UserIcon /></span>
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last name"
                                        value={formValues?.lastName}
                                        onChange={(e) => onFormValueChange(e)}
                                    />
                                </div>
                                {lastNameErrorMsg && <span className={styles.errorMsg}>Please enter your last name</span>}
                            </div>
                        </div>
                        <div className={styles.formFieldContainer}>
                            <label htmlFor="email">Email address</label>
                            <div className={styles.formField}>
                                <span><EmailIcon /></span>
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="email@example.com"
                                    value={formValues?.email}
                                    onChange={(e) => onFormValueChange(e)}
                                />
                            </div>
                            {emailErrorMsg?.value && <span className={styles.errorMsg}>{emailErrorMsg.value}</span>}
                        </div>
                        <div className={styles.rowFormFieldContainer}>
                            <div className={styles.formFieldContainer}>
                                <label htmlFor="password">Password</label>
                                <div className={styles.formField}>
                                    <span><PasswordIcon /></span>
                                    <input
                                        type={isPasswordVisible ? "text" : "password"}
                                        name="password"
                                        placeholder="password"
                                        value={formValues?.password}
                                        onChange={(e) => onFormValueChange(e)}
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
                                <label htmlFor="password">Confirm Password</label>
                                <div className={styles.formField}>
                                    <span><PasswordIcon /></span>
                                    <input
                                        type={isPasswordVisible ? "text" : "password"}
                                        name="password"
                                        placeholder="password"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <span
                                        className={styles.clickable}
                                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                                        <EyeIcon clicked={!isPasswordVisible} />
                                    </span>
                                </div>
                                {confirmPasswordErrorMsg?.value && <span className={styles.errorMsg}>{confirmPasswordErrorMsg.value}</span>}
                            </div>
                        </div>
                        {registrationError && <span className={styles.errorMsg}>{registrationError}</span>}
                        <button type="submit" disabled={isCreatingUser}>
                            Sign up
                            {isCreatingUser && <ComponentLoader isSmallLoader customBackground="#fff" customLoaderColor="#111111" />}
                        </button>
                        <div className={styles.extraOptions}>
                            <span>Already have an account? <Link href={ApplicationRoutes.SignIn}>Login</Link></span>
                        </div>
                    </div>
                </form>
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

export default SignupPage;