"use client"
import { ReactElement, FunctionComponent, useState, FormEvent, useContext } from "react";
import styles from "../../styles/AuthStyles.module.scss";
import Image from "next/image";
import images from "../../../public/images";
import { EyeIcon, FacebookIcon, GoogleIcon, UserIcon } from "../SVGs/SVGicons";
import Link from "next/link";
import { UserCredentialsRequest } from "../models/IUser";
import { emailRegex } from "@/app/constants/emailRegex";
import { useCreateUser } from "@/app/api/apiClient";
import { ToastContext } from "@/app/extensions/toast";
import ComponentLoader from "../Loader/ComponentLoader";
import { useRouter } from "next/navigation";
import { signUp } from "@/app/actions/users/signUp";

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

        console.log("Form values", formValues); 

        await signUp(formValues?.email, formValues?.password, formValues?.firstName, formValues?.lastName)
            .then((response) => { 
                console.log(response);
                // Display success message
                toastHandler?.logSuccess('Success', 'You have successfully subscribed to our newsletter');
                // Clear input fields
                setFormValues({} as UserCredentialsRequest);
                setConfirmPassword('');

                // Redirect to login page
                router.push('/auth/signin');
            })
            .catch((error) => {
                console.log(error);
                // Display error message
                toastHandler?.logError('Error', 'An error occurred while creating your account');
            })
            .finally(() => {
                // Stop loading
                setIsCreatingUser(false);
            })
    }

    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <form className={styles.content} onSubmit={(e) => handleFormSubmission(e)}>
                    <div className={styles.content__top}>
                        <h3>Create your account</h3>
                        {/* <p>Create your account</p> */}
                    </div>
                    <div className={styles.content__loginOptions}>
                        <div className={styles.option}>
                            <span>
                                <GoogleIcon />
                            </span>
                            <p>Google</p>
                        </div>
                        <div className={styles.option}>
                            <span>
                                <FacebookIcon />
                            </span>
                            <p>Facebook</p>
                        </div>
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
                                <span><UserIcon /></span>
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
                                    <span><UserIcon /></span>
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
                                    <span><UserIcon /></span>
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
                        <button type="submit" disabled={isCreatingUser}>
                            Sign up
                            {isCreatingUser && <ComponentLoader isSmallLoader customBackground="#fff" customLoaderColor="#111111" />}
                        </button>
                        <div className={styles.extraOptions}>
                            <span>Already have an account? <Link href="/auth/signin">Login</Link></span>
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