import {
  ReactElement,
  FunctionComponent,
  Dispatch,
  SetStateAction,
} from "react";
import { EventCreationStage } from "@/app/enums/EventCreationStage";
import { EventRequest } from "@/app/models/IEvents";

// A helper for conditionally joining class names
const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

interface ProgressStepProps {
  label: string;
  stepNumber: number;
  isCurrent: boolean;
  isCompleted: boolean;
  isClickable: boolean;
  onClick: () => void;
}

const ProgressStep: FunctionComponent<ProgressStepProps> = ({
  label,
  stepNumber,
  isCurrent,
  isCompleted,
  isClickable,
  onClick,
}) => {
  const circleClasses = cn(
    "relative grid place-items-center size-8 rounded-full text-white shadow-[0px_0px_24px_4px_rgba(0,0,0,0.5)] transition-all duration-300 group",
    isCompleted && !isCurrent && "bg-primary-color-sub hover:bg-primary-color",
    !isCompleted && !isCurrent && "bg-gray-600",
    isCurrent && "!bg-primary-color",
    isClickable ? "cursor-pointer" : "pointer-events-none"
  );

  const numberClasses = cn(
    "text-sm leading-none transition-colors duration-300",
    isCompleted && !isCurrent && "text-dark-grey group-hover:text-white",
    !isCompleted && !isCurrent && "text-white",
    isCurrent && "!text-white"
  );

  return (
    <div className="z-10 flex flex-col items-center relative">
      <div className={circleClasses} onClick={onClick}>
        <span className={numberClasses}>{stepNumber}</span>
      </div>
      <p className="absolute md:bottom-[-60%] left-1/2 -translate-x-1/2 text-white/70 text-xs md:whitespace-nowrap w-[60px] md:w-auto bottom-[-100%] text-center md:text-start whitespace-normal">
        {label}
      </p>
    </div>
  );
};

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
  const steps = [
    { stage: EventCreationStage.BasicInfo, label: "Event Details" },
    { stage: EventCreationStage.ImageUpload, label: "Image Upload" },
    { stage: EventCreationStage.TicketDetails, label: "Ticket Details" },
    { stage: EventCreationStage.Confirmation, label: "Review & Publish" },
  ];

  const currentStageIndex = steps.findIndex(
    (step) => step.stage === eventCreationStage
  );

  // Calculate progress percentage for the connecting line
  const progressPercentage =
    currentStageIndex > 0 ? (currentStageIndex / (steps.length - 1)) * 100 : 0;

  return (
    <div className="mx-auto w-[80%] md:w-1/2 mt-6 mb-[3.5rem] relative">
      <div className="absolute top-1/2 -translate-y-1/2 w-full h-[0.125rem] bg-gray-600">
        <div
          className="h-full bg-primary-color-sub transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div
        className="flex justify-between items-center"
        style={disableAllTabs ? { pointerEvents: "none" } : {}}
      >
        {steps.map((step, index) => {
          const isCompleted = currentStageIndex > index;
          const isCurrent = currentStageIndex === index;
          // Allow clicking only on past (completed) steps to review/edit them.
          const isClickable = isCompleted;

          return (
            <ProgressStep
              key={step.stage}
              label={step.label}
              stepNumber={index + 1}
              isCurrent={isCurrent}
              isCompleted={isCompleted || isCurrent}
              isClickable={isClickable}
              onClick={() => {
                if (isClickable) {
                  setEventCreationStage(step.stage);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CreateEventProgressBar;
