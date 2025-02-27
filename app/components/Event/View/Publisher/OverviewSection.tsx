import Toggler from '@/app/components/custom/Toggler'
import { Icons } from '@/app/components/ui/icons'
import { ArrowDropDownIcon } from '@mui/x-date-pickers/icons'
import React from 'react'

type Props = {}

export default function OverviewSection({ }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-xl p-5 bg-[#1e1e1e] border-gray-700 h-fit">
                <div className='mb-5'>
                    <h4 className='text-2xl font-medium'>Event Details</h4>
                </div>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-1">Description</h3>
                        <p className="text-gray-300">Description comes everywhere here</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Event Schedule</h3>
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <span className='w-10 h-10 mr-2 bg-white/50 rounded-full grid place-items-center'>
                                        <Icons.Calender width={16} height={16} />
                                    </span>
                                    <div>
                                        <p className="text-sm text-gray-400">Start Date & Time</p>
                                        <p>Thu, Feb 27, 2025, 05:30 PM</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Icons.Sun className="h-5 w-5 mr-2 text-purple-400 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-400">End Date & Time</p>
                                        <p>Thu, Feb 27, 2025, 05:30 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">Ticket Sales Period</h3>
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <Icons.Sun className="h-5 w-5 mr-2 text-purple-400 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-400">Sales Start</p>
                                        <p>Mon, Feb 24, 2025, 01:00 AM</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Icons.Sun className="h-5 w-5 mr-2 text-purple-400 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-400">Sales End</p>
                                        <p>Mon, Feb 24, 2025, 01:00 AM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {["bustic", "conference"].map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-purple-900/30 text-purple-300 border-purple-700"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="bg-[#1e1e1e] border-gray-700 mb-6">
                    <div>
                        <h4>Event Stats</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <Icons.Sun className="h-5 w-5 mr-2 text-purple-400" />
                                <span>Tickets Sold</span>
                            </div>
                            <span className="font-bold">100</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <Icons.Sun className="h-5 w-5 mr-2 text-purple-400" />
                                <span>Favorites</span>
                            </div>
                            <span className="font-bold">100</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <Icons.Sun className="h-5 w-5 mr-2 text-purple-400" />
                                <span>Bookmarks</span>
                            </div>
                            <span className="font-bold">100</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1e1e1e] border-gray-700">
                    <div>
                        <h4>Event Information</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <Icons.Sun className="h-5 w-5 mr-2 text-purple-400" />
                                <span>Category</span>
                            </div>
                            <span className="bg-purple-700">Freaka</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <Icons.Profile className="h-5 w-5 mr-2 text-purple-400" />
                                <span>Guest Type</span>
                            </div>
                            <span>Type allowed</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <Icons.Sun className="h-5 w-5 mr-2 text-purple-400" />
                                <span>Currency</span>
                            </div>
                            <span>NGN</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <Icons.Sun className="h-5 w-5 mr-2 text-purple-400" />
                                <span>Organizer Pays Fee</span>
                            </div>
                            {/* <Switch checked={mockEvent.organizerPaysFee} /> */}
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <Icons.Sun className="h-5 w-5 mr-2 text-purple-400" />
                                <span>Visibility</span>
                            </div>
                            <span className={true ? "bg-green-700" : "bg-gray-700"}>
                                {true ? "Public" : "Private"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <Icons.Delete className="h-5 w-5 mr-2 text-purple-400" />
                                <span>Archived</span>
                            </div>
                            {/* <Toggler checkboxValue={true} /> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}