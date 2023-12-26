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

interface FooterProps {

}

enum SubscriptionMsgStatus {
    Error = 1,
    Success = 2
}

const Footer: FunctionComponent<FooterProps> = (): ReactElement => {

    const createNewsletterSubscriber = useCreateNewsletterSubscriber();
    const toastHandler = useContext(ToastContext);

    const [loading, setLoading] = useState(false);
    const [emailMsg, setEmailMsg] = useState<{ value: string, status: SubscriptionMsgStatus | undefined }>();
    const [email, setEmail] = useState<string>();

    async function handleCreateNewsletterSubscriber(e: MouseEvent) {

        // Prevent default behaviour
        e.preventDefault();

        if (!email) {
            setEmailMsg({ value: 'Please input your email', status: SubscriptionMsgStatus.Error });
            return;
        }
        if (!emailRegex.test(email.trim())) {
            setEmailMsg({ value: 'Please input a valid email', status: SubscriptionMsgStatus.Error });
            return;
        }

        setLoading(true);

        await createNewsletterSubscriber(email.trim())
            .then((response) => {
                console.log(response);
                // Display success message
                toastHandler?.logSuccess('Success', 'You have successfully subscribed to our newsletter');
                setEmailMsg({ value: 'You have successfully subscribed to our newsletter', status: SubscriptionMsgStatus.Success });
                // Clear input field
                setEmail('');
            })
            .catch((error) => {
                console.log(error);
                switch (error.response.data.error) {
                    case "Email is not valid":
                        setEmailMsg({ value: 'Please input a valid email', status: SubscriptionMsgStatus.Error });
                        break;
                    case "Email already exists":
                        setEmailMsg({ value: 'Email already exists', status: SubscriptionMsgStatus.Error });
                        break;

                    default:
                        setEmailMsg({ value: "", status: undefined });
                        break;
                }
            })
            .finally(() => {
                setLoading(false);
            })
    };

    useEffect(() => {
        if (emailMsg?.value) {
            setTimeout(() => {
                setEmailMsg({ value: '', status: undefined });
            }, 5000);
        }
    }, [emailMsg]);

    return (
        <section className={styles.footerContainer}>
            <div className={styles.lhs}>
                <div className={styles.lhs__logoArea}>
                    <div className={styles.logoImage}>
                        <Image src={images.logoPurple} alt="logo" />
                    </div>
                    <p className={styles.name}>Ticketwave</p>
                </div>
                <div className={styles.lhs__info}>
                    <p>Ticket wave is a global self-service ticketing platform for live experiences that allows anyone to create, share, find and attend events in schools that fuel their passions and enrich their lives.</p>
                </div>
                <div className={styles.lhs__socials}>
                    <Link href='https://www.facebook.com/ticketwave0' target="_blank">
                        <span><FacebookIcon /></span>
                    </Link>
                    <Link href='https://twitter.com/theticketwave?t=iEC9AjmBaJxk7go7TEXgXQ&s=09' target="_blank">
                        <span><TwitterIcon /></span>
                    </Link>
                    <Link href='https://www.instagram.com/theticketwave/' target="_blank">
                        <span><InstagramIcon /></span>
                    </Link>
                    <Link href='https://www.linkedin.com/company/theticketwave/?viewAsMember=true' target="_blank">
                        <span><LinkedInIcon /></span>
                    </Link>
                </div>
            </div>
            <div className={styles.rhs}>
                <div className={`${styles.content} ${styles.content1}`}>
                    <h4>Plan Events</h4>
                    <div className={styles.content__links}>
                        <li>Create Events</li>
                        <li>Buy Tickets</li>
                        {/* <li>Online Events</li> */}
                    </div>
                </div>
                <div className={`${styles.content} ${styles.content2}`}>
                    <h4>Ticketwave</h4>
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
                    <form className={styles.content__subscribeArea} onSubmit={() => { }}>
                        <input type='text'
                            name='email'
                            placeholder="Enter your email address"
                            value={email}
                            onChange={e => {
                                setEmail(e.target.value)
                                setEmailMsg({ value: '', status: undefined });
                            }} />
                        <button
                            type='submit'
                            disabled={loading ? true : false}
                            style={loading ? { cursor: 'not-allowed' } : {}}
                            onClick={(e) => handleCreateNewsletterSubscriber(e)}>
                            Subscribe Now
                            {loading && <ComponentLoader lightTheme isSmallLoader customBackground="#8133F1" />}
                        </button>
                    </form>
                    {emailMsg && <span className={emailMsg.status === SubscriptionMsgStatus.Success ? styles.successMsg : styles.errorMsg}>{emailMsg.value}</span>}
                    {/* <div className={styles.content__languageArea}>
                        <h5>Language </h5>
                    </div> */}
                </div>
            </div>
        </section>
    );
}

export default Footer;