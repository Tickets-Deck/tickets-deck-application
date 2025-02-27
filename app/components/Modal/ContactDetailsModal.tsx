import { FunctionComponent, ReactElement, Dispatch, SetStateAction } from "react";
import ModalWrapper from "./ModalWrapper";
import { Icons } from "../ui/icons";
import { CustomerContactDetails } from "@/app/models/IUser";
import Link from "next/link";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { toast } from "sonner";

interface ContactDetailsModalProps {
    visibility: boolean
    setVisibility: Dispatch<SetStateAction<boolean>>
    setContactDetails: Dispatch<SetStateAction<CustomerContactDetails | undefined>>
    contactDetails: CustomerContactDetails | undefined
    setTicketDeliveryModalIsVisible: Dispatch<SetStateAction<boolean>>
}

const ContactDetailsModal: FunctionComponent<ContactDetailsModalProps> = (
    { visibility, setVisibility, contactDetails, setContactDetails,
        setTicketDeliveryModalIsVisible
    }): ReactElement => {

    const validateFields = () => {
        if (!contactDetails?.firstName || !contactDetails?.lastName || !contactDetails?.phone) {
            toast.error("Please fill in all fields to continue");
            return false
        }

        if (contactDetails?.phone.length !== 11) {
            toast.error("Please enter a valid phone number");
            return false
        }

        setContactDetails({...contactDetails as CustomerContactDetails, phone: `+234${contactDetails?.phone.replace(/^0/, '')}`})

        return true
    }

    return (
        <ModalWrapper visibility={visibility} setVisibility={setVisibility} styles={{ backgroundColor: 'transparent', color: '#fff', width: "fit-content" }}>
            <div className="w-full max-w-full md:w-[400px] md:max-w-[400px] p-6 rounded-2xl bg-container-grey">
                <div className="flex flex-row justify-between items-center mb-2">
                    <div className="flex flex-col items-start">
                        <h3 className="font-medium">Who do we contact?</h3>
                    </div>
                    <span
                        className="ml-auto w-8 h-8 min-w-8 min-h-8 rounded-full grid place-items-center cursor-pointer hover:bg-white/10"
                        onClick={() => setVisibility(false)}>
                        <Icons.Close stroke="#fff" />
                    </span>
                </div>
                <div className="flex flex-col mb-3">
                    <p className="text-sm">
                        Please provide your contact details so we can reach you if there are any issues with your tickets.
                    </p>
                    <span className="text-sm text-white/40">
                        To avoid this step in the future, you can <Link className=" text-primary-color-sub" href={ApplicationRoutes.SignUp} target="_blank">create an account.</Link>
                    </span>
                </div>

                <div className="flex flex-col gap-2 [&_input]:outline-none">
                    <input
                        className="w-full p-2 border-[1px] border-solid border-grey/30 bg-grey/10 rounded-lg"
                        type="text"
                        placeholder="First name"
                        name={"firstName"}
                        onChange={(e) => setContactDetails({ ...contactDetails as CustomerContactDetails, firstName: e.target.value })}
                    />
                    <input
                        className="w-full p-2 border-[1px] border-solid border-grey/30 bg-grey/10 rounded-lg"
                        type="text"
                        placeholder="Last name"
                        name={"lastName"}
                        onChange={(e) => setContactDetails({ ...contactDetails as CustomerContactDetails, lastName: e.target.value })}
                    />
                    <input
                        className="w-full p-2 border-[1px] border-solid border-grey/30 bg-grey/10 rounded-lg"
                        type="text"
                        placeholder="Phone number"
                        maxLength={11}
                        name={"phone"}
                        onChange={(e) => setContactDetails({ ...contactDetails as CustomerContactDetails, phone: e.target.value })}
                    />
                </div>

                <div className="flex justify-end mt-4 gap-2">
                    {/* <button
                        className="text-sm bg-transparent text-white px-4 py-2 rounded-full"
                        onClick={() => setVisibility(false)}>
                        Go back
                    </button> */}
                    <button
                        disabled={!contactDetails?.firstName || !contactDetails?.lastName || !contactDetails?.phone}
                        className="text-sm bg-white text-black/80 px-4 py-2 rounded-full hover:bg-white/80 transition-all"
                        onClick={() => {
                            if (!validateFields()) return;
                            setVisibility(false);
                            setTicketDeliveryModalIsVisible(true);
                        }}>
                        Continue
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
}

export default ContactDetailsModal;