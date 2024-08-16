import { FunctionComponent, ReactElement, Dispatch, SetStateAction } from "react";
import ModalWrapper from "./ModalWrapper";
import { CloseIcon } from "../SVGs/SVGicons";
import Link from "next/link";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";

interface PrimaryEmailConfirmationModalProps {
    visibility: boolean
    setVisibility: Dispatch<SetStateAction<boolean>>
    email: string
    suggestedPrimaryEmailAndCreateOrder: (email: string) => void
}

const PrimaryEmailConfirmationModal: FunctionComponent<PrimaryEmailConfirmationModalProps> = (
    { visibility, setVisibility, email, suggestedPrimaryEmailAndCreateOrder }): ReactElement => {
    return (
        <ModalWrapper visibility={visibility} setVisibility={setVisibility} styles={{ backgroundColor: 'transparent', color: '#fff', width: "fit-content" }}>
            <div className="w-full max-w-full md:w-96 md:max-w-96 p-6 rounded-2xl bg-container-grey">
                <div className="flex flex-row justify-between items-center mb-2">
                    <div className="flex flex-col items-start">
                        <h3 className="font-medium">Specify primary email</h3>
                    </div>
                    <span
                        className="ml-auto w-8 h-8 min-w-8 min-h-8 rounded-full grid place-items-center cursor-pointer hover:bg-white/10"
                        onClick={() => setVisibility(false)}>
                        <CloseIcon stroke="#fff" />
                    </span>
                </div>
                <div className="flex flex-col">
                    <p className="text-sm">
                        You haven't specified a primary email address yet.
                        Do you want <span className="text-purple-200">{email}</span> to be your primary email address?
                    </p>
                    <span className="text-sm text-white/40">
                        Note that the primary email address is the email address that will get all tickets
                    </span>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                    <button
                        className="text-sm bg-transparent text-white px-4 py-2 rounded-full"
                        onClick={() => setVisibility(false)}>
                        No
                    </button>
                    <button
                        className="text-sm bg-white text-black/80 px-4 py-2 rounded-full"
                        onClick={() => suggestedPrimaryEmailAndCreateOrder(email)}>
                        Yes
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
}

export default PrimaryEmailConfirmationModal;