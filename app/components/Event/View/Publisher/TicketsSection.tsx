import Pulse from '@/app/components/custom/animation/Pulse';
import { Icons } from '@/app/components/ui/icons'
import { EventResponse } from '@/app/models/IEvents';
import { TicketResponse } from '@/app/models/ITicket';
import moment from 'moment';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

type Props = {
    eventInfo: EventResponse
    setSelectedTicket: Dispatch<SetStateAction<TicketResponse | undefined>>
    setIsTicketUpdateModalVisible: Dispatch<SetStateAction<boolean>>
    eventTickets: TicketResponse[] | undefined
    isFetchingEventTickets: boolean
    setIsTicketCreateModalVisible: Dispatch<SetStateAction<boolean>>
    setIsTicketDeleteModalVisible: Dispatch<SetStateAction<boolean>>
}

export default function TicketsSection(
    { eventInfo, setIsTicketUpdateModalVisible, setSelectedTicket,
        eventTickets, isFetchingEventTickets, setIsTicketCreateModalVisible, setIsTicketDeleteModalVisible }: Props) {

    const [timer, setTimer] = React.useState<string | undefined>(undefined);

    // Current date
    const now = moment();
    const daysUntilPurchase = moment(eventInfo.purchaseStartDate).diff(now, 'days');

    const futureDateTime = moment(eventInfo.purchaseStartDate);
    const duration = moment.duration(futureDateTime.diff(now));
    const [progress, setProgress] = useState(0);

    const startDate = eventInfo.purchaseStartDate;
    const endDate = eventInfo.purchaseEndDate;

    useEffect(() => {
        const updateProgress = () => {
            const now = moment();
            const start = moment(startDate);
            const end = moment(endDate);

            if (now.isBefore(start)) {
                setProgress(0); // Event hasn’t started yet
                return;
            }

            if (now.isAfter(end)) {
                setProgress(100); // Event has finished
                return;
            }

            const totalDuration = end.diff(start);
            const timePassed = now.diff(start);
            const percentage = (timePassed / totalDuration) * 100;

            setProgress(Number(percentage.toFixed(2))); // Limit decimal places
        };

        updateProgress();
        const interval = setInterval(updateProgress, 1000); // Update every second

        return () => clearInterval(interval);
    }, [startDate, endDate]);

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
                setTimer(undefined)
            }
            else {
                setTimer(`${displayDays} ${displayHours} ${displayMinutes} ${displaySeconds} left`);
            }

            // else if (days > 0) {
            //     setTimer(`${days} days, ${hours} ${hours > 1 ? 'hours' : 'hour'}, ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}, ${seconds} seconds left`);
            // } else if (hours > 0) {
            //     setTimer(`${hours} ${hours > 1 ? 'hours' : 'hour'}, ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}, ${seconds} seconds left`);
            // } else if (minutes > 0) {
            //     setTimer(`${minutes} ${minutes > 1 ? 'minutes' : 'minute'}, ${seconds} seconds left`);
            // } else {
            //     setTimer(`${seconds} seconds left`);
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
                    {
                        !isFetchingEventTickets && eventTickets &&
                        eventTickets.map((ticket) => (
                            <div key={ticket.id} className="p-4 border border-gray-700 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className='flex flex-row items-center space-x-3'>
                                            <h3 className="text-lg font-medium">{ticket.name}</h3>
                                            <div className='flex flex-row items-center space-x-2'>
                                                <Pulse type={ticket.visibility} />
                                                <span className='text-xs text-gray-200'>{ticket.visibility ? 'Active' : 'Not active'}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-sm">Ticket admits {ticket.numberOfUsers} {ticket.numberOfUsers > 1 ? 'people' : 'person'}</p>
                                        <p className="text-gray-200 text-sm">{ticket.remainingTickets} {ticket.remainingTickets > 1 ? 'tickets' : 'ticket'} left</p>
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
                                    <div className='flex flex-row space-x-2'>
                                        <button
                                            onClick={() => {
                                                setSelectedTicket(ticket);
                                                setIsTicketUpdateModalVisible(true);
                                            }}
                                            className='tertiaryButton !rounded-lg !py-2 !px-4'>
                                            Edit Ticket
                                        </button>
                                        {
                                            ticket.ticketOrdersCount === 0 &&
                                            <button
                                                onClick={() => {
                                                    setSelectedTicket(ticket);
                                                    setIsTicketDeleteModalVisible(true);
                                                }}
                                                className='tertiaryButton !bg-failed-color !text-white !rounded-lg !py-2 !px-4'>
                                                <Icons.Delete className='!w-5 h-5' />
                                            </button>
                                        }
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    {
                        isFetchingEventTickets && !eventTickets &&
                        <p>
                            Fetching event tickets.
                        </p>
                    }
                    {
                        !isFetchingEventTickets && !eventTickets &&
                        <p>
                            There are no tickets available for this event.
                        </p>
                    }

                    <div className="mt-6">
                        <button
                            onClick={() => setIsTicketCreateModalVisible(true)}
                            className="bg-primary-color hover:opacity-80 flex flex-row items-center space-x-2 p-2 px-3 rounded-md">
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
                                {!timer ? "Not active" : `${timer}`}
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                        <div
                            style={{ width: `${progress}%` }}
                            // style={{ width: duration.asMilliseconds() <= 0 ? "100%" : "0%" }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>{moment(eventInfo.purchaseStartDate).format("ddd, MMM Do, YYYY, hh:mm A")}</span>
                        <span>{moment(eventInfo.purchaseEndDate).format("ddd, MMM Do, YYYY, hh:mm A")}</span>
                    </div>
                </div>
            </div>
        </div >
    )
}