"use client"

import type React from "react"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import ModalWrapper from "../../Modal/ModalWrapper"
import BasicDateTimePicker from "../../custom/DateTimePicker"
import moment from "moment"
import { UpdateEventRequest } from "@/app/models/IEvents"
import { Icons } from "../../ui/icons"
import EventDescriptionEditor from "../../Editor/EventDescription"

interface EditEventModalProps {
    modalVisibility: boolean;
    setModalVisibility: Dispatch<SetStateAction<boolean>>
    initialData: UpdateEventRequest
    handleUpdateEventInfo: (updatedEventInfo: UpdateEventRequest, toastMessage?: string) => Promise<void>
}

export function EditEventModal({ modalVisibility, setModalVisibility, initialData, handleUpdateEventInfo }: EditEventModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [eventRequest, setEventRequest] = useState<UpdateEventRequest>()
    const [newTag, setNewTag] = useState("")
    const [error, setError] = useState<string | null>(null)

    const handleDateSelect = (field: keyof UpdateEventRequest, date: Date | undefined) => {
        if (date) {
            setEventRequest((prev) => ({ ...prev as UpdateEventRequest, [field]: moment(date).format('YYYY-MM-DD HH:mm:ss') }))
        }
    }

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newTag.trim()) {
            e.preventDefault();
            if (eventRequest?.tags && !eventRequest.tags.includes(newTag.trim())) {
                setEventRequest((prev) => ({
                    ...prev as UpdateEventRequest,
                    tags: prev ? [...prev.tags as string[], newTag.trim()] : [newTag.trim()],
                }))
            }
            setNewTag("")
        }
    }

    const handleRemoveTag = (tagToRemove: string) => {
        setEventRequest((prev) => ({
            ...prev as UpdateEventRequest,
            tags: prev?.tags ? prev.tags.filter((tag) => tag !== tagToRemove) : [],
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError(null)
        setIsLoading(true)

        try {
            if (!eventRequest) {
                throw new Error("No event data provided");
            }

            // Validate dates
            // if (eventRequest.endDate && eventRequest.startDate && eventRequest.endDate < eventRequest.startDate) {
            //     throw new Error("End date cannot be before start date")
            // }
            // if (eventRequest.purchaseEndDate && eventRequest.purchaseStartDate && eventRequest.purchaseEndDate < eventRequest.purchaseStartDate) {
            //     throw new Error("Purchase end date cannot be before purchase start date")
            // }
            // if (eventRequest.purchaseEndDate && eventRequest.startDate && eventRequest.purchaseEndDate > eventRequest.startDate) {
            //     throw new Error("Ticket sales must end before event starts")
            // }

            setModalVisibility(false);
            
            await handleUpdateEventInfo(eventRequest);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (initialData) {
            if (initialData.tags) {
                setEventRequest((prev) => ({ ...prev as UpdateEventRequest, tags: initialData.tags }))
            }
            setEventRequest((prev) => ({ ...prev as UpdateEventRequest, eventId: initialData.eventId, publisherId: initialData.publisherId }))
        }
    }, [initialData])

    return (
        <ModalWrapper visibility={modalVisibility} setVisibility={setModalVisibility} disallowOverlayFunction styles={{ backgroundColor: 'transparent', color: '#fff', width: "fit-content" }}>
            <div className="w-full max-w-full md:w-[500px] md:max-w-[500px] max-h-[86vh] overflow-y-auto scrollbar-none p-6 rounded-lg bg-container-grey">
                <div className="flex flex-row justify-between items-start mb-5">
                    <div className="flex flex-col space-y-1">
                        <h3 className="text-2xl">Edit Event Details</h3>
                        <p className="text-gray-400">
                            Make changes to your event&apos;s basic information here.
                        </p>
                    </div>

                    <button
                        className="ml-auto w-8 h-8 min-w-8 min-h-8 rounded-full grid place-items-center cursor-pointer hover:bg-gray-100/10 [&_svg_path]:stroke-[#fff] fill-[#fff]"
                        onClick={() => setModalVisibility(false)}>
                        <Icons.Close className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="createEventFormField">
                            <label htmlFor="title" className="text-sm font-medium block mb-1">
                                Event Title
                            </label>
                            <input
                                id="title"
                                value={eventRequest?.title || initialData.title || ""}
                                onChange={(e) => setEventRequest((prev) => ({ ...prev as UpdateEventRequest, title: e.target.value }))}
                                className="bg-[#252525] border-gray-700"
                                required
                            />
                        </div>

                        <div className="createEventFormField">
                            <label htmlFor="description" className="text-sm font-medium block mb-1">
                                Description
                            </label>
                            <EventDescriptionEditor
                                description={eventRequest?.description ?? ''}
                                setEventRequest={setEventRequest}
                            />
                            {/* <textarea
                                id="description"
                                value={eventRequest.description || ""}
                                onChange={(e) => setEventRequest((prev) => ({ ...prev, description: e.target.value }))}
                                className="bg-[#252525] border-gray-700 min-h-[100px]"
                                required
                            /> */}
                        </div>

                        <div className="createEventFormField">
                            <label className="text-sm font-medium block mb-1">Event Start</label>
                            <div className="">
                                <BasicDateTimePicker
                                    className='custom-datepicker'
                                    defaultValue={eventRequest?.startDate ? moment(eventRequest.startDate) : initialData.startDate ? moment(initialData.startDate) : undefined}
                                    onChangeFn={(newValue) => {
                                        // Set the form value
                                        handleDateSelect("startDate", newValue?.toDate())
                                        // setEventRequest({ ...eventRequest as UpdateEventRequest, startDate: formattedDateForApi(newValue.toDate()) });
                                    }}
                                    minDate={moment(new Date())}
                                />
                            </div>
                        </div>
                        <div className="createEventFormField">
                            <label className="text-sm font-medium block mb-1">Event End</label>
                            <div className="">
                                <BasicDateTimePicker
                                    className='custom-datepicker'
                                    defaultValue={eventRequest?.endDate ? moment(eventRequest.endDate) : initialData.endDate ? moment(initialData.endDate) : undefined}
                                    onChangeFn={(newValue) => {
                                        // Set the form value
                                        handleDateSelect("endDate", newValue?.toDate())
                                        // setEventRequest({ ...eventRequest as EventRequest, endDate: formattedDateForApi(newValue.toDate()) });
                                    }}
                                    minDate={moment(eventRequest?.startDate)}
                                />
                            </div>
                        </div>
                        <div className="createEventFormField">
                            <label className="text-sm font-medium block mb-1">Sales Start</label>
                            <div className="">
                                <BasicDateTimePicker
                                    className='custom-datepicker'
                                    defaultValue={eventRequest?.purchaseStartDate ? moment(eventRequest.purchaseStartDate) : initialData.purchaseStartDate ? moment(initialData.purchaseStartDate) : undefined}
                                    onChangeFn={(newValue) => {
                                        // Set the form value
                                        handleDateSelect("purchaseStartDate", newValue?.toDate())
                                    }}
                                    minDate={moment(eventRequest?.startDate)}
                                />
                            </div>
                        </div>
                        <div className="createEventFormField">
                            <label className="text-sm font-medium block mb-1">Sales End</label>
                            <div className="">
                                <BasicDateTimePicker
                                    className='custom-datepicker'
                                    defaultValue={eventRequest?.purchaseEndDate ? moment(eventRequest.purchaseEndDate) : initialData.purchaseEndDate ? moment(initialData.purchaseEndDate) : undefined}
                                    onChangeFn={(newValue) => {
                                        // Set the form value
                                        handleDateSelect("purchaseEndDate", newValue?.toDate())
                                    }}
                                    minDate={moment(eventRequest?.startDate)}
                                />
                            </div>
                        </div>

                        <div className="createEventFormField">
                            <label htmlFor="tags" className="text-sm font-medium block mb-1">
                                Tags
                            </label>
                            <div className="space-y-2">
                                <div className="flex flex-wrap gap-2 min-h-[32px] p-2 bg-[#252525] border border-gray-700 rounded-md">
                                    {eventRequest &&
                                        eventRequest.tags?.map((tag) => (
                                            <span
                                                key={tag}
                                                className="bg-purple-900/30 text-purple-300 border-purple-700 gap-1 pl-2"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="ml-1 hover:text-purple-100 focus:outline-none"
                                                >
                                                    <Icons.Close className="h-3 w-3" />
                                                    <span className="sr-only">Remove {tag} tag</span>
                                                </button>
                                            </span>
                                        ))
                                    }
                                </div>
                                <input
                                    id="tags"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    placeholder="Type a tag and press Enter"
                                    className="bg-[#252525] border-gray-700"
                                />
                            </div>
                        </div>
                    </div>
                    {error && <div className="text-red-400 text-sm">{error}</div>}

                    <div className="flex justify-end gap-3">
                        <button type="button" className="tertiaryButton !px-4 !py-2 !bg-transparent !text-white" onClick={() => setModalVisibility(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="tertiaryButton !px-4 !py-2" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </ModalWrapper>
    )
}

