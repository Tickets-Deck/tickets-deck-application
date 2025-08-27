"use client";
import { FunctionComponent, ReactElement, useState } from "react";
import Link from "next/link";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import ComponentLoader from "../Loader/ComponentLoader";
import { Icons } from "../ui/icons";
import PasswordResetLinkModal from "../Modal/PasswordResetLinkModal";
import { useRequestPasswordResetLink } from "@/app/api/apiClient";
import { emailRegex } from "@/app/constants/emailRegex";
import { useToast } from "@/app/context/ToastCardContext";

interface ForgotPasswordPageProps {}

const ForgotPasswordPage: FunctionComponent<
  ForgotPasswordPageProps
> = (): ReactElement => {
  const toastHandler = useToast();
  const requestPasswordResetLink = useRequestPasswordResetLink();

  const [emailErrorMsg, setEmailErrorMsg] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordResetModalVisible, setIsPasswordResetModalVisible] =
    useState(false);

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
          setIsPasswordResetModalVisible(true);
        }
      })
      .catch((error) => {
        if (error.response?.data.errorCode === "USER_1017") {
          // This implies that the user signed up with Google
          setEmailErrorMsg(
            "It appears that you signed up with Google. Please sign in with Google."
          );
          return;
        }

        if (error.response?.data.errorCode === "USER_1003") {
          // This implies that the user with the email does not exist
          setEmailErrorMsg(
            "This email address does not exist. Please enter a valid email address."
          );
          return;
        }

        setMessage(error.response?.data.message);
        toastHandler.logError("Error", "An error occurred. Please try again.");
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
            <p>
              If you don&apos;t see an email from us within 5 minutes, one of
              the things could have happened:
            </p>
            <br />
            <ul>
              <li>
                The email is in your spam/junk folder. (If you use Gmail, please
                check your Promotions tab as well.)
              </li>
              <li>You accidentally entered a different email address.</li>
              <li>
                Confirm that <span>{email}</span> is spelt correctly and check
                your spam/junk folder.
              </li>
            </ul>
          </>
        }
      />

      <div className='max-[768px]:sectionPadding flex md:grid place-items-center py-[5rem] min-h-[90vh] bg-dark-grey'>
        <div className='bg-dark-grey-2 text-white rounded-[1.25rem] flex w-screen max-w-[500px] max-h-none md:mx-auto md:max-h-fit md:w-[70vw] xl:w-[35vw] h-fit overflow-hidden'>
          <div className={`py-6 flex px-5 w-full flex-col gap-6 basis-full`}>
            <div className='flex items-center flex-col gap-1 mb-2'>
              <h3 className='font-semibold'>Forgot Password</h3>
              <p className='text-center text-lg'>
                Enter your email address below and we&apos;ll send you a link to
                reset your password.
              </p>
            </div>
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
                    <Icons.Email />
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
                        setEmailErrorMsg(null);
                        setMessage("");
                      }
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                {emailErrorMsg && (
                  <span className='text-failed-color text-xs'>
                    {emailErrorMsg}
                  </span>
                )}
              </div>
              {message && (
                <span className='text-failed-color text-xs'>{message}</span>
              )}
              <button
                type='submit'
                className='p-[0.65rem] rounded-lg mt-4 bg-white text-dark-grey text-center cursor-pointer border-none outline-none hover:opacity-80'
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
              <div className='flex flex-col gap-2'>
                {/* <span>Forgot password?</span> */}
                <span className='text-sm font-light text-center'>
                  Go back to{" "}
                  <Link
                    className='text-primary-color-sub'
                    href={ApplicationRoutes.SignIn}
                  >
                    Login
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
