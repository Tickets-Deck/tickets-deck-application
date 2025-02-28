import Toggler from '@/app/components/custom/Toggler'
import { EventVisibility } from '@/app/enums/IEventVisibility'
import { EventResponse, UpdateEventRequest } from '@/app/models/IEvents'
import React, { useEffect } from 'react'

type Props = {
    eventInfo: EventResponse
    handleUpdateEventInfo(updatedEventInfo: UpdateEventRequest): Promise<void>
}

export default function SettingsSection({ eventInfo, handleUpdateEventInfo }: Props) {

    const [eventVisibility, setEventVisibility] = React.useState<boolean>(eventInfo.visibility === EventVisibility.PUBLIC);

    useEffect(() => {
        handleUpdateEventInfo({
            ...eventInfo as UpdateEventRequest,
            visibility: eventInfo.visibility === EventVisibility.PUBLIC ? EventVisibility.PRIVATE : EventVisibility.PUBLIC
        })
    }, [eventVisibility])

    return (
        <div className="bg-[#1e1e1e] border-[2px] border-container-grey p-5 rounded-xl">
            <div className='mb-4'>
                <h4 className='text-2xl font-medium'>Event Settings</h4>
                <p className="text-gray-400">
                    Manage your event configuration and visibility
                </p>
            </div>
            <div>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">Event Visibility</h3>
                            <p className="text-sm text-gray-400">Control who can see your event</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm">{eventVisibility ? "Public" : "Private"}</span>
                            <Toggler
                                checkboxValue={eventVisibility}
                                setCheckboxValue={setEventVisibility}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">Archive Event</h3>
                            <p className="text-sm text-gray-400">Hide the event but keep all data</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm">{eventInfo.isArchived ? "Archived" : "Active"}</span>
                            <Toggler
                                checkboxValue={eventInfo.isArchived}
                                setCheckboxValue={() => { }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">Organizer Pays Fee</h3>
                            <p className="text-sm text-gray-400">You cover transaction fees instead of attendees</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm">{eventInfo.organizerPaysFee ? "Yes" : "No"}</span>
                            <Toggler
                                checkboxValue={eventInfo.organizerPaysFee}
                                setCheckboxValue={() => { }}
                            />
                        </div>
                    </div>

                    {/* <div className="pt-4 border-t border-gray-700">
                        <h3 className="font-medium text-xl mb-4">Danger Zone</h3>
                        <button className='tertiaryButton !bg-failed-color !text-white'>Delete Event</button>
                    </div> */}
                </div>
            </div>
        </div>
    )
}