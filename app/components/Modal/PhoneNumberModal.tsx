"use client";
import {
  ChangeEvent,
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import ModalWrapper from "./ModalWrapper";
import Select from "@mui/material/Select";
import { MenuItem } from "@mui/material";
import countries from "@/app/mock/countries";
import { Twemoji } from "react-emoji-render";

interface PhoneNumberProps {
  visibility: boolean;
  setVisibility: Dispatch<SetStateAction<boolean>>;
}

const PhoneNumberModal: FunctionComponent<PhoneNumberProps> = ({
  visibility,
  setVisibility,
}) => {
  const [phoneNumber, setPhoneNumber] = useState({
    code: "+234",
    number: "",
  });
  const [isFinished, setIsFinished] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleSubmitNumber = () => {
    // ADD NUMBER TO USER DATA FUNCTIONALITY.
    console.log(phoneNumber.code + phoneNumber.number);
    setVisibility(false);
  };

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Ensure no leading zeros
    if (value.length === 0 || /^[1-9][0-9]*$/.test(value)) {
      setPhoneNumber({ ...phoneNumber, number: value.slice(0, 15) });
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
        <div className='bg-dark-grey-2 text-grey p-6 rounded-2xl w-[30rem] flex flex-col gap-4 border border-[#424242] transition-all max-w-full'>
          <h2 className='capitalize '>Add your contact number to proceed</h2>
          <p className='text-xs text-text-grey'>
            Before creating your first event, we need a contact number to reach
            you. This helps us ensure seamless communication for event updates,
            support, and any important notifications. Please enter your phone
            number to continue.
          </p>
          {errorText && (
            <p className='text-red-600 text-center text-sm'>{errorText}</p>
          )}
          {!isFinished && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (phoneNumber.number.length > 6) setIsFinished(true);
                else setErrorText("Invalid number, please try again");
              }}
              className='flex flex-col gap-4 items-center'
            >
              <div className='flex gap-3'>
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
                        <Twemoji
                          className='[&_img]:max-w-[1rem]'
                          onlyEmojiClassName=''
                        >
                          {country.emoji}
                        </Twemoji>
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
                  className='bg-container-grey text-grey p-2 rounded-[8px] w-full text-sm placeholder:text-sm placeholder:text-text-grey'
                />
              </div>
              <button
                type='submit'
                className='bg-grey-bg text-dark-grey rounded-full px-6 py-2'
              >
                Proceed
              </button>
            </form>
          )}
          {isFinished && (
            <div className='flex flex-col w-full gap-6 align items-center'>
              <p className='inline-flex items-center gap-2 p-3 w-[13rem] bg-container-grey rounded-[8px]'>
                {countries.map((country) => {
                  return (
                    country.dialCode === phoneNumber.code && (
                      <Twemoji className='inline-block'>
                        {country.emoji}
                      </Twemoji>
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
                  onClick={(e) => setIsFinished(false)}
                >
                  Back
                </button>
                <button
                  className='bg-grey-bg text-dark-grey rounded-full px-6 py-2'
                  onClick={handleSubmitNumber}
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </ModalWrapper>
    </>
  );
};
export default PhoneNumberModal;
