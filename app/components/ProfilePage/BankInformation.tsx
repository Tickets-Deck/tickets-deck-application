import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { BankAccount } from "@/app/models/IBankAccount";
import Link from "next/link";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { ComponentLoaderV2 } from "../Loader/ComponentLoader";

interface BankInformationProps {
    userBankAccounts: BankAccount[] | undefined
    isFetchingUserBankAccounts: boolean
}

const BankInformation: FunctionComponent<BankInformationProps> = ({ userBankAccounts, isFetchingUserBankAccounts }): ReactElement => {

    return (
        <>
            {
                userBankAccounts && userBankAccounts.length > 0 ?
                    <div>
                        {/* <div className="flex flex-col items-center my-5">
                            <span className="mx-auto mb-1">
                                <InfoIcon width={52} height={52} stroke="#afafaf" />
                            </span>
                            <p className="text-sm">You have not added any payout accounts yet.</p>
                        </div> */}
                        {
                            userBankAccounts?.map((bankAccount, index) => {
                                return (
                                    <div className="flex flex-col gap-2 mb-3" key={index}>
                                        <div className="flex flex-col items-start md:flex-row md:items-baseline">
                                            <p className="text-sm text-text-grey md:pr-1">Bank Name:</p>
                                            <p className="text-sm">{bankAccount.bankName}</p>
                                        </div>
                                        <div className="flex flex-col items-start md:flex-row md:items-baseline">
                                            <p className="text-sm text-text-grey md:pr-1">Account Number:</p>
                                            <p className="text-sm">{bankAccount.accountNumber}</p>
                                        </div>
                                        <div className="flex flex-col items-start md:flex-row md:items-baseline">
                                            <p className="text-sm text-text-grey md:pr-1">Account Name:</p>
                                            <p className="text-sm">{bankAccount.accountName}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <div>
                            <p className="italic text-xs">To update your account, kindly <Link className="underline text-primary-color" href={ApplicationRoutes.Contact}>contact us</Link></p>
                            {/* <button className="text-sm bg-dark-grey text-white px-4 py-2 rounded-full">Update account</button> */}
                        </div>
                    </div> :
                    <>
                        {
                            isFetchingUserBankAccounts &&
                            <ComponentLoaderV2 className="border-primary-color w-10 h-10 mx-auto" />
                        }
                        {
                            !isFetchingUserBankAccounts &&
                            <div className="flex flex-col items-center my-5">
                                <span className="mx-auto mb-1">
                                    {/* <InfoIcon width={52} height={52} stroke="#afafaf" /> */}
                                </span>
                                <p className="text-sm">You have not added any payout accounts yet.</p>
                            </div>
                        }
                    </>
            }
        </>
    );
}

export default BankInformation;