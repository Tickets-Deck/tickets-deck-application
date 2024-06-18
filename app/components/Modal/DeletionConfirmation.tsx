import { FunctionComponent, ReactElement, Dispatch, SetStateAction } from "react";
import styles from "../../styles/DeletionConfirmation.module.scss";

import ModalWrapper from "./ModalWrapper";
import Image from "next/image";
import images from "@/public/images";
import { CloseIcon } from "../SVGs/SVGicons";
import ComponentLoader from "../Loader/ComponentLoader";

interface DeletionConfirmationModalProps {
    visibility: boolean
    setVisibility: Dispatch<SetStateAction<boolean>>
    deleteFunction: () => Promise<void>
    isLoading: boolean
    actionText?: string
}

const DeletionConfirmationModal: FunctionComponent<DeletionConfirmationModalProps> = (
    { visibility, setVisibility, deleteFunction, 
        isLoading, actionText }): ReactElement => {

    return (
        <ModalWrapper disallowOverlayFunction visibility={visibility} setVisibility={setVisibility} styles={{ backgroundColor: 'transparent', color: '#fff', width: "fit-content" }}>
            <div className={styles.deletionConfirmationModal}>
                <div className={styles.topAreaSection}>
                    <div className={styles.topArea}>
                        <h3>Are you sure?</h3>
                        <p>This action cannot be reversed.</p>
                    </div>
                    <span className={styles.closeIcon} onClick={() => setVisibility(false)}><CloseIcon /></span>
                </div>
                {/* <div className={styles.miniEventDetailsContainer}>
                    <div className={styles.miniEventDetails}>
                        <div className={styles.miniEventDetails__image}>
                            <Image src={images.event_flyer} alt='Event flyer' fill />
                        </div>
                        <div className={styles.miniEventDetails__text}>
                            <h4>Event title</h4>
                            <p>Event date</p>
                        </div>
                    </div>
                </div> */}
                <div className={styles.actionButton}>
                    <button onClick={() => setVisibility(false)}>Cancel</button>
                    <button onClick={() => deleteFunction()} disabled={isLoading}>
                        {actionText ?? "Delete"}
                        {isLoading && <ComponentLoader isSmallLoader customBackground="#DC143C" lightTheme customLoaderColor="#fff" />}
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
}

export default DeletionConfirmationModal;