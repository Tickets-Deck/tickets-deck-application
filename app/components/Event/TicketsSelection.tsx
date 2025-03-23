import {
  FunctionComponent,
  ReactElement,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { RetrievedTicketResponse } from "@/app/models/ITicket";
import { Theme } from "@/app/enums/Theme";
import { Icons } from "../ui/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

interface TicketsSelectionContainerProps {
  appTheme: Theme | null;
  eventTickets: RetrievedTicketResponse[];
  setEventTickets: Dispatch<
    SetStateAction<RetrievedTicketResponse[] | undefined>
  >;
  totalPrice: number;
  setTicketDeliveryModalIsVisible: Dispatch<SetStateAction<boolean>>;
  setTicketsSelectionContainerIsVisible: Dispatch<SetStateAction<boolean>>;
  setContactDetailsModalIsVisible: Dispatch<SetStateAction<boolean>>;
  timeLeftTillPurchaseStarts: string | null;
}

const TicketsSelectionContainer: FunctionComponent<
  TicketsSelectionContainerProps
> = ({
  appTheme,
  eventTickets,
  setEventTickets,
  totalPrice,
  setContactDetailsModalIsVisible,
  setTicketDeliveryModalIsVisible,
  setTicketsSelectionContainerIsVisible,
  timeLeftTillPurchaseStarts,
}): ReactElement => {
  const [totalSelectedTicketsCount, setTotalSelectedTicketsCount] = useState(0);
  const [userHasSelectedAtLeastOneTicket, setUserHasSelectedAtLeastOneTicket] =
    useState(false);

  const userInfo = useSelector(
    (state: RootState) => state.userCredentials.userInfo
  );

  function incrementTicket(selectedTicketType: RetrievedTicketResponse) {
    const updatedTickets = eventTickets?.map((ticketType) => {
      if (ticketType === selectedTicketType) {
        return {
          ...ticketType,
          selectedTickets: ticketType.selectedTickets + 1,
          isSelected: true,
        };
      }
      return ticketType;
    });
    setEventTickets(updatedTickets);
  }

  function decrementTicket(selectedTicketType: RetrievedTicketResponse) {
    const updatedTickets = eventTickets?.map((ticketType) => {
      if (ticketType === selectedTicketType) {
        if (selectedTicketType.selectedTickets == 1) {
          return {
            ...ticketType,
            selectedTickets: ticketType.selectedTickets - 1,
            isSelected: false,
          };
        }
        return {
          ...ticketType,
          selectedTickets: ticketType.selectedTickets - 1,
          isSelected: true,
        };
      }
      return ticketType;
    });
    setEventTickets(updatedTickets);
  }

  // useEffect hook to set total selected tickets count
  useEffect(() => {
    /**
     * the reduce function iterates through each ticket in the eventTickets array and adds up the selectedTickets count for each ticket.
     * The 0 passed as the second argument to reduce initializes the total variable to 0.
     */
    setTotalSelectedTicketsCount(
      eventTickets?.reduce(
        (total, ticket) => total + ticket.selectedTickets,
        0
      ) as number
    );
  }, [eventTickets]);

  useEffect(() => {
    if (eventTickets) {
      const selectedTickets = eventTickets.filter(
        (ticket) => ticket.isSelected
      );
      if (selectedTickets.length > 0) {
        setUserHasSelectedAtLeastOneTicket(true);
      } else {
        setUserHasSelectedAtLeastOneTicket(false);
      }
    }
  }, [eventTickets]);

  return (
    <div
      className={`className='rounded-[1rem]  w-full pt-8 px-6 pb-[2.5px] sm:pt-10  sm:w-[80%]' ${
        appTheme === Theme.Light
          ? "bg-[linear-gradient(180deg,var(--dark-grey)_7%,var(--black)_100%)]"
          : "bg-[linear-gradient(180deg,_rgba(49,49,49,0)_4.17%,_#313131_100%)]"
      }`}
    >
      <div className='flex flex-col items-center gap-0.5 mb-6 text-center'>
        <h3 className='text-lg font-medium text-white'>
          Select the tickets you would like to get, and the number for each.
        </h3>
        <p className='text-purple-grey'>You can select multiple tickets.</p>
      </div>
      <div className='flex flex-col sm:grid [grid-template-columns:repeat(auto-fill,_minmax(calc(50%-1.25rem),_1fr))] gap-5'>
        {eventTickets?.map((ticketType, index) => {
          if (!ticketType.visibility) {
            return;
          }

          const ticketIsSoldOut = ticketType.remainingTickets === 0;

          return (
            <div
              className={`flex flex-col gap-2 bg-primary-color-sub-50/10 p-5 rounded-lg border-2 border-solid border-transparent ${
                ticketIsSoldOut
                  ? "border-failed-color/0 pointer-events-none"
                  : ""
              } ${
                ticketType.selectedTickets > 0
                  ? "border-primary-color-sub-50/30"
                  : ""
              }`}
              key={index}
            >
              <div className='flex items-center justify-between'>
                <p className='text-sm'>{ticketType.name}</p>
                <h4 className='font-medium'>
                  {ticketType.price > 0 ? (
                    <>&#8358;{ticketType.price.toLocaleString()}</>
                  ) : (
                    "Free"
                  )}
                </h4>
              </div>
              {ticketIsSoldOut ? (
                <div className='bg-white rounded-md h-[30px] grid place-items-center mt-auto'>
                  <p className='text-sm text-failed-color'>Sold Out!</p>
                </div>
              ) : (
                <div className='flex items-center justify-between'>
                  <span
                    className='size-[1.875rem] rounded-[0.25rem] bg-primary-color-sub-50/10 hover:bg-primary-color-sub-50/40'
                    onClick={() => {
                      ticketType.selectedTickets > 0 &&
                        decrementTicket(ticketType);
                    }}
                  >
                    -
                  </span>
                  <p>
                    {ticketType.selectedTickets}{" "}
                    {ticketType.selectedTickets > 1 ? "tickets" : "ticket"}
                  </p>
                  <span onClick={() => incrementTicket(ticketType)}>+</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className='flex sm:items-end justify-between my-4 flex-col items-start gap-1 sm:flex-row sm:gap-0'>
        <div className='flex flex-col gap-0.5'>
          <p className='text-sm font-light text-purple-grey'>
            {totalSelectedTicketsCount}{" "}
            {totalSelectedTicketsCount > 1 ? "tickets" : "ticket"} selected
          </p>
          <div className='flex items-center gap-[0.625rem]'>
            <p className='text-primary-color-sub-50'>Total Price:</p>
            <h1 className='text-2xl font-medium'>
              &#8358;{totalPrice?.toLocaleString()}
            </h1>
          </div>
        </div>
        <div className='flex w-full md:w-auto justify-between md:justify-normal gap-4 md:gap-2 items-center'>
          {timeLeftTillPurchaseStarts ? (
            <div className='flex flex-row mt-0 bg-white/10 border-[1.5px] border-primary-color-sub/70 p-2 px-4 rounded-lg w-fit'>
              <span>Purchase starts {timeLeftTillPurchaseStarts}</span>
            </div>
          ) : (
            <button
              className='size-fit rounded-[0.625rem] cursor-pointer text-sm py-[0.8rem] px-[1.6rem] border-none bg-primary-color text-white flex items-center gap-1'
              onClick={() => {
                if (!userInfo) {
                  setContactDetailsModalIsVisible(true);
                  return;
                }
                setTicketDeliveryModalIsVisible(true);
              }}
              disabled={!userHasSelectedAtLeastOneTicket}
            >
              Purchase {totalSelectedTicketsCount > 1 ? "tickets" : "ticket"}
            </button>
          )}
          <button
            className='h-fit w-[3.5rem] md:size-fit rounded-[0.625rem] cursor-pointer text-sm p-[0.65rem] hover:bg-failed-color [&_:hover_svg_path]:stroke-white border-none bg-primary-color [&_svg]:size-6 text-white flex items-center gap-1'
            onClick={() => setTicketsSelectionContainerIsVisible(false)}
          >
            <Icons.Close />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketsSelectionContainer;
