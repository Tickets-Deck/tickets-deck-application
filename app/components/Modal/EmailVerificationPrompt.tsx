import {
    Dispatch,
    FunctionComponent,
    ReactElement,
    SetStateAction,
    useState,
} from "react";
import ModalWrapper from "./ModalWrapper";
import { Icons } from "../ui/icons";
import { useResendVerificationLink } from "@/app/api/apiClient";
import { catchError } from "@/app/constants/catchError";
import ComponentLoader from "../Loader/ComponentLoader";
import { useToast } from "@/app/context/ToastCardContext";

interface EmailVerificationPromptProps {
    visibility: boolean;
    setVisibility: Dispatch<SetStateAction<boolean>>;
    userId: string;
    userName: string;
}

const EmailVerificationPrompt: FunctionComponent<
    EmailVerificationPromptProps
> = ({ visibility, setVisibility, userId, userName }): ReactElement => {

    const toastHandler = useToast();

    const resendVerificationLink = useResendVerificationLink();
    const [isResendingEmail, setIsResendingEmail] = useState(false);

    async function handleResendVerificationLink() {
        // Set the isResendingEmail state to true
        setIsResendingEmail(true);

        await resendVerificationLink(userId)
            .then((response) => {
                if (response.data.error) {
                    // Show error message
                    toastHandler.logError(
                        "Error requesting link",
                        "An error occurred while sending the verification link. Please try again."
                    );
                    return;
                }

                // Show success message
                toastHandler.logSuccess("Success", "Verification link has been sent successfully.");

                // Close the modal
                setVisibility(false);
            })
            .catch((error) => {
                console.log("🚀 ~ handleResendVerificationLink ~ error:", error);
                // Show error message
                toastHandler.logError(
                    "Error",
                    "An error occurred while sending the verification link. Please try again."
                );
                catchError(error);
            })
            .finally(() => {
                // Close the loader
                setIsResendingEmail(false);
            });
    }

    return (
        <ModalWrapper
            disallowOverlayFunction
            visibility={visibility}
            setVisibility={setVisibility}
            styles={{
                backgroundColor: "transparent",
                color: "#fff",
                width: "fit-content",
            }}
        >
            <div className=' w-full sm:w-[21.875rem] p-6 rounded-[20px] bg-container-grey bg-[linear-gradient(180deg,_#313131_0%,_#313131_100%)]'>
                <div className='flex items-start [justify-self:space-between]'>
                    <div className='flex flex-col items-start'>
                        <h3 className='text-base font-normal mb-1'>Hello {userName}</h3>
                        <p className='text-[0.8rem] font-light text-grey opacity-80 [text-decoration:none]'>
                            Please verify your email to proceed.
                        </p>
                    </div>
                    <span
                        className='ml-auto size-8 rounded-full grid place-items-center cursor-pointer hover:bg-white/10'
                        onClick={() => setVisibility(false)}
                    >
                        <Icons.Close className='*:stroke-white *:fill-white' />
                    </span>
                </div>
                <div className={"flex justify-end mt-4 gap-2"}>
                    <button
                        className='tertiaryButton py-2 px-4'
                        onClick={() => handleResendVerificationLink()}
                        disabled={isResendingEmail}
                    >
                        Get verification link
                        {isResendingEmail && (
                            <ComponentLoader
                                isSmallLoader
                                customBackground='#DC143C'
                                lightTheme
                                customLoaderColor='#fff'
                            />
                        )}
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default EmailVerificationPrompt;
