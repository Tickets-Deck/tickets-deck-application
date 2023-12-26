import { ReactElement, FunctionComponent } from "react";
import styles from "../../styles/CreateEventProgressBar.module.scss"

interface CreateEventProgressBarProps {

}

const CreateEventProgressBar: FunctionComponent<CreateEventProgressBarProps> = (): ReactElement => {
    return (
        <div className={styles.progressBarContainer}>
            <span className={styles.indicator}></span>
            <div className={`${styles.stage} ${styles.currentStage}`}>
                <span className={styles.stageNumber}>1</span>
                <p className={styles.stageTitle}>Event Details</p>
            </div>
            <div className={`${styles.stage} ${styles.unDoneStage}`}>
                <span className={styles.stageNumber}>2</span>
                <p className={styles.stageTitle}>Image Upload</p>
            </div>
            <div className={styles.stage}>
                <span className={styles.stageNumber}>3</span>
                <p className={styles.stageTitle}>Ticket Details</p>
            </div>
            <div className={styles.stage}>
                <span className={styles.stageNumber}>4</span>
                <p className={styles.stageTitle}>Review & Publish</p>
            </div>
        </div>
    );
}

export default CreateEventProgressBar;