import { FunctionComponent, ReactElement, Dispatch, SetStateAction, useState, useEffect, useRef, useMemo, ChangeEvent, useContext, MouseEvent } from "react";
import ModalWrapper from "./ModalWrapper";
import { Icons } from "../ui/icons";
import { Bank, BankAccount, BankAccountDetailsRequest, BankAccountRequest, BankVerificationResponse } from "@/app/models/IBankAccount";
import { useCreateUserBankAccount, useFetchBankDetails, useFetchBankList } from "@/app/api/apiClient";
import useOuterClick from "@/app/hooks/useOuterClick";
import { catchError } from "@/app/constants/catchError";
import { ApplicationContext, ApplicationContextData } from "@/app/context/ApplicationContext";
import { useSession } from "next-auth/react";
import Button from "../ui/button";
import { ToastContext } from "@/app/context/ToastCardContext";

interface BankAccountCreationModalProps {
    visibility: boolean
    setVisibility: Dispatch<SetStateAction<boolean>>
    handleFetchUserBankAccount: () => Promise<void>
}

const BankAccountCreationModal: FunctionComponent<BankAccountCreationModalProps> = (
    { visibility, setVisibility, handleFetchUserBankAccount }): ReactElement => {

    const { data: session } = useSession();
    const user = session?.user;

    const toasthandler = useContext(ToastContext);

    const fetchBankDetails = useFetchBankDetails();
    const createBankAccount = useCreateUserBankAccount();

    const { bankList } = useContext(ApplicationContext) as ApplicationContextData;

    const [isConfirmingAccount, setIsConfirmingAccount] = useState(false);
    const [isCreatingBankAccount, setIsCreatingBankAccount] = useState(false);

    const [verifiedAccount, setVerifiedAccount] = useState<BankVerificationResponse>();
    const [verificationError, setVerificationError] = useState(false);
    const [searchedValue, setSearchedValue] = useState<string>("");
    const [searchedBankList, setSearchedBankList] = useState<Bank[]>();
    const [selectedBank, setSelectedBank] = useState<Bank>();
    const [bankListDropdownIsVisible, setBankListDropdownIsVisible] = useState(false);

    const [accountRequest, setAccountRequest] = useState<BankAccountRequest>();

    async function handleBankSearch(e: ChangeEvent<HTMLInputElement>) {

        if (e.target.value.length == 0) {
            setSearchedBankList(undefined);
            setBankListDropdownIsVisible(false);
            return;
        }

        setBankListDropdownIsVisible(true);
        setSearchedBankList(
            bankList.filter((bank) =>
                bank.name.toLowerCase().includes(searchedValue.toLowerCase()) ||
                bank.name.split(" ").map((word) => word[0]).join("").toLowerCase().includes(searchedValue.toLowerCase())
            )
        );
    };

    async function handleCreateBankAccount(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
        // Prevent default form submission
        e.preventDefault();

        if (!accountRequest || !verifiedAccount) return;

        // Set the loading state
        setIsCreatingBankAccount(true);

        // Data to be sent to API
        const data: BankAccount = {
            accountName: verifiedAccount?.account_name as string,
            accountNumber: verifiedAccount?.account_number as string,
            bankName: selectedBank?.name as string
        }

        // Call API to create bank account
        await createBankAccount(user?.token as string, user?.id as string, data)
            .then(async (response) => {
                toasthandler?.logSuccess('Success', `Your ${data.bankName} account has been added successfully.`);
                await handleFetchUserBankAccount();
                setVisibility(false);
            })
            .catch((error) => {
                catchError(error);
            })
            .finally(() => {
                setIsCreatingBankAccount(false);
            })
    };

    /**
     * Verify account number when account number is 10 digits and bank is selected
     */
    useMemo(async () => {
        if (!accountRequest?.accountNumber) return;
        if (accountRequest.accountNumber.length === 10 && selectedBank) {

            // unset verification error
            setVerificationError(false);
            // unset verified account
            setVerifiedAccount(undefined);

            // Data to be sent to API
            const data: BankAccountDetailsRequest = {
                accountNumber: accountRequest.accountNumber,
                bankCode: selectedBank.code
            }

            // Call API to verify account
            await fetchBankDetails(session?.user.token as string, data)
                .then((response) => {
                    setVerifiedAccount(response.data);
                })
                .catch((error) => {
                    setVerificationError(true);
                })
                .finally(() => {
                    setIsConfirmingAccount(false);
                });
        };
    }, [accountRequest, selectedBank]);

    // Reset states when modal is closed
    useEffect(() => {
        // unset all states
        setAccountRequest(undefined);
        setVerifiedAccount(undefined);
        setVerificationError(false);
        setSearchedValue("");
        setSelectedBank(undefined);
        setAccountRequest(undefined);
    }, [visibility]);

    const bankListDropdownRef = useRef(null);

    useOuterClick(bankListDropdownRef, () => setBankListDropdownIsVisible(false));

    return (
        <ModalWrapper visibility={visibility} setVisibility={setVisibility} styles={{ backgroundColor: 'transparent', color: '#fff', width: "fit-content" }}>
            <div className="w-full max-w-full md:w-96 md:max-w-96 p-6 rounded-2xl bg-container-grey">
                <div className="flex flex-row justify-between items-center mb-2">
                    <div className="flex flex-col items-start">
                        <h3 className="font-medium">Add your NGN payout bank account</h3>
                    </div>
                    <span
                        className="ml-auto w-8 h-8 min-w-8 min-h-8 rounded-full grid place-items-center cursor-pointer hover:bg-white/10"
                        onClick={() => setVisibility(false)}>
                        <Icons.Close stroke="#fff" />
                    </span>
                </div>
                <div className="flex flex-col">
                    <p className="text-xs p-2 rounded-md bg-text-grey/20 text-white/80 mb-2">
                        Please note that you can only add one bank account at a time. You can update your bank account details at any time.
                    </p>
                    <div className="flex flex-col gap-1 mb-1">
                        <div className="relative">
                            <label htmlFor="bankName" className="text-xs text-white/60">Bank Name</label>
                            <input
                                type="text"
                                id="bankName"
                                className="w-full bg-transparent border-b border-white/40 text-white text-sm p-1 mt-0.5"
                                placeholder="Bank Name"
                                autoComplete="off"
                                autoCorrect="off"
                                onClick={() => setBankListDropdownIsVisible(true)}
                                value={searchedValue}
                                onChange={(e) => {
                                    if (e.target.value.length == 1) {
                                        setSearchedValue(e.target.value);
                                        setBankListDropdownIsVisible(true);
                                        return;
                                    }
                                    setSearchedValue(e.target.value);
                                    handleBankSearch(e);
                                    setIsConfirmingAccount(false);
                                }}
                            />
                            {
                                bankListDropdownIsVisible &&
                                <div ref={bankListDropdownRef} className="absolute w-full top-16 left-0 bg-dark-grey z-10 rounded-lg overflow-hidden max-h-[200px] overflow-y-auto">
                                    {
                                        (searchedBankList ?? bankList).map((bank, index) => (
                                            <span
                                                className="block px-2 py-3 text-white text-sm cursor-pointer hover:bg-white/10"
                                                key={index}
                                                onClick={() => {
                                                    // Set the form value
                                                    setAccountRequest({ ...accountRequest as BankAccountRequest, bankName: bank.name });
                                                    setSearchedValue(bank.name);
                                                    setSelectedBank(bank);
                                                    // Hide the dropdown
                                                    setBankListDropdownIsVisible(false);
                                                }}>
                                                {bank.name}
                                            </span>
                                        ))
                                    }
                                </div>
                            }
                        </div>
                        <div>
                            <label htmlFor="accountNumber" className="text-xs text-white/60">Personal Bank Account Number</label>
                            <input
                                type="text"
                                id="accountNumber"
                                className="w-full bg-transparent border-b border-white/40 text-white text-sm p-1 mt-0.5"
                                placeholder="Account Number"
                                maxLength={10}
                                onChange={(e) => {
                                    setAccountRequest({ ...accountRequest as BankAccountRequest, accountNumber: e.target.value });
                                    if (e.target.value.length === 10) {
                                        setIsConfirmingAccount(true);
                                        return;
                                    }
                                    setIsConfirmingAccount(false);
                                    setVerifiedAccount(undefined);
                                    setVerificationError(false);
                                }}
                            />
                        </div>
                    </div>
                    {
                        verificationError &&
                        <p className="text-red-500 text-sm">Could not confirm account. If you're sure it's correct, you're good to go.</p>
                    }
                    {isConfirmingAccount && <p className="text-text-grey text-sm">Confirming your account...</p>}
                    {verifiedAccount && <p className="text-success-color text-sm">{verifiedAccount.account_name}</p>}
                </div>
                <div className="flex justify-end mt-4 gap-2">
                    <button
                        className="text-sm bg-transparent text-white px-4 py-2 rounded-full"
                        onClick={() => setVisibility(false)}>
                        Close
                    </button>
                    <Button
                        disabled={!verifiedAccount || !selectedBank || isCreatingBankAccount}
                        isLoading={isCreatingBankAccount}
                        className="!text-sm !bg-white !text-black/80 !px-4 !py-2"
                        // btnLoaderClassname="!bg-dark-grey"
                        onClick={(e) => handleCreateBankAccount(e)}>
                        Add Bank Account
                    </Button>
                </div>
            </div>
        </ModalWrapper>
    );
}

export default BankAccountCreationModal;