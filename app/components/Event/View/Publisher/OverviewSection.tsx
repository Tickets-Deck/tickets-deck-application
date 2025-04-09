import { ImagePopup } from "@/app/components/custom/ImagePopup";
import Toggler from "@/app/components/custom/Toggler";
import { Icons } from "@/app/components/ui/icons";
import { EventVisibility } from "@/app/enums/IEventVisibility";
import { EventResponse, UpdateEventRequest } from "@/app/models/IEvents";
import moment from "moment";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useState } from "react";

type Props = {
  eventInfo: EventResponse;
  handleUpdateEventInfo(updatedEventInfo: UpdateEventRequest): Promise<void>;
  setIsEventUpdateModalVisible: Dispatch<SetStateAction<boolean>>;
};

export default function OverviewSection({
  eventInfo,
  handleUpdateEventInfo,
  setIsEventUpdateModalVisible,
}: Props) {
  const [eventVisibility, setEventVisibility] = React.useState(
    eventInfo.visibility == EventVisibility.PUBLIC
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      {eventInfo && (
        <ImagePopup
          imageUrl={eventInfo.mainImageUrl}
          alt={eventInfo.title}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-xl p-5 pb-8 bg-[#1e1e1e] border-[2px] border-container-grey h-fit">
          <div className="mb-5 flex flex-row justify-between items-center">
            <h4 className="text-2xl font-medium">Event Details</h4>

            <button
              onClick={() => setIsEventUpdateModalVisible(true)}
              className="tertiaryButton !px-4 !py-2"
            >
              <Icons.Edit className="[&_path]:!fill-black" />
              Edit Event
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-base text-gray-400 font-medium mb-1">
                Image
              </h3>

              <div
                className={`w-full md:w-[50%] md:max-w-[300px] h-[300px] rounded-2xl overflow-hidden relative after after:bg-black after:absolute after:size-full after:top-0 after:left-0 after:z-[2] after:opacity-[0] hover:after:opacity-40 after:transition-all after:duration-300 group`}
              >
                <Image
                  src={eventInfo.mainImageUrl}
                  alt="Event flyer"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setIsPopupOpen(true)}
                  className="absolute left-1/2 transform -translate-x-1/2 -bottom-12 p-2 px-4 rounded-full flex flex-row gap-2 items-center bg-primary-color text-sm w-fit h-fit z-[3] hover:bg-white hover:text-primary-color group-hover:bottom-4 transition-all"
                >
                  <Icons.Expand className="w-4 h-4 [&_path]:stroke-primary-color-sub" />
                  Expand
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-base text-gray-400 font-medium mb-1">
                Title
              </h3>
              <p className="text-base text-white">{eventInfo.title}</p>
            </div>

            <div>
              <h3 className="text-base text-gray-400 font-medium mb-1">
                Description
              </h3>
              <p
                className="text-sm text-white"
                dangerouslySetInnerHTML={{ __html: eventInfo.description }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <h3 className="text-base font-medium mb-2">Event Schedule</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="w-10 h-10 mr-2 bg-white/10 rounded-full grid place-items-center">
                      <Icons.Calender width={18} height={18} fill="#fff" />
                    </span>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">
                        Start Date & Time
                      </p>
                      <p className="text-sm">
                        {moment(eventInfo.startDate).format(
                          "ddd, MMM Do, YYYY, hh:mm A"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="w-10 h-10 mr-2 bg-white/10 rounded-full grid place-items-center">
                      <Icons.Calender width={18} height={18} fill="#fff" />
                    </span>
                    <div>
                      <p className="text-sm text-gray-400">End Date & Time</p>
                      <p className="text-sm">
                        {moment(eventInfo.endDate).format(
                          "ddd, MMM Do, YYYY, hh:mm A"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-medium mb-2">
                  Ticket Sales Period
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="w-10 h-10 mr-2 bg-white/10 rounded-full grid place-items-center">
                      <Icons.Calender width={18} height={18} fill="#fff" />
                    </span>
                    <div>
                      <p className="text-sm text-gray-400">Sales Start</p>
                      <p className="text-sm">
                        {moment(eventInfo.purchaseStartDate).format(
                          "ddd, MMM Do, YYYY, hh:mm A"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="w-10 h-10 mr-2 bg-white/10 rounded-full grid place-items-center">
                      <Icons.Calender width={18} height={18} fill="#fff" />
                    </span>
                    <div>
                      <p className="text-sm text-gray-400">Sales End</p>
                      <p className="text-sm">
                        {moment(eventInfo.purchaseEndDate).format(
                          "ddd, MMM Do, YYYY, hh:mm A"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-base font-medium mb-2">Tags</h3>
              {eventInfo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {eventInfo.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary-color-sub/20 p-1 px-2 rounded text-purple-300 border-purple-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {eventInfo.tags.length == 0 && (
                <p className="text-sm text-gray-300">
                  No tags provided for this event.
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-[#1e1e1e] border-[2px] border-container-grey rounded-xl p-5 mb-6">
            <div className="mb-5">
              <h4 className="text-xl font-medium">Event Stats</h4>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Icons.QuickTicketBooking
                    fill="#ceb0fa"
                    className="h-5 w-5"
                  />
                  <span>Tickets Sold</span>
                </div>
                <span className="font-bold">{eventInfo.ticketOrdersCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Icons.Like isLiked className="h-5 w-5" />
                  <span>Favorites</span>
                </div>
                <span className="font-bold">{eventInfo.favoritesCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Icons.Bookmark className="h-5 w-5 text-purple-400" />
                  <span>Bookmarks</span>
                </div>
                <span className="font-bold">{eventInfo.bookmarksCount}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1e1e1e] border-[2px] border-container-grey rounded-xl p-5">
            <div className="mb-5">
              <h4 className="text-xl font-medium">Event Information</h4>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Category</span>
                <span className="bg-primary-color-sub/20 p-2 px-3 rounded-lg text-sm text-white">
                  {eventInfo.category}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Guest Type</span>
                <span>{eventInfo.allowedGuestType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Currency</span>
                <span>{eventInfo.currency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Organizer Pays Fee</span>
                <Toggler
                  checkboxValue={eventInfo.organizerPaysFee}
                  setCheckboxValue={() => {}}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Visibility</span>
                <span
                  className={`p-2 px-3 rounded-lg text-sm text-white ${
                    eventVisibility ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {eventVisibility ? "Public" : "Private"}
                </span>
              </div>
              {/* <div className="flex justify-between items-center">
                            <span className='text-sm'>Archived</span>
                            <Toggler
                                checkboxValue={eventInfo.isArchived}
                                setCheckboxValue={setIsArchived}
                            />
                        </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
