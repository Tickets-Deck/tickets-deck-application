import { ReactElement, FunctionComponent } from "react";
import Image, { StaticImageData } from "next/image";
import styles from "@/app/styles/components/PageHeroSection.module.scss";
import images from "@/public/images";

interface PageHeroSectionProps {
    imageUrl?: string | StaticImageData;
    videoUrl?: string;
    title: string | JSX.Element;
    description: string | JSX.Element;
}

const PageHeroSection: FunctionComponent<PageHeroSectionProps> = ({ imageUrl, videoUrl, title, description }): ReactElement => {
    return (
        <section className={styles.pageHeroSection}>
            {
                imageUrl && 
                <div className={styles.image}><Image src={imageUrl} alt="About" sizes="auto" fill /></div>
            }
            {
                videoUrl &&
                <div className={styles.video}>
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        src={videoUrl}
                    />
                </div>
            }
            <div className={styles.textContents}>
                {
                    typeof title === "string" ? <h1>{title}</h1> : title
                }
                {
                    typeof description === "string" ? <p>{description}</p> : description
                }
            </div>
        </section>
    );
}

export default PageHeroSection;