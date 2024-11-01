import { Dispatch, FunctionComponent, ReactElement, SetStateAction, useEffect, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import styles from "@/app/styles/promptModal.module.scss";
import { CloseIcon } from "../SVGs/SVGicons";
import Link from "next/link";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import Button from "../ui/button";

interface WitdrawalModalProps {
    visibility: boolean
    setVisibility: Dispatch<SetStateAction<boolean>>
    isBankAccountAdded: boolean
    isProcessingWithdrawal: boolean
    withdrawalAmount: number | undefined
    setWithdrawalAmount: Dispatch<SetStateAction<number | undefined>>
    handleInitiateWithdrawal: () => Promise<void>
}

const WitdrawalModal: FunctionComponent<WitdrawalModalProps> = (
    { visibility, setVisibility, isBankAccountAdded, handleInitiateWithdrawal,
        isProcessingWithdrawal, withdrawalAmount: amount, setWithdrawalAmount: setAmount
    }): ReactElement => {

    return (
        <ModalWrapper visibility={visibility} setVisibility={setVisibility} styles={{ backgroundColor: 'transparent', color: '#fff', width: "fit-content" }}>
            {
                isBankAccountAdded ?
                    <div className={styles.promptModal}>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col items-start">
                                <h3 className="texxt-base font-medium mb-0">Withdrawal Request</h3>
                            </div>
                            <span
                                className="w-8 h-8 min-w-8 min-h-8 rounded-full grid place-items-center cursor-pointer bg-white/20 hover:bg-white/10"
                                onClick={() => setVisibility(false)}>
                                <CloseIcon stroke="#fff" />
                            </span>
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                            <div>
                                <label htmlFor="amount" className="text-sm">Enter Amount</label>
                                <input
                                    value={amount ?? ""}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        console.log({ value });
                                        if (isNaN(value)) return;
                                        // if (value < 0 || value > 500000) return;
                                        if (value < 0) return;
                                        setAmount(value);
                                    }}
                                    className="p-2 border-[1px] border-solid border-grey/30 bg-grey/10 rounded-lg w-full" />
                            </div>
                            {/* <p className="text-sm text-white/50 font-light">
                                Please note that a withdrawal fee of 1% will be charged on all withdrawals.
                            </p> */}
                            <p className="text-sm text-white/50 font-light">
                                Please note that withdrawals are processed within 24 hours.
                            </p>
                        </div>
                        <div className={styles.actionButton}>
                            <Button
                                isLoading={isProcessingWithdrawal}
                                onClick={() => handleInitiateWithdrawal()}>
                                Witdraw
                            </Button>
                        </div>
                    </div> :
                    <div className={styles.promptModal}>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col items-start">
                                <h3 className="texxt-base font-medium mb-0">Hello there</h3>
                            </div>
                            <span
                                className="w-8 h-8 min-w-8 min-h-8 rounded-full grid place-items-center cursor-pointer bg-white/20 hover:bg-white/10"
                                onClick={() => setVisibility(false)}>
                                <CloseIcon stroke="#fff" />
                            </span>
                        </div>
                        <div className={styles.content}>
                            <p>
                                You have not added a bank account yet. Please add a bank account to withdraw funds.
                            </p>
                            <p>
                                You can add a bank account by clicking on the "Add Bank Account" button.
                            </p>
                        </div>
                        <div className="flex flex-row mt-4 gap-2">
                            <button
                                className="py-2 px-4 w-fit h-fit text-sm rounded-full whitespace-nowrap bg-failed-color text-white hover:opacity-50"
                                onClick={() => setVisibility(false)}>
                                Cancel
                            </button>
                            <Link
                                href={ApplicationRoutes.Profile}
                                className="py-2 px-4 w-fit h-fit text-sm rounded-full whitespace-nowrap bg-white text-dark-grey hover:opacity-50"
                                onClick={() => setVisibility(false)}>
                                Add Bank Account
                            </Link>
                        </div>
                    </div>
            }
        </ModalWrapper>
    );
}

export default WitdrawalModal;