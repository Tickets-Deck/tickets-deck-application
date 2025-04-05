import { FunctionComponent, ReactElement } from "react";

interface IntroSectionProps {
}

const IntroSection: FunctionComponent<IntroSectionProps> = (): ReactElement => {
    return (
        <section className={"sectionPadding md:!py-16 flex md:items-start md:flex-row justify-between bg-dark-grey text-white flex-col items-center gap-8 !py-[2.5rem]"}>
            <div className='flex w-full flex-col md:w-[45%]'>
                <span className='text-base font-normal text-primary-color-sub bg-primary-color-sub/30 w-fit px-4 py-2 rounded-[1.25rem] mb-4'>
                    Who We Are
                </span>
                <p className='text-sm leading-[30px] font-light text-white mb-6'>
                    At Ticketsdeck Events, we're not just redefining the event planning
                    and ticketing industry; we're revolutionizing it. Our cutting-edge
                    solutions are meticulously crafted to elevate every event, making each
                    moment memorable and impactful.
                </p>
                {/* Next-Level Innovation */}
                <p className='text-sm leading-[30px] font-light text-white'>
                    In the dynamic world of event management, innovation is key. That's
                    why at Ticketsdeck Events, we're committed to pushing the boundaries
                    of what’s possible. Our platform is a hub of next-level technology,
                    designed to streamline every aspect of the event planning process.
                    Whether you're an event organizer looking for comprehensive management
                    tools or an attendee seeking an intuitive booking experience,
                    Ticketsdeck Events delivers with precision and creativity.
                </p>
            </div>
            <div className='w-full md:w-1/2 overflow-hidden relative pointer-events-none rounded-[20px] h-[350px]'>
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className='w-full h-full object-cover scale-110'
                    src='https://res.cloudinary.com/dvxqk1487/video/upload/f_auto,q_auto/v1717209808/videos/crowd_video_yrahfy.mp4'
                />
                <div className='size-full absolute top-0 left-0 grid place-items-center bg-white/10'>
                    {/* <Image src={images.logoWhite} alt="Logo" sizes="auto" fill /> */}
                    <svg
                        width='15'
                        height='14'
                        className='size-[200px] opacity-5'
                        viewBox='0 0 15 14'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path
                            d='M14.3495 6.22943L5.3412 8.57692C5.46531 9.05305 5.60433 9.52254 5.75823 9.98539C5.91214 10.4482 6.08621 10.9116 6.28044 11.3753C6.97423 11.3012 7.64054 11.2078 8.27935 11.0952C8.62991 11.0333 8.96811 10.9697 9.29393 10.9042C9.61838 10.8309 9.95382 10.7517 10.3003 10.6665C10.2884 10.508 10.2726 10.3501 10.2529 10.1929C10.2332 10.0357 10.2096 9.87924 10.1822 9.72343C10.1574 9.58321 10.1295 9.44756 10.0984 9.3165C10.0736 9.17627 10.0372 9.03811 9.98914 8.902L14.4111 8.21869C14.3234 8.99723 14.1199 9.68778 13.8004 10.2903C13.4887 10.8915 13.0826 11.4129 12.5822 11.8546C12.0881 12.2871 11.5121 12.6417 10.854 12.9184C10.1959 13.1951 9.48902 13.4001 8.73336 13.5333C7.8063 13.6968 6.9118 13.726 6.04986 13.6209C5.1957 13.5145 4.41604 13.2383 3.71086 12.7923C3.0121 12.3372 2.40845 11.6926 1.89991 10.8585C1.39916 10.0231 1.03409 8.95483 0.804692 7.65384C0.619248 6.60214 0.642978 5.66617 0.875882 4.84594C1.10878 4.02572 1.48579 3.31663 2.0069 2.7187C2.5358 2.11938 3.18153 1.63603 3.94411 1.26862C4.7131 0.892047 5.54164 0.625463 6.42974 0.468867C7.3568 0.305402 8.2474 0.276886 9.10156 0.383318C9.9635 0.488376 10.7411 0.752893 11.4344 1.17687C12.1354 1.59947 12.734 2.19275 13.2302 2.95671C13.7264 3.72068 14.0754 4.67525 14.2774 5.82044L14.3495 6.22943ZM4.79164 6.14355L9.47755 5.3173C9.30722 4.3513 9.04774 3.4492 8.69914 2.61102C8.00444 2.58893 7.29094 2.64245 6.55865 2.77157C5.84193 2.89795 5.12979 3.09581 4.42222 3.36516C4.45241 3.80966 4.49954 4.25921 4.56363 4.7138C4.62635 5.16059 4.70235 5.63718 4.79164 6.14355Z'
                            fill='white'
                        />
                    </svg>
                </div>
            </div>
        </section>
    );
};

export default IntroSection;
