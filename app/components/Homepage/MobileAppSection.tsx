import Image from 'next/image'
import React from 'react'
import Badge from '../ui/badge'

type Props = {}

export default function MobileAppSection({ }: Props) {
    return (
        <section className="sectionPadding !py-16 bg-gradient-to-b from-black to-purple-950">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className='flex flex-col items-start'>
                    <Badge title='Mobile App - Coming Soon!' className='!mx-0' />
                    <h2 className="text-3xl font-semibold mb-4 md:w-[80%]">Take Ticketsdeck Events With You Everywhere</h2>
                    <p className="text-gray-300 mb-6">
                        We’re working on something exciting! Soon, you’ll be able to discover events, purchase tickets, 
                        and manage your bookings right from our mobile app. Stay tuned for exclusive mobile-only deals and 
                        instant notifications for your favorite events.
                    </p>
                    {/* <p className="text-gray-300 mb-6">
                        Download our mobile app to discover events, purchase tickets, and manage your bookings on the go. Get
                        exclusive mobile-only deals and instant notifications for your favorite events.
                    </p> */}

                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* <button className="bg-black hover:bg-gray-900 flex items-center gap-2">
                            <Image src="/placeholder.svg?height=24&width=24" alt="App Store" width={24} height={24} />
                            App Store
                        </button>
                        <button className="bg-black hover:bg-gray-900 flex items-center gap-2">
                            <Image src="/placeholder.svg?height=24&width=24" alt="Google Play" width={24} height={24} />
                            Google Play
                        </button> */}
                        <p>Want to be the first to know when we launch? Keep an eye out!</p>
                    </div>
                </div>

                <div className="relative basis-[1/2] h-80 border-[1px] border-white rounded-2xl">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
                    <Image
                        src="/placeholder.svg?height=600&width=300"
                        alt="Mobile App"
                        width={300}
                        height={600}
                        className="mx-auto relative z-10"
                    />
                </div>
            </div>
        </section>
    )
}