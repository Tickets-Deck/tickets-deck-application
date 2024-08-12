import { Dispatch, FunctionComponent, ReactElement, SetStateAction } from "react";
import ModalWrapper from "./ModalWrapper";
import styles from "@/app/styles/promptModal.module.scss";
import { CloseIcon } from "../SVGs/SVGicons";
import Link from "next/link";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";

interface BetaTestModalProps {
    visibility: boolean
    setVisibility: Dispatch<SetStateAction<boolean>>
    forGeneralMessage?: boolean
}

const BetaTestModal: FunctionComponent<BetaTestModalProps> = ({ visibility, setVisibility, forGeneralMessage }): ReactElement => {
    if (process.env.PUBLIC_NEXTAUTH_URL == "https://events.ticketsdeck.com") {
        return (
            <></>
        )
    }
    return (
        <ModalWrapper visibility={visibility} setVisibility={setVisibility} styles={{ backgroundColor: 'transparent', color: '#fff', width: "fit-content" }}>
            <div className={styles.promptModal}>
                <div className={styles.topAreaSection}>
                    <div className={styles.topArea}>
                        <h3>Hello there</h3>
                        {
                            forGeneralMessage ?
                                <div className={styles.content}>
                                    <p>
                                        We are glad to have you here. We are currently in beta testing phase.
                                    </p>
                                    <p>
                                        Note that events shown here are for testing purposes only.
                                    </p>
                                    <p>
                                        If you would like to report a bug or have any feedback,
                                        please <Link href={ApplicationRoutes.Contact}>contact us</Link>.
                                    </p>
                                </div> :
                                <div className={styles.content}>
                                    <p>
                                        We are currently in beta testing phase. Some features may not work as expected.
                                        We are working hard to make sure everything is perfect. Thank you for your patience.
                                    </p>
                                    <p>
                                        If you would like to report a bug or have any feedback, please click&nbsp;<Link href={ApplicationRoutes.Contact}>here</Link> to contact us.
                                    </p>
                                </div>
                        }
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