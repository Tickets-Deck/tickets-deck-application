import Image from "next/image";
import { FunctionComponent, ReactElement } from "react";
import styles from "@/app/styles/AuthStyles.module.scss";
import images from "@/public/images";

interface ImagesDisplayProps {

}

const ImagesDisplay: FunctionComponent<ImagesDisplayProps> = (): ReactElement => {
    return (
        <div className={styles.imagesDisplay}>
            <span>
                <Image src={images.logoPurple} alt="Logo" />
            </span>
            <div className={styles.images}>
                <div className={styles.column}>
                    <span><Image src={images.ImageBg6} alt="Event" fill /></span>
                    <span><Image src={images.ImageBg2} alt="Event" fill /></span>
                    <span><Image src={images.ImageBg3} alt="Event" fill /></span>
                    <span><Image src={images.ImageBg1} alt="Event" fill /></span>
                </div>
                <div className={styles.column}>
                    <span><Image src={images.ImageBg5} alt="Event" fill /></span>
                    <span><Image src={images.ImageBg4} alt="Event" fill /></span>
                    <span><Image src={images.ImageBg6} alt="Event" fill /></span>
                    <span><Image src={images.ImageBg3} alt="Event" fill /></span>
                </div>
                <div className={styles.column}>
                    <span><Image src={images.ImageBg1} alt="Event" fill /></span>
                    <span><Image src={images.ImageBg3} alt="Event" fill /></span>
                    <span><Image src={images.ImageBg5} alt="Event" fill /></span>
                    <span><Image src={images.ImageBg4} alt="Event" fill /></span>
                </div>
                <div className={styles.column}>
                    <span><Image src={images.ImageBg4} alt="Event" fill /></span>
                    <span><Image src={images.ImageBg4} alt="Event" fill /></span>
                    <span><Image src={images.ImageBg4} alt="Event" fill /></span>
                    <span><Image src={images.ImageBg4} alt="Event" fill /></span>
                </div>
            </div>
        </div>
    );
}

export default ImagesDisplay;