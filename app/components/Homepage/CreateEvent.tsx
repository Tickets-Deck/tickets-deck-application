"use client"
import { FunctionComponent, ReactElement } from 'react';
import styles from '../../styles/Home.module.scss';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import useResponsiveness from '@/app/hooks/useResponsiveness';
import { ApplicationRoutes } from '@/app/constants/applicationRoutes';

interface CreateEventProps {

}

const CreateEvent: FunctionComponent<CreateEventProps> = (): ReactElement => {

    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof (isMobile) == "boolean" && isMobile;
    const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    const { data: session } = useSession();
    const user = session?.user;

    return (
        <section className={styles.createEventSection}>
            <div className={styles.createEventSection__lhs}>
                {/* <div className={styles.image}>
                    {onMobile ? <Image src={images.createImageMobile} alt='Create image' /> : <Image src={images.createImage} alt='Create image' />}
                </div> */}
                <h3>Create your own Event</h3>
                {/* <p>Lets help you manage your ticketing, while you make your events with us.</p> */}
                <p>Time to enjoy seamless ticketing, and event creation process.</p>
            </div>
            <div className={styles.createEventSection__rhs}>
                <Link href={user ? ApplicationRoutes.CreateEvent : ApplicationRoutes.SignIn}> 
                    <button>Create Events</button>
                </Link>
            </div>
        </section>
    );
}

export default CreateEvent;