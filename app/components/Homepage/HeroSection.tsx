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

interface HeroSectionProps {
    events: EventResponse[]
    isFetchingEvents: boolean
}

const HeroSection: FunctionComponent<HeroSectionProps> = ({ events, isFetchingEvents }): ReactElement => {

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
    ]

    const [heroSectionImgIndex, setHeroSectionImgIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setHeroSectionImgIndex((prevIndex) =>
                prevIndex === imageList.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(intervalId);
    }, [imageList.length]);

    return (
        <section className={styles.heroSection}>
            <div className={styles.backgroundImage}>
                <Image src={imageList[heroSectionImgIndex].img} alt='People in event' fill />
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
                    <Link href={user ? "/app/event/create" : "/api/auth/signin"}>
                        <button className={styles.secondaryButton}>Create Event</button>
                    </Link>
                </div>
            </div>
            <div className={styles.heroSection__rhs}>
                <HeroSearchSection
                    isFetchingEvents={isFetchingEvents}
                    events={events}
                />
            </div>
            {/* <div className={styles.colors}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div> */}
        </section>
    );
}

export default HeroSection;
