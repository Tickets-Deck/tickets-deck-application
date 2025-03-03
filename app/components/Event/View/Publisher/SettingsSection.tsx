import Toggler from '@/app/components/custom/Toggler'
import { EventVisibility } from '@/app/enums/IEventVisibility'
import { EventResponse, UpdateEventRequest } from '@/app/models/IEvents'
import React, { Dispatch, SetStateAction, useEffect } from 'react'

type Props = {
    eventInfo: EventResponse
    handleUpdateEventInfo(updatedEventInfo: UpdateEventRequest, toastMessage?: string): Promise<void>
    setIsDeletionConfirmationModalVisible: Dispatch<SetStateAction<boolean>>
}

export default function SettingsSection({ eventInfo, handleUpdateEventInfo, setIsDeletionConfirmationModalVisible }: Props) {

    const [eventVisibility, setEventVisibility] = React.useState<boolean>(eventInfo.visibility === EventVisibility.PUBLIC);
    const [organizerPaysFee, setOrganizerPaysFee] = React.useState<boolean>(eventInfo.organizerPaysFee);
    const [isInitialized, setIsInitialized] = React.useState(false);
    const postUpdateMessage = () => {
        if (eventVisibility && eventInfo.visibility === EventVisibility.PRIVATE) {
            return "Event is now public";
        }
        if (!eventVisibility && eventInfo.visibility === EventVisibility.PUBLIC) {
            return "Event is now private";
        }
        if (organizerPaysFee && !eventInfo.organizerPaysFee) {
            return "Organizer now pays fees";
        }
        if (!organizerPaysFee && eventInfo.organizerPaysFee) {
            return "Attendees now pay fees";
        }
    }

    useEffect(() => {
        if (!isInitialized) {
            setIsInitialized(true);
            return;
        }

        handleUpdateEventInfo(
            {
                ...eventInfo as UpdateEventRequest,
                visibility: eventVisibility ? EventVisibility.PUBLIC : EventVisibility.PRIVATE,
                organizerPaysFee
            },
            postUpdateMessage()
        )
    }, [eventVisibility, organizerPaysFee]);

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
                            <h3 className="font-medium">Organizer Pays Fee</h3>
                            <p className="text-sm text-gray-400">You cover transaction fees instead of attendees</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm">{eventInfo.organizerPaysFee ? "Yes" : "No"}</span>
                            <Toggler
                                checkboxValue={organizerPaysFee}
                                setCheckboxValue={setOrganizerPaysFee}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">Archive Event</h3>
                            <p className="text-sm text-gray-400">Hide the event but keep all data</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            {/* <span className="text-sm">{eventInfo.isArchived ? "Archived" : "Active"}</span> */}
                            <button
                                onClick={() => setIsDeletionConfirmationModalVisible(true)}
                                className="primaryButton !bg-failed-color hover:!text-white hover:!opacity-50">
                                Archive
                            </button>
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