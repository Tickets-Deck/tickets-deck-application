import { Dispatch, FunctionComponent, ReactElement, SetStateAction, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import styles from "@/app/styles/EmailVerificationPrompt.module.scss";
import { CloseIcon } from "../SVGs/SVGicons";
import { useResendVerificationLink } from "@/app/api/apiClient";
import { catchError } from "@/app/constants/catchError";
import ComponentLoader from "../Loader/ComponentLoader";
import { toast } from "sonner";

interface EmailVerificationPromptProps {
    visibility: boolean
    setVisibility: Dispatch<SetStateAction<boolean>>
    userEmail: string
}

const EmailVerificationPrompt: FunctionComponent<EmailVerificationPromptProps> = ({ visibility, setVisibility, userEmail }): ReactElement => {

    const resendVerificationLink = useResendVerificationLink();
    const [isResendingEmail, setIsResendingEmail] = useState(false);

    async function handleResendVerificationLink() {

        // Set the isResendingEmail state to true
        setIsResendingEmail(true);

        await resendVerificationLink(userEmail)
            .then((response) => {
                console.log("Resend response: ", response);

                if (response.data.error) {
                    // Show error message
                    toast.error("An error occurred while sending the verification link. Please try again.");
                }
            })
            .catch((error) => {
                console.log("🚀 ~ handleResendVerificationLink ~ error:", error);
                // Show error message
                toast.error("An error occurred while sending the verification link. Please try again.");
                catchError(error);
            })
            .finally(() => {
                // Close the loader
                setIsResendingEmail(false);
            });
    };

    return (
        <ModalWrapper disallowOverlayFunction visibility={visibility} setVisibility={setVisibility} styles={{ backgroundColor: 'transparent', color: '#fff', width: "fit-content" }}>
            <div className={styles.emailVerificationPromptModal}>
                <div className={styles.topAreaSection}>
                    <div className={styles.topArea}>
                        <h3>Hello Simlex</h3>
                        <p>Please verify your email to proceed.</p>
                    </div>
                    <span className={styles.closeIcon} onClick={() => setVisibility(false)}><CloseIcon /></span>
                </div>
                <div className={styles.actionButton}>
                    <button onClick={() => handleResendVerificationLink()}>
                        Get verification link
                        {isResendingEmail && <ComponentLoader isSmallLoader customBackground="#DC143C" lightTheme customLoaderColor="#fff" />}
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
}

export default EmailVerificationPrompt;