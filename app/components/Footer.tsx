"use client"
import { FunctionComponent, MouseEvent, ReactElement, useContext, useEffect, useState } from 'react';
import styles from '../styles/Footer.module.scss';
import Link from 'next/link';
import images from '../../public/images';
import Image from 'next/image';
import { FacebookIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from './SVGs/SVGicons';
import { useCreateNewsletterSubscriber } from '../api/apiClient';
import { ToastContext } from '../extensions/toast';
import { emailRegex } from '../constants/emailRegex';
import ComponentLoader from './Loader/ComponentLoader';
import SubscriptionFormSection from './Footer/SubscriptionFormSection';
import { useSession } from 'next-auth/react';

interface FooterProps {

}

const Footer: FunctionComponent<FooterProps> = (): ReactElement => {

    const { data: session } = useSession();
    const user = session?.user;

    return (
        <section className={styles.footerContainer}>
            <div className={styles.lhs}>
                <div className={styles.lhs__logoArea}>
                    <div className={styles.logoImage}>
                        <Image src={images.logoPurple} alt="logo" />
                    </div>
                    <p className={styles.name}>Ticketsdeck</p>
                </div>
                <div className={styles.lhs__info}>
                    <p>Ticket wave is a global self-service ticketing platform for live experiences that allows anyone to create, share, find and attend events in schools that fuel their passions and enrich their lives.</p>
                </div>
                <div className={styles.lhs__socials}>
                    <Link href='https://www.facebook.com/ticketsdeck0' target="_blank">
                        <span><FacebookIcon /></span>
                    </Link>
                    <Link href='https://twitter.com/theticketsdeck?t=iEC9AjmBaJxk7go7TEXgXQ&s=09' target="_blank">
                        <span><TwitterIcon /></span>
                    </Link>
                    <Link href='https://www.instagram.com/theticketsdeck/' target="_blank">
                        <span><InstagramIcon /></span>
                    </Link>
                    <Link href='https://www.linkedin.com/company/theticketsdeck/?viewAsMember=true' target="_blank">
                        <span><LinkedInIcon /></span>
                    </Link>
                </div>
            </div>
            <div className={styles.rhs}>
                <div className={`${styles.content} ${styles.content1}`}>
                    <h4>Plan Events</h4>
                    <div className={styles.content__links}>
                        <Link href={user ? "/app/event/create" : "/api/auth/signin"}>
                            <li>Create Events</li>
                        </Link>
                        <Link href="/events">
                            <li>Buy Tickets</li>
                        </Link>
                        {/* <li>Online Events</li> */}
                    </div>
                </div>
                <div className={`${styles.content} ${styles.content2}`}>
                    <h4>Company</h4>
                    <div className={styles.content__links}>
                        <li>About Us</li>
                        <li>Contact Us</li>
                        {/* <li>Help Center</li>
                    <li>Privacy</li>
                    <li>Terms</li>
                    <li>Blog</li> */}
                    </div>
                </div>
                <div className={`${styles.content} ${styles.content3}`}>
                    <h4>Stay Connected With Us</h4>
                    <p className={styles.joinText}>Join our mailing list to stay in the loop with our newest update on Events and concerts</p>
                    <SubscriptionFormSection />
                    {/* <div className={styles.content__languageArea}>
                        <h5>Language </h5>
                    </div> */}
                </div>
            </div>
        </section>
    );
}

export default Footer;