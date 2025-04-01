import {
  ReactElement,
  FunctionComponent,
  Dispatch,
  SetStateAction,
} from "react";
import { EventCreationStage } from "@/app/enums/EventCreationStage";
import { EventRequest } from "@/app/models/IEvents";

interface CreateEventProgressBarProps {
  eventCreationStage: EventCreationStage;
  setEventCreationStage: Dispatch<SetStateAction<EventCreationStage>>;
  eventRequest: EventRequest | undefined;
  disableAllTabs: boolean;
}

const CreateEventProgressBar: FunctionComponent<
  CreateEventProgressBarProps
> = ({
  eventCreationStage,
  setEventCreationStage,
  eventRequest,
  disableAllTabs,
}): ReactElement => {
  const imageUploadIsUndone =
    eventCreationStage === EventCreationStage.BasicInfo &&
    !eventRequest?.mainImageBase64Url;
  const ticketDetailsIsUndone =
    eventCreationStage < EventCreationStage.TicketDetails &&
    !eventRequest?.tickets;
  const reviewAndPublishIsUndone =
    eventCreationStage < EventCreationStage.Confirmation &&
    !eventRequest?.tickets;

  const basicInfoIsCurrent =
    eventCreationStage === EventCreationStage.BasicInfo;
  const imageUploadIsCurrent =
    eventCreationStage === EventCreationStage.ImageUpload ||
    eventRequest?.images;
  const ticketDetailsIsCurrent =
    eventCreationStage === EventCreationStage.TicketDetails ||
    eventRequest?.tickets;
  const reviewAndPublishIsCurrent =
    eventCreationStage === EventCreationStage.Confirmation ||
    eventRequest?.tickets;

  const basicInfoIsDone = eventCreationStage > EventCreationStage.BasicInfo;
  const imageUploadIsDone = eventCreationStage > EventCreationStage.ImageUpload;
  const ticketDetailsIsDone =
    eventCreationStage > EventCreationStage.TicketDetails;
  const reviewAndPublishIsDone =
    eventCreationStage > EventCreationStage.Confirmation;

  return (
    <div className='mx-auto w-[80%] md:w-1/2 mt-6 mb-[3.5rem] flex justify-between items-center relative'>
      <span className='w-full h-[0.125rem] bg-primary-color-sub absolute'></span>
      <div
        style={disableAllTabs ? { pointerEvents: "none" } : {}}
        className={`relative grid place-items-center size-8 rounded-full bg-primary-color-sub text-white shadow-[0px_0px_24px_4px_rgba(0,0,0,0.5)] hover:cursor-pointer hover:bg-primary-color group ${
          basicInfoIsCurrent ? "!bg-primary-color" : ""
        } ${basicInfoIsDone ? "" : ""} `}
        onClick={() => setEventCreationStage(EventCreationStage.BasicInfo)}
      >
        <span
          className={`${
            basicInfoIsCurrent ? "!text-white" : ""
          } text-dark-grey group-hover:text-white text-sm leading-none`}
        >
          1
        </span>
        <p className='absolute md:bottom-[-60%] left-1/2 -translate-x-1/2 text-xs md:whitespace-nowrap w-[60px] md:w-auto bottom-[-100%] text-center md:text-start whitespace-normal'>
          Event Details
        </p>
      </div>
      <div
        style={disableAllTabs ? { pointerEvents: "none" } : {}}
        className={`relative grid place-items-center size-8 rounded-full bg-primary-color-sub text-white shadow-[0px_0px_24px_4px_rgba(0,0,0,0.5)] hover:cursor-pointer hover:bg-primary-color group ${
          imageUploadIsCurrent ? "!bg-primary-color" : ""
        } ${imageUploadIsDone ? "" : ""} ${
          imageUploadIsUndone ? "pointer-events-none" : ""
        } `}
        onClick={() => setEventCreationStage(EventCreationStage.ImageUpload)}
      >
        <span
          className={`${
            imageUploadIsCurrent ? "!text-white" : ""
          } text-dark-grey group-hover:text-white text-sm leading-none`}
        >
          2
        </span>
        <p className='absolute md:bottom-[-60%] left-1/2 -translate-x-1/2 text-xs md:whitespace-nowrap w-[60px] md:w-auto bottom-[-100%] text-center md:text-start whitespace-normal'>
          Image Upload
        </p>
      </div>
      <div
        style={disableAllTabs ? { pointerEvents: "none" } : {}}
        className={`relative grid place-items-center size-8 rounded-full bg-primary-color-sub text-white shadow-[0px_0px_24px_4px_rgba(0,0,0,0.5)] hover:cursor-pointer hover:bg-primary-color group ${
          ticketDetailsIsCurrent ? "!bg-primary-color" : ""
        } ${ticketDetailsIsDone ? "" : ""} ${
          ticketDetailsIsUndone ? "pointer-events-none" : ""
        } `}
        onClick={() => setEventCreationStage(EventCreationStage.TicketDetails)}
      >
        <span
          className={`${
            ticketDetailsIsCurrent ? "!text-white" : ""
          } text-dark-grey group-hover:text-white text-sm leading-none`}
        >
          3
        </span>
        <p className='absolute md:bottom-[-60%] left-1/2 -translate-x-1/2 text-xs md:whitespace-nowrap w-[60px] md:w-auto bottom-[-100%] text-center md:text-start whitespace-normal'>
          Ticket Details
        </p>
      </div>
      <div
        style={disableAllTabs ? { pointerEvents: "none" } : {}}
        className={`relative grid place-items-center size-8 rounded-full bg-primary-color-sub text-white shadow-[0px_0px_24px_4px_rgba(0,0,0,0.5)] hover:cursor-pointer hover:bg-primary-color group ${
          reviewAndPublishIsCurrent ? "!bg-primary-color" : ""
        } ${reviewAndPublishIsDone ? "" : ""} ${
          reviewAndPublishIsUndone ? "pointer-events-none" : ""
        } `}
        onClick={() => setEventCreationStage(EventCreationStage.Confirmation)}
      >
        <span
          className={`${
            reviewAndPublishIsCurrent ? "!text-white" : ""
          } text-dark-grey group-hover:text-white text-sm leading-none`}
        >
          4
        </span>
        <p className='absolute md:bottom-[-60%] left-1/2 -translate-x-1/2 text-xs md:whitespace-nowrap w-[60px] md:w-auto bottom-[-100%] text-center md:text-start whitespace-normal'>
          Review & Publish
        </p>
      </div>
    </div>
  );
};

export default CreateEventProgressBar;
