import { Dispatch, FunctionComponent, ReactElement, SetStateAction, useEffect, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { CloseIcon } from "../SVGs/SVGicons";
import { MultipleTickets } from "@/app/models/ICheckIn";
import { useCheckInMultipleTicketOrders } from "@/app/api/apiClient";
import { toast } from "sonner";
import Button from "../ui/button";

interface CheckInModalProps {
    visibility: boolean
    setVisibility: Dispatch<SetStateAction<boolean>>
    multipleTickets: MultipleTickets[] | undefined
    ticketOrderAccessCode: string | null
    eventId: string | null
}

const CheckInModal: FunctionComponent<CheckInModalProps> = (
    { visibility, setVisibility, multipleTickets, ticketOrderAccessCode, eventId }): ReactElement => {
    console.log("🚀 ~ eventId:", eventId)
    console.log("🚀 ~ ticketOrderAccessCode:", ticketOrderAccessCode)

    const checkInMultipleTicketOrders = useCheckInMultipleTicketOrders();

    const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
    const [isCheckingIn, setIsCheckingIn] = useState(false);

    const handleCheckInMultipleTicketOrders = async () => {

        setIsCheckingIn(true);

        await checkInMultipleTicketOrders(ticketOrderAccessCode as string, eventId as string, selectedTickets)
            .then((response) => {
                console.log("Check in response: ", response);
                toast.success(selectedTickets.length > 1 ? "Tickets checked in successfully" : "Ticket checked in successfully");
                setSelectedTickets([]);
                setVisibility(false);
            })
            .catch((error) => {
                console.log("Check in error: ", error);
            })
            .finally(() => {
                setIsCheckingIn(false);
            })
    };

    useEffect(() => {
        console.log("Selected tickets: ", selectedTickets);
    }, [selectedTickets])

    return (
        <ModalWrapper visibility={visibility} setVisibility={setVisibility} styles={{ backgroundColor: 'transparent', color: '#fff', width: "fit-content" }}>
            <div className="w-full max-w-full md:w-[400px] md:max-w-[400px] p-6 rounded-2xl bg-container-grey">
                <div className="flex flex-row justify-between items-center mb-2">
                    <div className="flex flex-col items-start">
                        <h3>Multiple Tickets</h3>
                        <p className="text-sm text-white/60">
                            Please select the tickets you want to check in.
                        </p>
                    </div>
                    <span
                        className="ml-auto w-8 h-8 min-w-8 min-h-8 rounded-full grid place-items-center cursor-pointer hover:bg-white/10"
                        onClick={() => setVisibility(false)}>
                        <CloseIcon stroke="#fff" />
                    </span>
                </div>
                <div className="flex flex-col gap-2">
                    {
                        multipleTickets?.map((ticket, index) => (
                            <div key={index} className="relative flex flex-row justify-between items-center bg-white/10 p-2 px-3 rounded-lg overflow-hidden">
                                <p className="z-20">{ticket.name}</p>
                                <input
                                    type="checkbox"
                                    disabled={ticket.checkedIn}
                                    className="absolute w-full h-full cursor-pointer top-0 left-0 m-auto appearance-none checked:bg-primary-color checked:rounded disabled:bg-primary-color disabled:pointer-events-none"
                                    onClick={() => {
                                        if (selectedTickets.includes(ticket.id)) {
                                            setSelectedTickets(selectedTickets.filter(selectedTicket => selectedTicket !== ticket.id));
                                            return;
                                        }
                                        setSelectedTickets([...selectedTickets, ticket.id])
                                    }}
                                />
                            </div>
                        ))
                    }
                    <p className="text-sm">
                        The tickets marked with purple are the tickets you have selected to check in.
                    </p>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                    <button
                        onClick={() => setVisibility(false)}
                        className="text-sm bg-white/5 text-white px-4 py-2 rounded-full hover:bg-white/10 transition-all">
                        Close
                    </button>
                    <Button
                        isLoading={isCheckingIn}
                        onClick={() => handleCheckInMultipleTicketOrders()}
                        className="text-sm !bg-white !text-black px-4 py-2 rounded-full hover:bg-white/80 transition-all">
                        Check In
                    </Button>
                </div>
            </div>
        </ModalWrapper>
    );
}

export default CheckInModal;