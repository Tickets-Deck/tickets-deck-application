"use client";
import ModalWrapper from "./ModalWrapper";
import { SetStateAction, Dispatch, useState } from "react";
import { Icons } from "../ui/icons";
import { useToast } from "@/app/context/ToastCardContext";
import { WalletBalance } from "@/app/models/IWallet";

const PayoutModal = ({
  visibility,
  setVisibility,
  walletBalance,
  onRequestPayout,
}: {
  visibility: boolean;
  setVisibility: Dispatch<SetStateAction<boolean>>;
  walletBalance: WalletBalance | null;
  onRequestPayout: (amount: number) => Promise<void>;
}) => {
  const toastHandler = useToast();
  const balance = walletBalance?.balance || 0;
  const [amount, setAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <ModalWrapper
      visibility={visibility}
      setVisibility={setVisibility}
      styles={{
        backgroundColor: "transparent",
        color: "#fff",
        width: "fit-content",
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (amount > balance) {
            toastHandler.logError(
              "Error",
              "Amount cannot be greater than your available balance"
            );
            return;
          }

          if (amount <= 0) {
            toastHandler.logError(
              "Error",
              "Amount cannot be less than or equal to zero"
            );
            return;
          }

          setIsSubmitting(true);
          onRequestPayout(amount)
            .then(() => {
              setAmount(0);
              setVisibility(false);
            })
            .catch((error) => {
              toastHandler.logError("Error", error.message);
            })
            .finally(() => {
              setIsSubmitting(false);
            });
        }}
        className='bg-dark-grey-2 text-white rounded-[8px] border border-primary-color-sub/20 w-[90vw] sm:w-[80vw] max-w-[500px] p-6 flex flex-col gap-6'
      >
        <div className='flex justify-between items-center'>
          <p className='text-xl font-medium'>Request Payout</p>
          <button type='button' onClick={() => setVisibility(false)}>
            <Icons.Close className='size-[24px]' stroke='#717171' />
          </button>
        </div>
        <div className='flex justify-between items-center'>
          <p className='text-sm text-text-grey'>Available Balance</p>
          <p className='text-lg'>₦{balance.toLocaleString()}</p>
        </div>
        <div className='flex flex-col gap-0.5'>
          <div className='flex justify-between items-center'>
            <p className='font-medium'>Amount</p>
            <button
              onClick={() => setAmount(balance)}
              className='text-xs text-primary-color'
              type='button'
            >
              Request all
            </button>
          </div>
          <label
            htmlFor='amount'
            className='rounded-lg p-2.5 w-full flex gap-2 bg-container-grey border border-gray-500/30'
          >
            <p>₦</p>
            <input
              value={amount}
              required
              onChange={(e) => {
                const sanitizedValue = e.target.value.replace(/[^0-9]/g, "");
                const value = parseFloat(sanitizedValue);
                if (isNaN(value)) {
                  setAmount(0);
                  return;
                }
                setAmount(value);
              }}
              name='amount'
              id='amount'
              type='text'
              className='w-full bg-transparent focus:outline-none'
            />
          </label>
          <p
            className={`text-xs transition-opacity text-red-800 ${
              amount > balance ? "opacity-100" : "opacity-0"
            }`}
          >
            Amount cannot be greater than your available balance
          </p>
        </div>
        <div className='bg-container-grey rounded-lg p-5 text-base flex flex-col gap-5 w-full'>
          <div className='flex justify-between items-center'>
            <p className='text-text-grey'>Payment Method</p>
            <p>Bank Transfer</p>
          </div>
          <div className='flex justify-between items-center'>
            <p className='text-text-grey'>Processing Time</p>
            <p>1-3 business days</p>
          </div>
        </div>
        <button
          type='submit'
          disabled={isSubmitting}
          className={`bg-primary-color text-white disabled:opacity-60   rounded-lg p-4 w-full mt-5 ${
            isSubmitting ? "grid place-items-center" : ""
          }`}
        >
          {isSubmitting ? (
            <div className='size-6 border-2 border-t-white rounded-full animate-spin border-transparent'></div>
          ) : (
            "Request Payout"
          )}
        </button>
      </form>
    </ModalWrapper>
  );
};
export default PayoutModal;
