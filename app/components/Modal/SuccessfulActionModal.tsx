import { Dispatch, FunctionComponent, ReactElement, SetStateAction } from "react";
import ModalWrapper from "./ModalWrapper";
import styles from "@/app/styles/promptModal.module.scss";

interface SuccessfulActionModalProps {
    visibility: boolean
    setVisibility: Dispatch<SetStateAction<boolean>>
}

const SuccessfulActionModal: FunctionComponent<SuccessfulActionModalProps> = ({ visibility, setVisibility }): ReactElement => {
    return (
        <ModalWrapper visibility={visibility} setVisibility={setVisibility} styles={{ backgroundColor: 'transparent', color: '#fff', width: "fit-content" }}>
            <>&nbsp;</>
            {/* <div className={styles.promptModal}>
                <div className={styles.topAreaSection}>
                    <div className={styles.topArea}>
                        <h3>Hello there</h3>
                        <p>You would need to login to perform this action</p>
                    </div>
                    <span className={styles.closeIcon} onClick={() => setVisibility(false)}><CloseIcon /></span>
                </div>
                <div className={styles.actionButton}>
                    <Link href={ApplicationRoutes.SignIn} onClick={() => setVisibility(false)}>
                        Login
                    </Link>
                </div>
            </div> */}
        </ModalWrapper>
    );
}

export default SuccessfulActionModal;