import { Dispatch, FunctionComponent, ReactElement, SetStateAction } from "react";
import ModalWrapper from "./ModalWrapper";
import styles from "@/app/styles/promptModal.module.scss";
import { CloseIcon } from "../SVGs/SVGicons";
import Link from "next/link";

interface PasswordResetLinkModalProps {
    visibility: boolean
    setVisibility: Dispatch<SetStateAction<boolean>>
    moreInfo?: JSX.Element
}

const PasswordResetLinkModal: FunctionComponent<PasswordResetLinkModalProps> = ({ visibility, setVisibility, moreInfo }): ReactElement => {
    return (
        <ModalWrapper disallowOverlayFunction visibility={visibility} setVisibility={setVisibility} styles={{ backgroundColor: 'transparent', color: '#fff', width: "fit-content" }}>
            <div className={styles.promptModal}>
                <div className={styles.topAreaSection}>
                    <div className={styles.topArea}>
                        <h3>Check your mailbox</h3>
                        <p>We&apos;ve sent you an email with instructions to reset your password.</p>
                    </div>
                    <span className={styles.closeIcon} onClick={() => setVisibility(false)}><CloseIcon /></span>
                </div>
                {
                    moreInfo &&
                    <div className={styles.content}>
                        {moreInfo}
                    </div>
                }
                <div className={styles.actionButton}>
                    <Link href="mailto:" onClick={() => setVisibility(false)}>
                        Open email
                    </Link>
                </div>
            </div>
        </ModalWrapper>
    );
}

export default PasswordResetLinkModal;