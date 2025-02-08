"use client";
import {
  ReactElement,
  FunctionComponent,
  useState,
  FormEvent,
  useContext,
  useEffect,
} from "react";
import styles from "../../styles/AuthStyles.module.scss";
import Image from "next/image";
import images from "../../../public/images";
import {
  EmailIcon,
  EyeIcon,
  GoogleIcon,
  PasswordIcon,
  UserIcon,
} from "../SVGs/SVGicons";
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
import ImagesDisplay from "./ImagesDisplay";

interface SignupPageProps {}

enum PasswordConfirmationStatus {
  Empty = 1,
  NoMatch = 2,
  Match = 3,
}

enum EmailConfirmationStatus {
  Empty = 1,
  Invalid = 2,
  Valid = 3,
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
  const [emailErrorMsg, setEmailErrorMsg] = useState<{
    value: string;
    status: EmailConfirmationStatus;
  }>();
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<boolean>();
  const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] = useState<{
    value: string;
    status: PasswordConfirmationStatus;
  }>();

  const [formValues, setFormValues] = useState<UserCredentialsRequest>();
  const [registrationError, setRegistrationError] = useState<string>();

  function onFormValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Desctructure the name and value from the event target
    const { name, value } = e.target;

    setFormValues({ ...(formValues as UserCredentialsRequest), [name]: value });
  }

  function validateForm() {
    // Check if all fields are filled
    if (
      formValues?.firstName &&
      formValues.lastName &&
      formValues.email &&
      emailRegex.test(formValues.email.trim()) &&
      formValues.password &&
      formValues.password === confirmPassword
    ) {
      // Close all error messages
      setFirstNameErrorMsg(false);
      setLastNameErrorMsg(false);
      setEmailErrorMsg({ value: "", status: EmailConfirmationStatus.Valid });
      setPasswordErrorMsg(false);
      setConfirmPasswordErrorMsg({
        value: "",
        status: PasswordConfirmationStatus.Match,
      });
      return true;
    } else {
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
        setEmailErrorMsg({
          value: "Please enter your email address",
          status: EmailConfirmationStatus.Empty,
        });
      } else {
        if (!emailRegex.test(formValues.email.trim())) {
          setEmailErrorMsg({
            value: "Please enter a valid email address",
            status: EmailConfirmationStatus.Invalid,
          });
        } else {
          setEmailErrorMsg({
            value: "",
            status: EmailConfirmationStatus.Valid,
          });
        }
      }

      if (!formValues?.password) {
        setPasswordErrorMsg(true);
      } else {
        setPasswordErrorMsg(false);
      }

      if (!confirmPassword) {
        setConfirmPasswordErrorMsg({
          value: "Please confirm your password",
          status: PasswordConfirmationStatus.Empty,
        });
      } else {
        if (formValues?.password !== confirmPassword) {
          setConfirmPasswordErrorMsg({
            value: "Passwords do not match",
            status: PasswordConfirmationStatus.NoMatch,
          });
        } else {
          setConfirmPasswordErrorMsg({
            value: "",
            status: PasswordConfirmationStatus.Match,
          });
        }
      }

      return false;
    }
  }

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
        toastHandler?.logSuccess("Success", "Account created successfully!");

        // Clear input fields
        setFormValues({} as UserCredentialsRequest);
        setConfirmPassword("");

        // Redirect to verification page
        router.push("/auth/verify");
        // router.push('/auth/signin');
      })
      .catch((error) => {
        console.log(error);
        // console.log(error.response.data);
        if (
          error.response &&
          error.response.data.detail == "User with this email already exist."
        ) {
          console.log(error.response.data.detail);
          setRegistrationError("User with this email already exists!");
        }
        // Display error message
        // toastHandler?.logError('Error', 'An error occurred while creating your account');
        toast.error("An error occurred while creating your account");

        // Stop loading
        setIsCreatingUser(false);
      });
  }

  useEffect(() => {
    if (registrationError) {
      setTimeout(() => {
        setRegistrationError(undefined);
      }, 3000);
    }
  }, [registrationError]);

  useEffect(() => {
    if (status === "authenticated") {
      // Refresh the page so we get the new session state to the server side
      router.refresh();
      // // Push to homepage
      router.push(ApplicationRoutes.Home);
    }
  }, [status]);

  return (
    <div className='max-[768px]:sectionPadding flex md:grid place-items-center py-[5rem] min-h-[90vh] bg-dark-grey'>
      <div className='bg-dark-grey-2 text-white rounded-[1.25rem] flex w-screen max-w-[500px] max-h-none md:mx-auto md:max-h-fit md:w-[70vw] xl:w-[35vw] h-fit overflow-hidden'>
        <form
          className='py-6 flex px-5 w-full flex-col gap-6'
          onSubmit={(e) => handleFormSubmission(e)}
        >
          <div className='flex items-center flex-col gap-1 mb-2'>
            <h3 className='font-semibold'>Create your account</h3>
            {/* <p>Create your account</p> */}
          </div>
          <div className='flex gap-1'>
            <div
              className='w-full flex flex-col items-center gap-1 rounded-2xl p-2 cursor-pointer hover:bg-white/10'
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
          <div className='flex flex-col gap-4 w-full min-w-[auto] md:min-w-[25rem]'>
            <div className='flex gap-4 flex-col md:flex-row md:gap-2'>
              <div className='flex flex-col gap-1'>
                <label htmlFor='firstName' className='text-sm font-light'>
                  First name
                </label>
                <div className='flex rounded-lg overflow-hidden'>
                  <span className='p-2 bg-white/10 grid place-items-center [&_svg]:size-[1.5rem]'>
                    <UserIcon />
                  </span>
                  <input
                    type='text'
                    className='w-full outline-none border-none text-white bg-white/10 text-base'
                    name='firstName'
                    placeholder='First name'
                    value={formValues?.firstName}
                    onChange={(e) => onFormValueChange(e)}
                  />
                </div>
                {firstNameErrorMsg && (
                  <span className='text-failed-color text-xs'>
                    Please enter your first name
                  </span>
                )}
              </div>
              <div className='flex flex-col gap-1'>
                <label htmlFor='lastName' className='text-sm font-light'>
                  Last name
                </label>
                <div className='flex rounded-lg overflow-hidden'>
                  <span className='p-2 bg-white/10 grid place-items-center [&_svg]:size-[1.5rem]'>
                    <UserIcon />
                  </span>
                  <input
                    type='text'
                    name='lastName'
                    className='w-full outline-none border-none text-white bg-white/10 text-base'
                    placeholder='Last name'
                    value={formValues?.lastName}
                    onChange={(e) => onFormValueChange(e)}
                  />
                </div>
                {lastNameErrorMsg && (
                  <span className='text-failed-color text-xs'>
                    Please enter your last name
                  </span>
                )}
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor='email' className='text-sm font-light'>
                Email address
              </label>
              <div className='flex rounded-lg overflow-hidden'>
                <span className='p-2 bg-white/10 grid place-items-center [&_svg]:size-[1.5rem]'>
                  <EmailIcon />
                </span>
                <input
                  type='text'
                  className='w-full outline-none border-none text-white bg-white/10 text-base'
                  name='email'
                  placeholder='email@example.com'
                  value={formValues?.email}
                  onChange={(e) => onFormValueChange(e)}
                />
              </div>
              {emailErrorMsg?.value && (
                <span className='text-failed-color text-xs'>
                  {emailErrorMsg.value}
                </span>
              )}
            </div>
            <div className='flex gap-4 flex-col md:flex-row md:gap-2'>
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
                    className='w-full outline-none border-none text-white bg-white/10 text-base'
                    placeholder='password'
                    value={formValues?.password}
                    onChange={(e) => onFormValueChange(e)}
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
              <div className='flex flex-col gap-1'>
                <label htmlFor='password' className='text-sm font-light'>
                  Confirm Password
                </label>
                <div className='flex rounded-lg overflow-hidden'>
                  <span className='p-2 bg-white/10 grid place-items-center [&_svg]:size-[1.5rem]'>
                    <PasswordIcon />
                  </span>
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    className='w-full outline-none border-none text-white bg-white/10 text-base'
                    name='password'
                    placeholder='password'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span
                    className='p-2 bg-white/10 grid place-items-center [&_svg]:size-[1.5rem] cursor-pointer hover:text-white/20'
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    <EyeIcon clicked={!isPasswordVisible} />
                  </span>
                </div>
                {confirmPasswordErrorMsg?.value && (
                  <span className='text-failed-color text-xs'>
                    {confirmPasswordErrorMsg.value}
                  </span>
                )}
              </div>
            </div>
            {registrationError && (
              <span className='text-failed-color text-xs'>
                {registrationError}
              </span>
            )}
            <button
              type='submit'
              className='p-[0.65rem] rounded-lg mt-4 bg-white text-dark-grey text-center cursor-pointer border-none outline-none hover:opacity-80'
              disabled={isCreatingUser}
            >
              Sign up
              {isCreatingUser && (
                <ComponentLoader
                  isSmallLoader
                  customBackground='#fff'
                  customLoaderColor='#111111'
                />
              )}
            </button>
            <div className='flex flex-col gap-2'>
              <span className='text-sm font-light text-center'>
                Already have an account?{" "}
                <Link
                  className='text-primary-color-sub'
                  href={ApplicationRoutes.SignIn}
                >
                  Login
                </Link>
              </span>
            </div>
          </div>
        </form>
        {/* <ImagesDisplay /> */}
      </div>
    </div>
  );
};

export default SignupPage;
