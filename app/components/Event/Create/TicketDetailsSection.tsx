import {
  ReactElement,
  FunctionComponent,
  Dispatch,
  SetStateAction,
  useRef,
  useState,
  useEffect,
} from "react";
import { EventRequest } from "@/app/models/IEvents";
import { Icons } from "../../ui/icons";
import { TicketRequest } from "@/app/models/ITicket";
import TicketCreationModal from "./TicketsCreation/TicketCreationModal";
import { FormFieldResponse } from "@/app/models/IFormField";
import { formattedDateForApi } from "@/utils/dateformatter";
import BasicDateTimePicker from "../../custom/DateTimePicker";
import moment from "moment";

interface TicketDetailsSectionProps {
  eventRequest: EventRequest | undefined;
  setEventRequest: Dispatch<SetStateAction<EventRequest | undefined>>;
  ticketValidationMessage: FormFieldResponse | undefined;
  setTicketValidationMessage: React.Dispatch<
    React.SetStateAction<FormFieldResponse | undefined>
  >;
}

const TicketDetailsSection: FunctionComponent<TicketDetailsSectionProps> = ({
  eventRequest,
  setEventRequest,
  ticketValidationMessage,
  setTicketValidationMessage,
}): ReactElement => {
  const purchaseStartDateRef = useRef(null);
  const purchaseEndDateRef = useRef(null);

  const [isEditingTicket, setIsEditingTicket] = useState(false);

  function deleteTicket(ticket: TicketRequest) {
    // Create a representation of the event request
    const _eventRequest = eventRequest;

    const filteredTickets = _eventRequest?.tickets.filter(
      (anyTicket) => anyTicket.name != ticket.name
    );

    setEventRequest({
      ...(eventRequest as EventRequest),
      tickets: filteredTickets ?? ([] as TicketRequest[]),
    });
  }

  function editTicket(ticketIndex: number, ticket: TicketRequest) {
    // Create a representation of the event request
    const _eventRequest = eventRequest;

    // Set the ticket to be edited
    // setEventRequest({ ...eventRequest as EventRequest, ticketToEdit: ticket });
  }

  const [isTicketCreationModalVisible, setIsTicketCreationModalVisible] =
    useState(false);
  const [selectedTicketIndex, setSelectedTicketIndex] = useState<
    number | undefined
  >();

  useEffect(() => {
    if (eventRequest && eventRequest?.tickets.length > 0) {
      setTicketValidationMessage(undefined);
    }
  }, [eventRequest?.tickets]);

  useEffect(() => {
    if (!isTicketCreationModalVisible) {
      setIsEditingTicket(false);
      setSelectedTicketIndex(undefined);
    }
  }, [isTicketCreationModalVisible]);

  return (
    <div className='flex flex-col gap-8'>
      <TicketCreationModal
        modalVisibility={isTicketCreationModalVisible}
        setModalVisibility={setIsTicketCreationModalVisible}
        eventRequest={eventRequest}
        setEventRequest={setEventRequest}
        isEditingTicket={isEditingTicket}
        selectedTicketIndex={selectedTicketIndex}
      />

      <div className='flex items-start justify-between'>
        <div>
          <h3 className='text-xl font-normal mb-1 text-white'>
            Let's Create Tickets
          </h3>
          <p className='text-sm text-white/60'>
            Click on the "Create ticket" button below to add tickets for your
            event
          </p>
        </div>
        <div className='flex flex-col items-center gap-1'>
          <span className='w-8 h-8 rounded-full bg-white text-black grid place-items-center'>
            {eventRequest?.tickets.length}
          </span>
          <p className='text-sm text-white/60 md:text-center'>
            tickets created
          </p>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        {eventRequest?.tickets.map((ticket, index) => (
          <div
            className='p-6 rounded-lg bg-container-grey text-white flex flex-col gap-6'
            key={index}
          >
            <div className='flex items-center justify-between'>
              <h3 className='text-xl font-normal md:text-lg'>{ticket.name}</h3>
              <span
                className='w-[2.5rem] h-[2.5rem] rounded-lg grid place-items-center bg-dark-grey cursor-pointer md:w-[2rem] md:h-[2rem] md:min-w-[2rem] md:min-h-[2rem] md:cursor-pointer md:[&_svg]:w-[1rem] md:[&_svg]:h-[1rem]'
                onClick={() => {
                  setIsEditingTicket(true);
                  setSelectedTicketIndex(index);
                  setIsTicketCreationModalVisible(true);
                }}
              >
                <Icons.Edit />
              </span>
            </div>
            <div className='flex md:flex-col md:gap-1 md:mt-auto'>
              <div className='w-full flex flex-col items-center gap-2 md:items-start md:flex-row md:justify-between first:items-start last:flex-end md:last:items-start'>
                <span className='text-sm text-grey'>Price</span>
                <p>&#8358;{ticket.price.toLocaleString()}</p>
              </div>
              <div className='w-full flex flex-col items-center gap-2 md:items-start md:flex-row md:justify-between first:items-start last:flex-end md:last:items-start'>
                <span className='text-sm text-grey'>Total available</span>
                <p>{ticket.quantity}</p>
              </div>
              <div className='w-full flex flex-col items-center gap-2 md:items-start md:flex-row md:justify-between first:items-start last:flex-end md:last:items-start'>
                <span className='text-sm text-grey'>User per Ticket</span>
                <p>{ticket.numberOfUsers}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {eventRequest?.tickets.length == 0 && (
        <div className='flex flex-col items-center justify-center gap-4 w-1/2 m-auto mt-1 mb-4'>
          <p className='text-sm text-grey'>No tickets created yet</p>
        </div>
      )}

      {ticketValidationMessage && (
        <span
          className='text-xs text-[#eb485b] flex items-center'
          style={{ textAlign: "center" }}
        >
          {ticketValidationMessage.message}
        </span>
      )}

      <button
        className='tertiaryButton mx-auto'
        type='button'
        onClick={() => setIsTicketCreationModalVisible(true)}
      >
        Create Ticket
      </button>
      <br />
      {eventRequest?.tickets && eventRequest?.tickets.length > 0 && (
        <div className='flex-col md:flex-row gap-8 size-full mb-8'>
          <div className='w-full flex flex-col gap-4'>
            <div className='flex flex-col gap-4 md:flex-row md:gap-8'>
              <div className='createEventFormField'>
                <label htmlFor='date'>Purchase start date</label>
                <div className='' ref={purchaseStartDateRef}>
                  <BasicDateTimePicker
                    className='custom-datepicker'
                    defaultValue={
                      eventRequest?.purchaseStartDate
                        ? moment(eventRequest.purchaseStartDate)
                        : undefined
                    }
                    onChangeFn={(newValue) => {
                      // Set the form value
                      setEventRequest({
                        ...(eventRequest as EventRequest),
                        purchaseStartDate: formattedDateForApi(
                          newValue.toDate()
                        ),
                      });
                    }}
                    minDate={moment(new Date())}
                  />
                </div>
              </div>
              <div className='createEventFormField'>
                <label htmlFor='date'>Purchase date deadline</label>
                <div className='' ref={purchaseEndDateRef}>
                  <BasicDateTimePicker
                    className='custom-datepicker'
                    defaultValue={
                      eventRequest?.purchaseStartDate
                        ? moment(eventRequest.purchaseStartDate)
                        : undefined
                    }
                    onChangeFn={(newValue) => {
                      // Set the form value
                      setEventRequest({
                        ...(eventRequest as EventRequest),
                        purchaseEndDate: formattedDateForApi(newValue.toDate()),
                      });
                    }}
                    minDate={moment(eventRequest?.purchaseStartDate)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        <span className='mb-1 text-sm text-white'>Who pays for fee?</span>
        <div className='flex flex-row items-center justify-start gap-2 w-fit'>
          <span
            onClick={(e) => {
              e.preventDefault();
              setEventRequest({
                ...(eventRequest as EventRequest),
                organizerPaysFee: true,
              });
            }}
            className={`!p-2 !px-4 rounded-full bg-white text-dark-grey cursor-pointer ${
              !eventRequest?.organizerPaysFee ? "!bg-white/10 !text-white" : ""
            }`}
          >
            Organizer
          </span>
          <span
            onClick={(e) => {
              e.preventDefault();
              setEventRequest({
                ...(eventRequest as EventRequest),
                organizerPaysFee: false,
              });
            }}
            className={`!p-2 !px-4 rounded-full bg-white text-dark-grey cursor-pointer ${
              eventRequest?.organizerPaysFee ? "!bg-white/10 !text-white" : ""
            }`}
          >
            Customer
          </span>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsSection;
