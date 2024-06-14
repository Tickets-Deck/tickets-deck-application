import { Dispatch, FunctionComponent, ReactElement, SetStateAction } from "react";
import ModalWrapper from "./ModalWrapper";
import styles from "@/app/styles/promptModal.module.scss";
import { CloseIcon } from "../SVGs/SVGicons";

interface BetaTestModalProps {
    visibility: boolean
    setVisibility: Dispatch<SetStateAction<boolean>>
}

const BetaTestModal: FunctionComponent<BetaTestModalProps> = ({ visibility, setVisibility }): ReactElement => {
    return (
        <ModalWrapper visibility={visibility} setVisibility={setVisibility} styles={{ backgroundColor: 'transparent', color: '#fff', width: "fit-content" }}>
            <div className={styles.promptModal}>
                <div className={styles.topAreaSection}>
                    <div className={styles.topArea}>
                        <h3>Hello there</h3>
                        <p>
                            We are currently in beta testing phase. Some features may not work as expected.
                            We are working hard to make sure everything is perfect. Thank you for your patience.
                        </p>
                    </div>
                    <span className={styles.closeIcon} onClick={() => setVisibility(false)}><CloseIcon /></span>
                </div>
                <div className={styles.actionButton}>
                    <button onClick={() => setVisibility(false)}>
                        Okay, Got it.
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
}

export default BetaTestModal;