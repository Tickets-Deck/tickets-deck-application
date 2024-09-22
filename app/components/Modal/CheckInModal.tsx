import { Dispatch, FunctionComponent, ReactElement, SetStateAction } from "react";
import ModalWrapper from "./ModalWrapper";
import styles from "@/app/styles/promptModal.module.scss";
import { CloseIcon } from "../SVGs/SVGicons";
import Link from "next/link";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";

interface CheckInModalProps {
    visibility: boolean
    setVisibility: Dispatch<SetStateAction<boolean>>
    forGeneralMessage?: boolean
    name: string | null | undefined
}

const CheckInModal: FunctionComponent<CheckInModalProps> = (
    { visibility, setVisibility, forGeneralMessage, name }): ReactElement => {

    return (
        <ModalWrapper visibility={visibility} setVisibility={setVisibility} styles={{ backgroundColor: 'transparent', color: '#fff', width: "fit-content" }}>
            <div className="w-full max-w-full md:w-[400px] md:max-w-[400px] p-6 rounded-2xl bg-container-grey">
                <div className="flex flex-row justify-between items-center mb-2">
                    <div className="flex flex-col items-start">
                        <h3>Hello {name}</h3>
                    </div>
                    <span
                        className="ml-auto w-8 h-8 min-w-8 min-h-8 rounded-full grid place-items-center cursor-pointer hover:bg-white/10"
                        onClick={() => setVisibility(false)}>
                        <CloseIcon stroke="#fff" />
                    </span>
                </div>
                {/* <div className="flex flex-col gap-2">
                    <p className="text-sm">
                        Your event Parte after parte has ended. You successfully checked in 357 attendees.
                    </p>
                </div> */}
                <div className="flex flex-col gap-2">
                    <p className="text-sm">
                        It's 14 days till your event Parte after parte starts.
                    </p>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                    <button
                        onClick={() => setVisibility(false)}
                        className="text-sm bg-white text-black px-4 py-2 rounded-full hover:bg-white/80 transition-all">
                        Okay, Got it.
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
}

export default CheckInModal;