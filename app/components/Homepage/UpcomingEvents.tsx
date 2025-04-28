import React, { Dispatch, SetStateAction } from 'react'
import { Icons } from '../ui/icons'
import Badge from '../ui/badge'
import Image from 'next/image'
import { EventResponse } from '@/app/models/IEvents'
import moment from 'moment'
import Link from 'next/link'
import { motion } from "framer-motion"
import { ApplicationRoutes } from '@/app/constants/applicationRoutes'
import { useSession } from 'next-auth/react'
import { ITrendingEventCategory } from '@/app/models/IEventCategory'
import { formatStoredDate } from '@/utils/dateformatter'

type Props = {
    events: EventResponse[]
    setEmailVerificationPromptIsVisible: Dispatch<SetStateAction<boolean>>
    isEmailVerified: boolean | undefined
    trendingEventCategories: ITrendingEventCategory[] | undefined
}

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}: {
    className?: string
    delay?: number
    width?: number
    height?: number
    rotate?: number
    gradient?: string
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={`absolute ${className}`}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className=
                    "absolute inset-0 rounded-full  bg-gradient-to-r to-transparent  backdrop-blur-[2px] border-2 border-white/[0.15]  shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]  after:absolute after:inset-0 after:rounded-full  after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
                />
            </motion.div>
        </motion.div>
    )
}

