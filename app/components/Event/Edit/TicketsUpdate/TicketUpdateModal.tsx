import { useUpdateTicketInformation } from "@/app/api/apiClient";
import ModalWrapper from "@/app/components/Modal/ModalWrapper";
import { Icons } from "@/app/components/ui/icons";
import { catchError } from "@/app/constants/catchError";
import { useToast } from "@/app/context/ToastCardContext";
import {
  DefaultFormResponseStatus,
  FormFieldResponse,
} from "@/app/models/IFormField";
import { TicketRequest, TicketResponse } from "@/app/models/ITicket";
import { useSession } from "next-auth/react";
import {
  ReactElement,
  FunctionComponent,
  Dispatch,
  SetStateAction,
  ChangeEvent,
  useState,
  useEffect,
  useRef,
} from "react";

interface TicketUpdateModalProps {
  modalVisibility: boolean;
  setModalVisibility: Dispatch<SetStateAction<boolean>>;
  selectedTicket: TicketResponse | undefined;
  handleFetchEventTickets: () => Promise<void>;
  // eventRequest: EventRequest | undefined
  // setEventRequest: Dispatch<SetStateAction<EventRequest | undefined>>
}

const TicketUpdateModal: FunctionComponent<TicketUpdateModalProps> = ({
  modalVisibility,
  setModalVisibility,
  selectedTicket,
  handleFetchEventTickets,
}): ReactElement => {
  const toastHandler = useToast();
  const updateTicketInformation = useUpdateTicketInformation();
  const { data: session } = useSession();
  const user = session?.user;

  const [isUpdatingTicketInfo, setIsUpdatingTicketInfo] = useState(false);
  const [ticketFormRequest, setTicketFormRequest] = useState<TicketRequest>();

  const [ticketNameErrorMsg, setTicketNameErrorMsg] =
    useState<FormFieldResponse>();
  const [ticketPriceErrorMsg, setTicketPriceErrorMsg] =
    useState<FormFieldResponse>();
  const [ticketRemainingErrorMsg, setTicketRemainingErrorMsg] =
    useState<FormFieldResponse>();
  const [ticketNumberOfUsersErrorMsg, setTicketNumberOfUsersErrorMsg] =
    useState<FormFieldResponse>();
  const [ticketDescriptionErrorMsg, setTicketDescriptionErrorMsg] =
    useState<FormFieldResponse>();

  function onFormValueChange(
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    setErrorStateFunction?: Dispatch<
      SetStateAction<FormFieldResponse | undefined>
    >
  ) {
    // Desctructure the name and value from the event target
    const { name, value } = e.target;

    if (
      name == "numberOfUsers" ||
      name == "remainingTickets" ||
      name == "quantity"
    ) {
      // Update the state
      setTicketFormRequest({
        ...(ticketFormRequest as TicketRequest),
        [name]: Number(value),
      });

      // If there is an error message, clear it
      if (setErrorStateFunction) {
        setErrorStateFunction(undefined);
      }
      return;
    }

    // Update the state
    setTicketFormRequest({
      ...(ticketFormRequest as TicketRequest),
      [name]: value,
    });

    // If there is an error message, clear it
    if (setErrorStateFunction) {
      setErrorStateFunction(undefined);
    }
  }

  useEffect(() => {
    if (selectedTicket) {
      setTicketFormRequest({
        ...(selectedTicket as TicketRequest),
        description: selectedTicket.description || "",
      });
    }
  }, [selectedTicket]);

  async function handleUpdateTicketInformation() {
    // Show loader
    setIsUpdatingTicketInfo(true);

    await updateTicketInformation(
      user?.token as string,
      selectedTicket?.id as string,
      user?.id as string,
      ticketFormRequest as TicketResponse
    )
      .then(async () => {
        await handleFetchEventTickets();

        // Clear all fields
        setTicketFormRequest(undefined);

        // Close modal
        setModalVisibility(false);
      })
      .catch((error) => {
        // Display error
        toastHandler.logError(
          "Error",
          "An error occurred while updating your ticket information"
        );

        // Catch error
        catchError(error);
      })
      .finally(() => {
        setIsUpdatingTicketInfo(false);
      });
  }

  return (
    <ModalWrapper
      visibility={modalVisibility}
      setVisibility={setModalVisibility}
      disallowOverlayFunction
      styles={{
        backgroundColor: "transparent",
        color: "#fff",
        width: "fit-content",
      }}
    >
      <div className="w-full md:w-[28.125rem] max-h-[86vh] overflow-y-auto p-6 rounded-[20px] bg-container-grey [scrollbar-width:none]">
        <div className="flex justify-between items-center mb-6">
          <h4>Update Ticket</h4>
          <span
            className="ml-auto size-8 rounded-full grid place-items-center cursor-pointer hover:bg-white/10 [&_svg_path]:stroke-white [&_svg_path]:fill-white"
            onClick={() => setModalVisibility(false)}
          >
            <Icons.Close />
          </span>
        </div>
        <div className="flex flex-col gap-[0.8rem] mb-[1.5rem]">
          <div className="flex flex-col gap-1 relative">
            <label htmlFor="name" className="text-xs text-white">
              Ticket Name
            </label>
            <input
              className="rounded-[0.5rem] bg-white/10 text-xs w-full text-white py-[0.8rem] px-[1.1rem] border-none outline-none bg-white placeholder:text-white/50"
              type="text"
              name="name"
              // value={eventRequest?.tickets[0]?.role}
              value={ticketFormRequest?.name ?? selectedTicket?.name}
              placeholder="Ticket name"
              onChange={(e) => onFormValueChange(e, setTicketNameErrorMsg)}
            />
            {ticketNameErrorMsg &&
              ticketNameErrorMsg.status == DefaultFormResponseStatus.Failed && (
                <span className="className='text-xs text-[#eb485b] flex items-center gap-[2px]">
                  {ticketNameErrorMsg.message}
                </span>
              )}
          </div>
          <div className="flex flex-col gap-1 relative">
            <label htmlFor="price" className="text-xs text-white">
              Ticket Price
            </label>
            <input
              className="rounded-[0.5rem] bg-white/10 text-xs w-full text-white py-[0.8rem] px-[1.1rem] border-none outline-none bg-white placeholder:text-white/50"
              type="text"
              name="price"
              // value={eventRequest?.tickets[0]?.price}
              value={ticketFormRequest?.price ?? selectedTicket?.price}
              placeholder="Price per ticket"
              onChange={(e) => {
                if (Number(e.target.value) == 0) {
                  onFormValueChange(e);
                  return;
                }
                if (!Number(e.target.value)) {
                  return;
                }

                onFormValueChange(e, setTicketPriceErrorMsg);
              }}
              onKeyUp={(e) => {
                if (
                  Number(e.currentTarget.value) > 0 &&
                  Number(e.currentTarget.value) < 1000
                ) {
                  setTicketPriceErrorMsg({
                    message:
                      "Ticket price can either be 0 or greater than 1,000",
                    status: DefaultFormResponseStatus.Failed,
                  });
                }
              }}
              onKeyDown={(e) => {
                // If . was pressed, prevent it
                if (e.key == ".") {
                  e.preventDefault();
                }
              }}
            />
            <p className="text-xs text-grey-3">
              Make the ticket price zero if it's marked as 'Free.' Tickets
              marked as '&#8358;0' can be gotten without paying anything.
            </p>
            {ticketPriceErrorMsg &&
              ticketPriceErrorMsg.status ==
                DefaultFormResponseStatus.Failed && (
                <span className="className='text-xs text-[#eb485b] flex items-center gap-[2px]">
                  {ticketPriceErrorMsg.message}
                </span>
              )}
          </div>
          <div className="flex flex-col gap-1 relative">
            <label htmlFor="numberOfUsers" className="text-xs text-white">
              Number of persons for this ticket
            </label>
            <input
              className="rounded-[0.5rem] bg-white/10 text-xs w-full text-white py-[0.8rem] px-[1.1rem] border-none outline-none bg-white placeholder:text-white/50"
              type="text"
              name="numberOfUsers"
              value={
                ticketFormRequest?.numberOfUsers ??
                selectedTicket?.numberOfUsers
              }
              placeholder="Number of users"
              onChange={(e) => {
                if (Number(e.target.value) == 0) {
                  onFormValueChange(e, setTicketNumberOfUsersErrorMsg);
                  return;
                }
                if (!Number(e.target.value)) {
                  return;
                }

                onFormValueChange(e, setTicketNumberOfUsersErrorMsg);
              }}
              onKeyUp={(e) => {
                if (
                  Number(ticketFormRequest?.numberOfUsers) < 1 &&
                  e.currentTarget.value != ""
                ) {
                  setTicketNumberOfUsersErrorMsg({
                    message: "The minimum number of users for a ticket is 1",
                    status: DefaultFormResponseStatus.Failed,
                  });
                }
              }}
              onKeyDown={(e) => {
                // If . was pressed, prevent it
                if (e.key == ".") {
                  e.preventDefault();
                }
              }}
            />
            {ticketNumberOfUsersErrorMsg &&
              ticketNumberOfUsersErrorMsg.status ==
                DefaultFormResponseStatus.Failed && (
                <span className="className='text-xs text-[#eb485b] flex items-center gap-[2px]">
                  {ticketNumberOfUsersErrorMsg.message}
                </span>
              )}
          </div>
          <div className="flex flex-col gap-1 relative">
            <label htmlFor="remainingTickets" className="text-xs text-white">
              Number of remaining tickets
            </label>
            <input
              className="rounded-[0.5rem] bg-white/10 text-xs w-full text-white py-[0.8rem] px-[1.1rem] border-none outline-none bg-white placeholder:text-white/50"
              type="text"
              name="remainingTickets"
              value={
                ticketFormRequest?.remainingTickets ??
                selectedTicket?.remainingTickets
              }
              placeholder="Number of remaining tickets"
              onChange={(e) => {
                if (Number(e.target.value) == 0) {
                  onFormValueChange(e, setTicketRemainingErrorMsg);
                  return;
                }
                if (!Number(e.target.value)) {
                  return;
                }

                onFormValueChange(e, setTicketRemainingErrorMsg);
              }}
              onKeyUp={(e) => {
                if (
                  Number(ticketFormRequest?.remainingTickets) < 0 &&
                  e.currentTarget.value != ""
                ) {
                  setTicketRemainingErrorMsg({
                    message:
                      "The minimum number of remaining tickets cannot be less than 0",
                    status: DefaultFormResponseStatus.Failed,
                  });
                }
              }}
              onKeyDown={(e) => {
                // If . was pressed, prevent it
                if (e.key == ".") {
                  e.preventDefault();
                }
              }}
            />
            {ticketRemainingErrorMsg &&
              ticketRemainingErrorMsg.status ==
                DefaultFormResponseStatus.Failed && (
                <span className="className='text-xs text-[#eb485b] flex items-center gap-[2px]">
                  {ticketRemainingErrorMsg.message}
                </span>
              )}
          </div>
          <div className="flex flex-col gap-1 relative">
            <label htmlFor="description" className="text-xs text-white">
              Ticket Description
            </label>
            <textarea
              className="rounded-[0.5rem] bg-white/10 text-xs w-full text-white py-[0.8rem] px-[1.1rem] border-none outline-none bg-white placeholder:text-white/50 resize-none h-[5rem]"
              name="description"
              value={
                ticketFormRequest?.description ?? selectedTicket?.description
              }
              placeholder="Short description of the ticket, including benefits, etc."
              onChange={(e) =>
                onFormValueChange(e, setTicketDescriptionErrorMsg)
              }
            />
            {ticketDescriptionErrorMsg &&
              ticketDescriptionErrorMsg.status ==
                DefaultFormResponseStatus.Failed && (
                <span className="className='text-xs text-[#eb485b] flex items-center gap-[2px]">
                  {ticketDescriptionErrorMsg.message}
                </span>
              )}
          </div>
          <div>
            <span>Status</span>
            <div className="flex flex-row items-center justify-start gap-2 w-fit">
              <button
                onClick={() =>
                  setTicketFormRequest({
                    ...(ticketFormRequest as TicketRequest),
                    visibility: true,
                  })
                }
                className={`w-fit rounded-[3.125rem] cursor-pointer text-sm bg-white text-[#111] py-[0.375rem] px-3 mx-auto ${
                  !ticketFormRequest?.visibility
                    ? "!bg-white/10 !text-white"
                    : ""
                }`}
              >
                Active
              </button>
              <button
                onClick={() =>
                  setTicketFormRequest({
                    ...(ticketFormRequest as TicketRequest),
                    visibility: false,
                  })
                }
                className={`w-fit rounded-[3.125rem] cursor-pointer text-sm bg-white text-[#111] py-[0.375rem] px-3 mx-auto ${
                  ticketFormRequest?.visibility
                    ? "!bg-white/10 !text-white"
                    : ""
                }`}
              >
                Inactive
              </button>
            </div>
          </div>
          <button
            type="button"
            className="w-fit rounded-[3.125rem] cursor-pointer text-sm bg-white text-[#111] py-[0.375rem] px-3 mx-auto"
            disabled={isUpdatingTicketInfo}
            onClick={() => handleUpdateTicketInformation()}
          >
            {isUpdatingTicketInfo ? "Updating ticket" : "Update ticket"}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default TicketUpdateModal;
