"use client";

import { Dispatch, FunctionComponent, ReactElement, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import images from "../../../public/images";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { EventResponse } from "@/app/models/IEvents";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import HeroSearchSection from "./HeroSearchSection";
import { ImageWithPlaceholder } from "@/app/models/IImage";
import { useRive } from '@rive-app/react-canvas';
import { Icons } from "../ui/icons";
import moment from "moment";
import { ITrendingEventCategory } from "@/app/models/IEventCategory";
import { FlagOptions } from "@/app/enums/UserFlag";

interface HeroSectionProps {
    events: EventResponse[];
    isFetchingEvents: boolean;
    imageWithPlaceholder: ImageWithPlaceholder[];
    setEmailVerificationPromptIsVisible: Dispatch<SetStateAction<boolean>>
    trendingEventCategories: ITrendingEventCategory[] | undefined
    isEmailVerified: boolean | undefined
}

const HeroSection: FunctionComponent<HeroSectionProps> = ({
    events,
    isFetchingEvents,
    imageWithPlaceholder,
    setEmailVerificationPromptIsVisible,
    trendingEventCategories,
    isEmailVerified
}): ReactElement => {
    const { data: session } = useSession();
    const user = session?.user;

    const imageList = [
        {
            img: images.ImageBg1,
        },
        {
            img: images.ImageBg2,
        },
        {
            img: images.ImageBg4,
        },
        {
            img: images.ImageBg5,
        },
        {
            img: images.ImageBg6,
        }
    ];

    const [heroSectionImgIndex, setHeroSectionImgIndex] = useState(0);
    const nextHotEvent = events.find(e => moment(e.startDate).isAfter(moment()));

    const formattedDate = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const [countdown, setCountdown] = useState(formattedDate);

    const { rive, RiveComponent } = useRive({
        src: '/rive/btn_anim.riv',
        stateMachines: 'State Machine 1',
        autoplay: true,
    });
    // Assuming you have a boolean input called "hover"
    // const hoverInput = useStateMachineInput(rive, "State Machine 1", "Boolean 1");

    useEffect(() => {
        const intervalId = setInterval(() => {
            setHeroSectionImgIndex((prevIndex) =>
                prevIndex === imageList.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(intervalId);
    }, [imageList.length]);

    useEffect(() => {
        if (!nextHotEvent) return;

        const updateCountdown = () => {
            const start = moment();
            const end = moment(nextHotEvent.startDate);
            const duration = moment.duration(end.diff(start));

            // If the duration is less than or equal to 0 seconds, we don't need to update the countdown
            if (duration.asSeconds() <= 0) {
                return;
            }

            const days = Math.floor(duration.asDays());
            const hours = duration.hours();
            const minutes = duration.minutes();
            const seconds = duration.seconds();

            setCountdown({
                days, hours, minutes, seconds
            });
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [nextHotEvent]);

    return (
        <>
            <section className={"sectionPadding !pt-[6.5rem] !pb-[4.5rem] flex flex-col md:flex-row gap-8 bg-dark-grey items-center relative"}>
                <div className='absolute size-full top-0 left-0 [&_img]:object-cover after:absolute after:size-full after:top-0 after:left-0 after:bg-[linear-gradient(180deg,_rgba(27,27,27,0.4)_0%,_rgba(27,27,27,0.7)_100%)]'>
                    <Image
                        src={imageWithPlaceholder[heroSectionImgIndex].src}
                        alt='People in event'
                        fill
                        sizes='100vw'
                        priority
                        placeholder={"blur"}
                        blurDataURL={imageWithPlaceholder[heroSectionImgIndex].placeholder}
                    />
                </div>
                <div className='flex flex-col gap-5 !basis-1/2 !z-[2]'>
                    <div className='flex flex-col gap-2'>
                        <h2 className='font-Mona-Sans-Wide font-medium text-[35px] md:text-[64px] leading-[40px] md:leading-[68px] bg-clip-text text-transparent animate-gradient bg-[length:200%_200%] bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300'>
                            {/* <h2 className='font-Mona-Sans-Wide font-medium text-[35px] md:text-[64px] leading-[40px] md:leading-[68px] bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300'> */}
                            Find The Next Big <br />
                            Event To{" "}
                            <span className='relative bg-clip-text text-transparent bg-[linear-gradient(90deg,_rgba(253,253,255,100)_100%,_rgba(253,253,255,0)_100%)]'>
                                Attend
                            </span>
                        </h2>
                        <p className='text-sm md:text-base font-light max-w-[80%]'>
                            "From music festivals to sports games, find the perfect tickets
                            for your entertainment needs!"
                        </p>
                    </div>
                    <div className='flex items-center gap-3 [&_button]:secondaryButton'>
                        <Link href={`/events`}>
                            <button className='!border-[1.5px] !border-white !text-dark-grey font-medium !bg-white hover:opacity-60'>
                                Explore Events
                            </button>
                        </Link>
                        {/* <Link
                            href={`/events`}
                            onMouseEnter={() => hoverInput && (hoverInput.value = true)}
                            onMouseLeave={() => hoverInput && (hoverInput.value = false)}
                            className="w-48 h-32">
                            <RiveComponent className="w-48 h-32" />
                        </Link> */}

                        {!user && (
                            <Link href={ApplicationRoutes.SignIn}>
                                <button className='!border-[1.5px] !border-solid !border-white !text-white font-medium !bg-transparent hover:opacity-60'>
                                    Create Event
                                </button>
                            </Link>
                        )}
                        {user && !isEmailVerified && (
                            <button
                                className='border-[1.5px] border-white text-white font-medium bg-transparent hover:opacity-60'
                                onClick={() => setEmailVerificationPromptIsVisible(true)}
                            >
                                Create Event
                            </button>
                        )}
                        {user && isEmailVerified && (
                            <Link href={ApplicationRoutes.CreateEvent}>
                                <button className='border-[1.5px] border-white text-white font-medium bg-transparent hover:opacity-60'>
                                    Create Event
                                </button>
                            </Link>
                        )}
                    </div>
                    <div className="pt-6 flex flex-row flex-wrap items-center gap-3 md:gap-6">
                        <div className="flex items-center gap-1 md:gap-2">
                            <Icons.UserOutline className="h-5 w-5 opacity-65" stroke="white" />
                            <span className="text-sm font-light text-nowrap">100+ Users</span>
                        </div>
                        <div className="flex items-center gap-1 md:gap-2">
                            <Icons.Calender className="h-5 w-5 opacity-65" fill="white" />
                            <span className="text-sm font-light text-nowrap">50+ Events</span>
                        </div>
                        <div className="flex items-center gap-1 md:gap-2">
                            <Icons.TopRated className="h-5 w-5 opacity-65" stroke="white" />
                            <span className="text-sm font-light text-nowrap">Top Rated</span>
                        </div>
                    </div>
                </div>
                <div className='basis-full w-full mt-3 mb-0 mx-auto md:mx-0 md:basis-[35%] md:ml-auto z-[2]'>
                    <HeroSearchSection
                        isFetchingEvents={isFetchingEvents}
                        events={events}
                        trendingEventCategories={trendingEventCategories}
                    />
                </div>
                <div className='absolute size-full overflow-hidden top-0 left-0 opacity-10 mix-blend-hard-light [&_span]:absolute'>
                    <span className='bg-[#29c2ff] -top-1/2 left-[-40%] blur-[200px] w-[765px] h-[392px] moveFirstAnimation'></span>
                    <span className='moveSecondAnimation rounded-[765px] blur-[200px] bg-[#ffcc1c] -top-1/2 left-[80%] w-[765px] h-[392px]'></span>
                    <span className='moveThirdAnimation top-0 left-0 translate-x-1/2 translate-y-1/2 w-[700px] h-[350px] blur-[200px]'></span>
                    <span className='moveFourthAnimation rounded-[503px] bg-[#74ffd5] top-0 left-0 translate-x-[250%] translate-y-1/2 w-[503px] h-[258px]  blur-[250px]'></span>
                    <span></span>
                    <span></span>
                </div>
            </section>

            {
                nextHotEvent &&
                <section className="sectionPadding bg-gradient-to-b from-purple-900 to-purple-700 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Icons.Fire className="w-6 h-6" />
                            <span className="font-semibold font-Mona-Sans-Wide">Hot Event:</span>
                            <span>{nextHotEvent.title}</span>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <span className="text-sm font-light text-white/80">Starts in:</span>
                                <div className="flex items-center gap-6">
                                    {
                                        countdown.days >= 1 ?
                                            <div className="flex items-center gap-1">
                                                <div className="bg-black/20 rounded px-2 py-1">
                                                    <span className="font-mono font-bold">{countdown.days}</span>
                                                </div>
                                                <span className="text-xs">{countdown.days > 1 ? "days" : "day"}</span>
                                            </div> : <></>
                                    }
                                    {
                                        countdown.hours >= 1 ?
                                            <div className="flex items-center gap-1">
                                                <div className="bg-black/20 rounded px-2 py-1">
                                                    <span className="font-mono font-bold">{countdown.hours}</span>
                                                </div>
                                                <span className="text-xs">{countdown.hours > 1 ? "hrs" : "hr"}</span>
                                            </div> : <></>
                                    }
                                    {
                                        countdown.minutes >= 1 ?
                                            <div className="flex items-center gap-1">
                                                <div className="bg-black/20 rounded px-2 py-1">
                                                    <span className="font-mono font-bold">{countdown.minutes}</span>
                                                </div>
                                                <span className="text-xs">{countdown.minutes > 1 ? "mins" : "min"}</span>
                                            </div> : <></>
                                    }
                                    <div className="flex items-center gap-1">
                                        <div className="bg-black/20 rounded px-2 py-1">
                                            <span className="font-mono font-bold">{countdown.seconds}</span>
                                        </div>
                                        <span className="text-xs">{countdown.seconds > 1 ? "secs" : "sec"}</span>
                                    </div>
                                </div>
                            </div>

                            <Link href={`/event/${nextHotEvent.id}`} className="bg-black/30 tertiaryButton">
                                Get Tickets
                            </Link>
                        </div>
                    </div>
                </section>
            }
        </>
    );
};

export default HeroSection;
