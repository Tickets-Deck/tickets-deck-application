"use client"

import { FunctionComponent, ReactElement, useEffect, useState } from 'react';
import styles from '../../styles/Home.module.scss';
import Image from 'next/image';
import images from '../../../public/images';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useResponsive from '../../hooks/useResponsiveness';
import HeroSearchSection from './HeroSearchSection';
import { useSession } from 'next-auth/react';
import { EventResponse } from '@/app/models/IEvents';
import { ApplicationRoutes } from '@/app/constants/applicationRoutes';
import { RootState } from '@/app/redux/store';
import { useSelector } from 'react-redux';
import { Theme } from '@/app/enums/Theme';
import EmailVerificationPrompt from '../Modal/EmailVerificationPrompt';
import { getPlaceholderImage } from '@/app/services/DynamicBlurDataUrl';

interface HeroSectionProps {
    events: EventResponse[]
    isFetchingEvents: boolean

    imageWithPlaceholder: {
        src: string;
        placeholder: string;
    }[]
}

const HeroSection: FunctionComponent<HeroSectionProps> = ({ events, isFetchingEvents, imageWithPlaceholder }): ReactElement => {
    const appTheme = useSelector((state: RootState) => state.theme.appTheme);

    const { data: session } = useSession();
    const user = session?.user;

    const imageList = [
        {
            img: images.ImageBg1,
        },
        {
            img: images.ImageBg2,
        },
        // {
        //     img: images.ImageBg3,
        // },
        {
            img: images.ImageBg4,
        },
        {
            img: images.ImageBg5,
        },
        {
            img: images.ImageBg6,
        },
        // {
        //     img: images.ImageBg7,
        // },
        // {
        //     img: images.ImageBg8,
        // },
    ];

    const userInfo = useSelector((state: RootState) => state.userCredentials.userInfo);
    const [heroSectionImgIndex, setHeroSectionImgIndex] = useState(0);
    const [emailVerificationPromptIsVisible, setEmailVerificationPromptIsVisible] = useState(false);

    function showEmailVerificationAlert() {

        // Check for the email verification status if the user is logged in.
        if (userInfo && !userInfo.emailVerified) {
            // toast.error("Please verify your email address to continue.");
            setEmailVerificationPromptIsVisible(true);
            return;
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setHeroSectionImgIndex((prevIndex) =>
                prevIndex === imageList.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(intervalId);
    }, [imageList.length]);

    // const imageWithPlaceholder = Promise.all(
    //     imageList.map(async (eachImage) => {
    //         const imageWithPlaceholder = await getPlaceholderImage(eachImage.img)
    //         return imageWithPlaceholder
    //     }),
    // )

    // const imageWithPlaceholder = await Promise.all(
    //     imageList.map(async (eachImage) => {
    //         const imageWithPlaceholder = await getPlaceholderImage(eachImage.img)
    //         return imageWithPlaceholder;
    //     }),
    // )

    return (
        <>
            <section className={appTheme == Theme.Light ? styles.heroSectionLightTheme : styles.heroSection}>
                <div className={styles.backgroundImage}>
                    <Image
                        src={imageWithPlaceholder[heroSectionImgIndex].src}
                        alt='People in event'
                        fill
                        priority
                        placeholder={"blur"}
                        blurDataURL={imageWithPlaceholder[heroSectionImgIndex].placeholder}
                    />
                </div>
                <div className={styles.heroSection__lhs}>
                    <div className={styles.textContents}>
                        <h2>Find The Next Big <br />Event To <span>Attend</span></h2>
                        <p>"From music festivals to sports games, find the perfect tickets for your entertainment needs!"</p>
                    </div>
                    <div className={styles.actionButtons}>
                        <Link href={`/events`}>
                            <button className={styles.primaryButton}>Explore Events</button>
                        </Link>
                        {
                            !user &&
                            <Link href={ApplicationRoutes.SignIn}>
                                <button className={styles.secondaryButton}>Create Event</button>
                            </Link>
                        }
                        {
                            user && !userInfo?.emailVerified &&
                            <button className={styles.secondaryButton} onClick={() => showEmailVerificationAlert()}>
                                Create Event
                            </button>
                        }
                        {
                            user && userInfo?.emailVerified &&
                            <Link href={ApplicationRoutes.CreateEvent}>
                                <button className={styles.secondaryButton}>Create Event</button>
                            </Link>
                        }
                    </div>
                </div>
                <div className={styles.heroSection__rhs}>
                    <HeroSearchSection
                        isFetchingEvents={isFetchingEvents}
                        events={events}
                    />
                </div>
                <div className={styles.colors}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </section>

            {
                emailVerificationPromptIsVisible &&
                <EmailVerificationPrompt
                    visibility={emailVerificationPromptIsVisible}
                    setVisibility={setEmailVerificationPromptIsVisible}
                    userEmail={userInfo?.email as string}
                    userName={userInfo?.firstName as string}
                />
            }
        </>
    );
}

export default HeroSection;
