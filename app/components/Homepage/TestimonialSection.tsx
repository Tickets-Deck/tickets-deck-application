import React from 'react'
import styles from '../../styles/Home.module.scss';
import { ProfileIcon, StarIcon } from '../SVGs/SVGicons';
import Image from 'next/image';
import images from '@/public/images';

type Props = {}

export default function TestimonialSection({ }: Props) {

    const testimonies = [
        {
            rating: 5,
            message: "Ticketsdeck Events  is a user friendly website that is easy to navigate. The interface is aesthetically pleasing too, not too much to do. I'm  glad I worked with you, and look forward to more future collaborations.",
            user: {
                name: "Esiso Oghenenyerhovwo",
                role: "Event Manager",
                avatar: images.user_avatar
            }
        },
        {
            rating: 5,
            message: `Ticketsdeck Events was a game changer for us this year, they made registration and collation of data seamless.Thank you! We will definitely refer you to other event conveners like us.`,
            user: {
                name: "VICTORFIT",
                role: "Co Convener  the fifo experience",
                avatar: images.user_avatar
            }
        },
        {
            rating: 5,
            message: "Partnering with Ticketsdeck Events for the Rave Island Pool Party was an incredible experience. Their professionalism and support made everything run smoothly. Thank you for helping us create unforgettable memories!",
            user: {
                name: "Party Enigma",
                role: "Rave Island Organizer",
                avatar: images.user_avatar
            }
        }
    ]

    return (
        <section className={`${styles.servicesSection}`}>
            <div className={styles.topArea}>
                <h2>Testimonial</h2>
                <p>Hear what our users have to say about our service. 🎉</p>
            </div>

            <div className='flex flex-col gap-4 my-10 md:flex-row'>
                {
                    testimonies.map((testimony, index) => (
                        <div key={index} className='flex flex-col gap-2 w-full p-5 bg-text-grey/40 rounded-2xl md:max-w-[33%]'>
                            <div className='mb-3 flex flex-row gap-1'>
                                {
                                    Array.from({ length: testimony.rating }).map((_, index) => (
                                        <StarIcon key={index} />
                                    ))
                                }
                            </div>
                            <p className='mb-2'>{testimony.message}</p>
                            <div className='flex flex-row items-center gap-2 mt-auto'>
                                <span className='w-10 h-10 rounded-full overflow-hidden'>
                                    <Image src={testimony.user.avatar} alt='User avatar' />
                                </span>
                                <div>
                                    <h4 className='font-medium'>{testimony.user.name}</h4>
                                    <p className='text-xs text-white/60'>{testimony.user.role}</p>
                                </div>
                            </div>
                        </div>
                    ))
                }
                {/* <div className='bg-dark-grey flex flex-col w-[30%]'>
                    <div>
                        star
                    </div>
                    <p>"This is the best service I have used so far. It has proven to be the best strategy!"</p>
                    <div className='flex flex-row items-center gap-2'>
                        <span className='w-10 h-10 rounded-full overflow-hidden'>
                            <Image src={images.user_avatar} alt='User avatar' />
                        </span>
                        <div>
                            <h4>Max Welker</h4>
                            <p>Event Organizer</p>
                        </div>
                    </div>
                </div> */}
            </div>
        </section>
    )
}