import { Dispatch, FunctionComponent, ReactElement, SetStateAction, useEffect, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { Icons } from "../ui/icons";
import { MultipleTickets } from "@/app/models/ICheckIn";
import { useCheckInMultipleTicketOrders } from "@/app/api/apiClient";
import Button from "../ui/button";
import { useSession } from "next-auth/react";
import { useToast } from "@/app/context/ToastCardContext";

interface CheckInModalProps {
    visibility: boolean
    setVisibility: Dispatch<SetStateAction<boolean>>
    multipleTickets: MultipleTickets[] | undefined
    ticketOrderAccessCode: string | null
    eventId: string | null
}

const CheckInModal: FunctionComponent<CheckInModalProps> = (
    { visibility, setVisibility, multipleTickets, ticketOrderAccessCode, eventId }): ReactElement => {

    const checkInMultipleTicketOrders = useCheckInMultipleTicketOrders();
    const { data: session } = useSession();
    const user = session?.user;

    const toasthandler = useToast();

    const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
    const [isCheckingIn, setIsCheckingIn] = useState(false);

    const handleCheckInMultipleTicketOrders = async () => {
        if (selectedTickets.length === 0) {
            toasthandler.logError("No ticket selected", "Please select at least one ticket to check in");
            return;
        }

        setIsCheckingIn(true);

        await checkInMultipleTicketOrders(user?.token as string, ticketOrderAccessCode as string, eventId as string, selectedTickets)
            .then((response) => {
                toasthandler.logSuccess("Check In Successful", selectedTickets.length > 1 ? "Tickets checked in successfully" : "Ticket checked in successfully");
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
                <div className="flex flex-row justify-between items-center mb-4">
                    <div className="flex flex-col items-start">
                        <h3>Multiple Tickets</h3>
                        <p className="text-sm text-white/60">
                            Please select the tickets you want to check in.
                        </p>
                    </div>
                    <span
                        className="ml-auto w-8 h-8 min-w-8 min-h-8 rounded-full grid place-items-center cursor-pointer hover:bg-white/10"
                        onClick={() => setVisibility(false)}>
                        <Icons.Close stroke="#fff" />
                    </span>
                </div>
                <div className="flex flex-col gap-2">
                    {
                        multipleTickets?.map((ticket, index) => (
                            <div>
                                <p className="text-sm">{ticket.associatedEmail}</p>
                                <div key={index} className="relative flex flex-row justify-between items-center bg-white/10 p-2 px-3 rounded-lg overflow-hidden">
                                    <p className="z-20">{ticket.name}</p>
                                    <input
                                        type="checkbox"
                                        disabled={ticket.checkedIn}
                                        className="absolute w-full h-full cursor-pointer top-0 left-0 m-auto appearance-none checked:bg-primary-color checked:rounded disabled:bg-green-500 disabled:pointer-events-none"
                                        onClick={() => {
                                            if (selectedTickets.includes(ticket.id)) {
                                                setSelectedTickets(selectedTickets.filter(selectedTicket => selectedTicket !== ticket.id));
                                                return;
                                            }
                                            setSelectedTickets([...selectedTickets, ticket.id])
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                    }
                    <p className="text-sm mt-2">
                        The tickets marked with purple are the tickets you have selected to check in. <br /> The green tickets are already checked in.
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
                        disabled={isCheckingIn || selectedTickets.length === 0}
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