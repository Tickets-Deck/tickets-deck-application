"use client";
import {
    ChangeEvent,
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";
import ModalWrapper from "./ModalWrapper";
import Select from "@mui/material/Select";
import { MenuItem } from "@mui/material";
import countries from "@/app/constants/countries";
import Button from "../ui/button";
import { UserCredentialsUpdateRequest } from "@/app/models/IUser";
import { useUpdateUserInformation } from "@/app/api/apiClient";
import { RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { updateUserCredentials } from "@/app/redux/features/user/userSlice";
import { catchError } from "@/app/constants/catchError";
import { ToastContext } from "@/app/extensions/toast";
// import { Twemoji } from "react-emoji-render";

interface PhoneNumberProps {
    visibility: boolean;
    setVisibility: Dispatch<SetStateAction<boolean>>;
}

const PhoneNumberModal: FunctionComponent<PhoneNumberProps> = ({
    visibility,
    setVisibility,
}) => {
    const updateUserInformation = useUpdateUserInformation();
    const userInfo = useSelector((state: RootState) => state.userCredentials.userInfo);
    const dispatch = useDispatch();
    const toastHandler = useContext(ToastContext);

    const [phoneNumber, setPhoneNumber] = useState({
        code: "+234",
        number: "",
    });
    const [hasFinishedTyping, setHasFinishedTyping] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [isUpdatingUserPhoneNumber, setIsUpdatingUserPhoneNumber] = useState(false);

    const handleSubmitNumber = async () => {
        const phone = phoneNumber.code + phoneNumber.number;

        // Start loader
        setIsUpdatingUserPhoneNumber(true);

        const data: UserCredentialsUpdateRequest = {
            email: null,
            firstName: null,
            lastName: null,
            phone,
            facebookUrl: null,
            instagramUrl: null,
            twitterUrl: null,
        };

        // Update user information
        await updateUserInformation(userInfo?.id as string, data)
            .then(async (response) => {
                toastHandler?.logSuccess("Success", "Phone number added successfully");

                // close modal
                setVisibility(false);

                // Save to redux
                dispatch(updateUserCredentials(response.data));
            })
            .catch((error) => {
                catchError(error);
            })
            .finally(() => {
                setIsUpdatingUserPhoneNumber(false);
            })

    };

    const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Ensure no leading zeros
        if (value.length === 0 || /^[1-9][0-9]*$/.test(value)) {
            setPhoneNumber({ ...phoneNumber, number: value.slice(0, 11) });
        }
    };

    // remove error text after 5 seconds
    useEffect(() => {
        if (errorText) setTimeout(() => setErrorText(""), 5000);
    }, [errorText]);

    return (
        <>
            <ModalWrapper
                visibility={visibility}
                setVisibility={setVisibility}
                disallowOverlayFunction
                styles={{ width: "fit-content", background: "transparent" }}
            >
                <div className='bg-dark-grey-2 text-grey p-6 rounded-2xl w-[30rem] flex flex-col gap-0 border border-[#424242] transition-all max-w-full'>
                    <div className='flex flex-col gap-1 mb-3'>
                        <h2 className='capitalize'>Add your contact number to proceed</h2>
                        <p className='text-sm text-text-grey'>
                            Before creating your first event, we need a contact number to reach
                            you. This helps us ensure seamless communication for event updates,
                            support, and any important notifications. Please enter your phone
                            number to continue.
                        </p>
                    </div>
                    {errorText && (
                        <p className='text-red-600 text-center text-sm'>{errorText}</p>
                    )}
                    {!hasFinishedTyping && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (phoneNumber.number.length > 6) setHasFinishedTyping(true);
                                else setErrorText("Invalid number, please try again");
                            }}
                            className='flex flex-col gap-4 items-center'
                        >
                            <div className='flex gap-3 w-full'>
                                <Select
                                    defaultValue={phoneNumber.code}
                                    onChange={(e) =>
                                        setPhoneNumber({ ...phoneNumber, code: e.target.value })
                                    }
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                mt: "10px",
                                                maxHeight: 300,
                                                backgroundColor: "#313131",
                                                color: "#f2f2f2",
                                                "&::-webkit-scrollbar": {
                                                    width: "8px",
                                                },
                                                "&::-webkit-scrollbar-track": {
                                                    backgroundColor: "#424242",
                                                },
                                                "&::-webkit-scrollbar-thumb": {
                                                    backgroundColor: "#f2f2f2",
                                                    borderRadius: "4px",
                                                },
                                                "&::-webkit-scrollbar-thumb:hover": {
                                                    backgroundColor: "#e0e0e0",
                                                },
                                            },
                                        },
                                        anchorOrigin: {
                                            vertical: "bottom",
                                            horizontal: "left",
                                        },
                                        transformOrigin: {
                                            vertical: "top",
                                            horizontal: "left",
                                        },
                                    }}
                                    sx={{
                                        backgroundColor: "#313131",
                                        color: "#f2f2f2",
                                        borderRadius: "8px",
                                        maxWidth: "10rem",
                                        textWrap: "wrap",
                                        fontSize: "12px",

                                        "& .MuiSelect-icon": {
                                            color: "#f2f2f2",
                                        },
                                    }}
                                >
                                    {countries.map((country) => (
                                        <MenuItem
                                            value={country.dialCode}
                                            sx={{
                                                color: "#f2f2f2",
                                                background: "#313131",
                                                padding: "0.5rem",
                                                "&:hover": {
                                                    background: "#464646",
                                                },
                                                "&.Mui-selected": {
                                                    background: "#464646",
                                                },
                                                "&.Mui-selected:hover": {
                                                    background: "#464646",
                                                },
                                            }}
                                            className='p-2 text-left w-[12rem] text-sm'
                                        >
                                            <p className='inline-flex gap-2 items-center'>
                                                <span>
                                                    {country.emoji}
                                                </span>
                                                {/* <Twemoji
                          className='[&_img]:max-w-[1rem]'
                          onlyEmojiClassName=''
                        >
                          {country.emoji}
                        </Twemoji> */}
                                                <span className='inline-block'>
                                                    {country.code} ({country.dialCode})
                                                </span>
                                            </p>
                                        </MenuItem>
                                    ))}
                                </Select>
                                <input
                                    type='tel'
                                    value={phoneNumber.number}
                                    onChange={handlePhoneNumberChange}
                                    placeholder='Your Number...'
                                    className='bg-container-grey text-grey p-2 px-3 rounded-[8px] w-full text-sm placeholder:text-sm placeholder:text-text-grey'
                                />
                                <input list="countries" id="ice-cream-choice" name="ice-cream-choice" />

                                <datalist id="countries">
                                    <option value="Chocolate"></option>
                                    <option value="Coconut"></option>
                                    <option value="Mint"></option>
                                    <option value="Strawberry"></option>
                                    <option value="Vanilla"></option>
                                </datalist>
                            </div>
                            <Button
                                type='submit'
                                className='bg-grey-bg !text-dark-grey'
                            >
                                Proceed
                            </Button>
                        </form>
                    )}
                    {hasFinishedTyping && (
                        <div className='flex flex-col w-full gap-6 align items-center'>
                            <p className='inline-flex items-center gap-2 p-3 px-4 w-fit bg-container-grey rounded-[8px]'>
                                {countries.map((country) => {
                                    return (
                                        country.dialCode === phoneNumber.code && (
                                            <span>
                                                {country.emoji}
                                            </span>
                                            //   <Twemoji className='inline-block'>
                                            //     {country.emoji}
                                            //   </Twemoji>
                                        )
                                    );
                                })}{" "}
                                <span className='inline-block'>
                                    {phoneNumber.code} {phoneNumber.number}
                                </span>
                            </p>
                            <div className='flex gap-4'>
                                <button
                                    className='bg-grey-bg text-dark-grey rounded-full px-6 py-2'
                                    onClick={(e) => setHasFinishedTyping(false)}
                                >
                                    Back
                                </button>
                                <Button
                                    isLoading={isUpdatingUserPhoneNumber}
                                    className='bg-grey-bg !text-dark-grey'
                                    onClick={handleSubmitNumber}
                                >
                                    Confirm
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </ModalWrapper>
        </>
    );
};
export default PhoneNumberModal;
