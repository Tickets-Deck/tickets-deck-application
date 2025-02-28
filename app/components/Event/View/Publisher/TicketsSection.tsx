import { Icons } from '@/app/components/ui/icons'
import { EventRequest, EventResponse } from '@/app/models/IEvents';
import moment from 'moment';
import React, { useEffect } from 'react'

type Props = {
    eventInfo: EventResponse
    handleUpdateEventInfo(updatedEventInfo: EventRequest): Promise<void>
}

export default function TicketsSection({ eventInfo, handleUpdateEventInfo }: Props) {
    // Current date
    const now = moment();
    const daysUntilPurchase = moment(eventInfo.purchaseStartDate).diff(now, 'days');

    const [timer, setTimer] = React.useState<string | undefined>(undefined);

    const futureDateTime = moment(eventInfo.purchaseStartDate);
    const duration = moment.duration(futureDateTime.diff(now));

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = moment();
            const duration = moment.duration(futureDateTime.diff(now));

            const days = Math.floor(duration.asDays());
            const hours = duration.hours();
            const minutes = duration.minutes();
            const seconds = duration.seconds();

            const displayDays = days > 0 ? `${days > 1 ? `${days} days, ` : `${days} day, `}` : '';
            const displayHours = hours > 0 ? `${hours > 1 ? `${hours} hours, ` : `${hours} hour, `}` : '';
            const displayMinutes = minutes > 0 ? `${minutes > 1 ? `${minutes} minutes, ` : `${minutes} minute, `}` : '';
            const displaySeconds = seconds > 0 ? `${seconds > 1 ? `${seconds} seconds` : `${seconds} second`}` : '0 seconds';

            if (duration.asMilliseconds() <= 0) {
                // console.log('The time has already passed!');
                setTimer(undefined)
            }
            else {
                setTimer(`${displayDays} ${displayHours} ${displayMinutes} ${displaySeconds} left`);
                // console.log(`${days} days, ${hours} ${hours > 1 ? 'hours' : 'hour'}, ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}, ${seconds} seconds left`);
            }

            // else if (days > 0) {
            //     setTimer(`${days} days, ${hours} ${hours > 1 ? 'hours' : 'hour'}, ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}, ${seconds} seconds left`);
            //     console.log(`${days} days, ${hours} ${hours > 1 ? 'hours' : 'hour'}, ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}, ${seconds} seconds left`);
            // } else if (hours > 0) {
            //     setTimer(`${hours} ${hours > 1 ? 'hours' : 'hour'}, ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}, ${seconds} seconds left`);
            //     console.log(`${hours} ${hours > 1 ? 'hours' : 'hour'}, ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}, ${seconds} seconds left`);
            // } else if (minutes > 0) {
            //     setTimer(`${minutes} ${minutes > 1 ? 'minutes' : 'minute'}, ${seconds} seconds left`);
            //     console.log(`${minutes} ${minutes > 1 ? 'minutes' : 'minute'}, ${seconds} seconds left`);
            // } else {
            //     setTimer(`${seconds} seconds left`);
            //     console.log(`${seconds} seconds left`);
            // }
        }, 1000);

        return () => clearInterval(intervalId); // Clean up the right way
    }, [eventInfo.purchaseStartDate]);

    return (
        <div className=''>
            <div className="bg-[#1e1e1e] border-[2px] border-container-grey p-5 rounded-xl">
                <div className='mb-4'>
                    <h4 className='text-2xl font-medium'>Ticket Types</h4>
                    <p className="text-gray-400">
                        Manage your event tickets and see sales statistics
                    </p>
                </div>

                <div className="space-y-6">
                    {eventInfo.tickets.map((ticket) => (
                        <div key={ticket.id} className="p-4 border border-gray-700 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-medium">{ticket.name}</h3>
                                    <p className="text-gray-400 text-sm">ID: {ticket.id}</p>
                                </div>
                                <div className="text-right">
                                    <h4 className="text-xl font-semibold font-Mona-Sans-Wide">
                                        {eventInfo.currency} {ticket.price.toLocaleString()}
                                    </h4>
                                    <p className="text-base text-gray-400">{ticket.ticketOrdersCount} sold</p>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <div className="text-sm text-gray-400">
                                    Created: {new Date(ticket.createdAt).toLocaleDateString()}
                                </div>
                                <button className='tertiaryButton !rounded-lg !py-2 !px-4'>Edit Ticket</button>
                            </div>
                        </div>
                    ))}

                    <div className="mt-6">
                        <button className="bg-primary-color hover:opacity-80 flex flex-row items-center space-x-2 p-2 px-3 rounded-md">
                            <Icons.Add
                                className="h-4 w-4 mr-2"
                                fill='#fff'
                            />
                            Add New Ticket Type
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-[#1e1e1e] border-[2px] border-container-grey p-5 rounded-xl mt-6">
                <div className='mb-4'>
                    <h4 className='text-2xl font-medium'>Ticket Sales Timeline</h4>
                    <p className="text-gray-400">
                        {daysUntilPurchase > 0 ? `Purchase starts in ${daysUntilPurchase} days` : "Ticket sales are active"}
                    </p>
                </div>
                <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-purple-900 text-purple-200">
                            Sales Progress
                        </span>
                        <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-purple-200">
                                {!timer ? "Active" : `Starting in ${timer}`}
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                        <div
                            style={{ width: duration.asMilliseconds() <= 0 ? "100%" : "0%" }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>{moment(eventInfo.purchaseStartDate).format("ddd, MMM Do, YYYY, hh:mm A")}</span>
                        <span>{moment(eventInfo.purchaseEndDate).format("ddd, MMM Do, YYYY, hh:mm A")}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}