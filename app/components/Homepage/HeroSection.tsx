"use client";

import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import Image from "next/image";
import images from "../../../public/images";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { EventResponse } from "@/app/models/IEvents";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";
import EmailVerificationPrompt from "../Modal/EmailVerificationPrompt";
import HeroSearchSection from "./HeroSearchSection";
import { ImageWithPlaceholder } from "@/app/models/IImage";
import { Rive, useStateMachineInput } from '@rive-app/react-canvas';
import { useRive } from '@rive-app/react-canvas';

interface HeroSectionProps {
    events: EventResponse[];
    isFetchingEvents: boolean;

    imageWithPlaceholder: ImageWithPlaceholder[];
}

const HeroSection: FunctionComponent<HeroSectionProps> = ({
    events,
    isFetchingEvents,
    imageWithPlaceholder,
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

    const userInfo = useSelector(
        (state: RootState) => state.userCredentials.userInfo
    );

    const [heroSectionImgIndex, setHeroSectionImgIndex] = useState(0);
    const [emailVerificationPromptIsVisible, setEmailVerificationPromptIsVisible] = useState(false);

    const { rive, RiveComponent } = useRive({
        src: '/rive/btn_anim.riv',
        stateMachines: 'State Machine 1',
        autoplay: true,
    });
    // Assuming you have a boolean input called "hover"
    const hoverInput = useStateMachineInput(rive, "State Machine 1", "Boolean 1");

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

    return (
        <>
            <section className={"pt-[6.5rem] flex sectionPadding pb-[4.5rem] flex-col sm:flex-row sm:py-[4.5rem] gap-8 bg-dark-grey items-center relative"}>
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
                        <h2 className='font-Mona-Sans-Wide font-medium text-[35px] text-white'>
                            Find The Next Big <br />
                            Event To{" "}
                            <span className='relative bg-clip-text text-transparent bg-[linear-gradient(90deg,_rgba(253,253,255,100)_100%,_rgba(253,253,255,0)_100%)]'>
                                Attend
                            </span>
                        </h2>
                        <p className='text-sm font-light'>
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
                        {user && !userInfo?.emailVerified && (
                            <button
                                className='border-[1.5px] border-white text-white font-medium bg-transparent hover:opacity-60'
                                onClick={() => showEmailVerificationAlert()}
                            >
                                Create Event
                            </button>
                        )}
                        {user && userInfo?.emailVerified && (
                            <Link href={ApplicationRoutes.CreateEvent}>
                                <button className='border-[1.5px] border-white text-white font-medium bg-transparent hover:opacity-60'>
                                    Create Event
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
                <div className='basis-full w-full mt-3 mb-0 mx-auto sm:basis-[35%] sm:ml-auto z-[2]'>
                    <HeroSearchSection
                        isFetchingEvents={isFetchingEvents}
                        events={events}
                    />
                </div>
                <div className='absolute size-full overflow-hidden top-0 left-0 opacity-10 mix-blend-hard-light [&_span]:absolute'>
                    <span className='bg-[#ff2929] -top-1/2 left-[-40%] blur-[200px] w-[765px] h-[392px] moveFirstAnimation'></span>
                    <span className='moveSecondAnimation rounded-[765px] blur-[200px] bg-[#ffcc1c] -top-1/2 left-[80%] w-[765px] h-[392px]'></span>
                    <span className='moveThirdAnimation top-0 left-0 translate-x-1/2 translate-y-1/2 w-[700px] h-[350px] blur-[200px]'></span>
                    <span className='moveFourthAnimation rounded-[503px] bg-[#74ffd5] top-0 left-0 translate-x-[250%] translate-y-1/2 w-[503px] h-[258px]  blur-[250px]'></span>
                    <span></span>
                    <span></span>
                </div>
            </section>

            {emailVerificationPromptIsVisible && (
                <EmailVerificationPrompt
                    visibility={emailVerificationPromptIsVisible}
                    setVisibility={setEmailVerificationPromptIsVisible}
                    userEmail={userInfo?.email as string}
                    userName={userInfo?.firstName as string}
                />
            )}
        </>
    );
};

export default HeroSection;