export default function UpcomingEvents(
    { events, setEmailVerificationPromptIsVisible, isEmailVerified, trendingEventCategories }: Props) {

    const { data: session } = useSession();
    const user = session?.user;

    const upcomingEvents = events.filter(e => moment(e.startDate).isAfter(moment()));

    return (
        <section className="py-16 bg-black relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
            <div className="absolute inset-0 m-auto overflow-hidden size-full">
                <ElegantShape
                    delay={0.3}
                    width={600 + 300}
                    height={140 + 50}
                    rotate={12}
                    gradient="from-indigo-500/[0.15]"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                // className="right-[-10%] md:right-[-5%] botton-[15%] md:botton-[20%]"
                />

                <ElegantShape
                    delay={0.5}
                    width={500 + 300}
                    height={120 + 50}
                    rotate={-15}
                    gradient="from-rose-500/[0.15]"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                />

                <ElegantShape
                    delay={0.4}
                    width={300 + 300}
                    height={80 + 50}
                    rotate={-8}
                    gradient="from-violet-500/[0.15]"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                />

                <ElegantShape
                    delay={0.6}
                    width={200 + 300}
                    height={60 + 50}
                    rotate={20}
                    gradient="from-amber-500/[0.15]"
                    className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
                />

                <ElegantShape
                    delay={0.7}
                    width={150 + 300}
                    height={40 + 50}
                    rotate={-25}
                    gradient="from-cyan-500/[0.15]"
                    className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 z-[2]">
                <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 z-[2]">
                        <h2 className="text-3xl font-semibold mb-6">Discover More Events</h2>
                        <p className="text-gray-400 mb-8">
                            Browse through our curated collection of events happening around you. From concerts and festivals to
                            workshops and conferences, find something that matches your interests.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="bg-gray-900/50 border-[1px] border-primary-color-sub/30 hover:border-primary-color-sub-50/50 transition-all duration-300 rounded-2xl p-5 h-fit">
                                <div className="pb-4">
                                    <h3 className="text-xl font-medium">For Event Goers</h3>
                                </div>
                                <div className="space-y-4 mb-4">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-purple-900/30 p-0 rounded-full min-w-10 min-h-10 grid place-items-center">
                                            <Icons.Search stroke="white" className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Discover Events</h4>
                                            <p className="text-sm text-gray-400">Find events that match your interests and location</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="bg-purple-900/30 p-0 rounded-full min-w-10 min-h-10 grid place-items-center">
                                            <Icons.Calender fill="white" className="h-5 w-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Easy Booking</h4>
                                            <p className="text-sm text-gray-400">Secure your tickets in just a few clicks</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="bg-purple-900/30 p-0 rounded-full min-w-10 min-h-10 grid place-items-center">
                                            <Icons.UserOutline stroke="white" className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Invite Friends</h4>
                                            <p className="text-sm text-gray-400">Share events and attend together</p>
                                        </div>
                                    </div>
                                </div>
                                <Link href={`/events`}>
                                    <button
                                        className="tertiaryButton !rounded-[0.625rem] !w-full !justify-center border-primary-color-sub border-[1px]"
                                    >
                                        Find Events
                                        <Icons.ArrowRight className="ml-2 w-6 h-6" />
                                    </button>
                                </Link>
                            </div>

                            <div className="bg-gray-900/50 flex flex-col border-[1px] border-primary-color-sub/30 hover:border-primary-color-sub-50/50 transition-all duration-300 rounded-2xl p-5">
                                <div className="pb-4">
                                    <h3 className="text-xl font-medium">For Event Creators</h3>
                                </div>
                                <div className="space-y-4 mb-4">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-purple-900/30 p-0 rounded-full min-w-10 min-h-10 grid place-items-center">
                                            <Icons.CreateEvents stroke="white" className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Create Events</h4>
                                            <p className="text-sm text-gray-400">Set up your event in minutes</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="bg-purple-900/30 p-0 rounded-full min-w-10 min-h-10 grid place-items-center">
                                            <Icons.QuickTicketBooking stroke="white" className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Manage Tickets</h4>
                                            <p className="text-sm text-gray-400">Control your ticket inventory and pricing</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="bg-purple-900/30 p-0 rounded-full min-w-10 min-h-10 grid place-items-center">
                                            <Icons.TrackPerformance stroke="white" className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Track Performance</h4>
                                            <p className="text-sm text-gray-400">Get insights on sales and attendance</p>
                                        </div>
                                    </div>
                                </div>
                                {!user && (
                                    <Link className='!mt-auto' href={ApplicationRoutes.SignIn}>
                                        <button className="primaryButton !w-full !justify-center [&_svg_path]:stroke-white group">
                                            Start Creating
                                            <Icons.ArrowRight className="ml-2 w-6 h-6 group-hover:[&_path]:stroke-black" />
                                        </button>
                                    </Link>
                                )}
                                {user && !isEmailVerified && (
                                    <button
                                        onClick={() => setEmailVerificationPromptIsVisible(true)}
                                        className="primaryButton !mt-auto !w-full !justify-center [&_svg_path]:stroke-white group">
                                        Start Creating
                                        <Icons.ArrowRight className="ml-2 w-6 h-6 group-hover:[&_path]:stroke-black" />
                                    </button>
                                )}
                                {user && isEmailVerified && (
                                    <Link className='!mt-auto' href={ApplicationRoutes.CreateEvent}>
                                        <button
                                            // onClick={() => showEmailVerificationAlert()}
                                            className="primaryButton !mt-auto !w-full !justify-center [&_svg_path]:stroke-white group">
                                            Start Creating
                                            <Icons.ArrowRight className="ml-2 w-6 h-6 group-hover:[&_path]:stroke-black" />
                                        </button>
                                    </Link>
                                )
                                }
                            </div>
                        </div>
                    </div>

                    {
                        upcomingEvents &&
                        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 h-fit z-[2]">
                            <h3 className="text-xl font-semibold mb-5 flex items-center">
                                <Icons.Calender className="mr-2 h-5 w-5" fill='#fff' />
                                Upcoming Events
                            </h3>

                            <div className="space-y-4">
                                {
                                    upcomingEvents?.slice(0, 4).map((event) => (
                                        <Link href={`/event/${event.id}`} key={event.id} className="flex items-center gap-3 cursor-pointer group">
                                            <Image
                                                src={event.mainImageUrl || "/placeholder.svg"}
                                                alt={event.title}
                                                width={60}
                                                height={60}
                                                className="rounded-lg object-cover h-16 w-16 overflow-hidden text-xs min-w-[60px] min-h-[60px]"
                                            />
                                            <div>
                                                <h4 className="font-medium group-hover:text-purple-400 transition-colors capitalize">{event.title}</h4>
                                                <div className="flex items-center text-sm text-gray-400">
                                                    <Icons.Calender fill="#fff" className="h-3 w-3 mr-1" />
                                                    {formatStoredDate(event.startDate, "MMM D")}
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                }
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-800">
                                <h4 className="font-medium mb-3">Popular Categories</h4>
                                <div className="flex flex-row flex-wrap gap-2">
                                    {
                                        trendingEventCategories?.map(category => <Badge title={category.name} className='!mx-0 !mb-0' />)
                                    }
                                    {/* <Badge title='Music' className='!mx-0 !mb-0' />
                                    <Badge title='Sports' className='!mx-0 !mb-0' />
                                    <Badge title='Arts' className='!mx-0 !mb-0' />
                                    <Badge title='Business' className='!mx-0 !mb-0' />
                                    <Badge title='Food' className='!mx-0 !mb-0' /> */}
                                </div>
                            </div>

                            {/* <button className="w-full mt-4 text-purple-400">
                                View Calendar
                                <Icons.ChevronRight className="ml-1 h-4 w-4" />
                            </button> */}
                        </div>
                    }
                </div>
            </div>
        </section>
    )
}