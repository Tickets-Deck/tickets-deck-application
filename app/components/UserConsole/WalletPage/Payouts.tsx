import { Payout } from '@/app/models/IWallet'
import moment from 'moment'
import React from 'react'

type Props = {
    userPayouts: Payout[]
}

export default function Payouts({ userPayouts }: Props) {
    return (
        <div className='mt-6 w-full'>
            <h3 className='mb-3 text-xl'>Payouts</h3>
            <div className='max-h-[65vh] w-full overflow-y-auto rounded-2xl relative bg-container-grey'>
                <table className='bg-white w-full text-dark-grey'>
                    <tbody>
                        <tr>
                            {/* <th className='p-3 border-b-[1px] text-left text-sm font-semibold'>
                      Transaction Reference
                    </th> */}
                            <th className='p-3 border-b-[1px] text-left text-sm font-semibold'>
                                Amount
                            </th>
                            <th className='p-3 border-b-[1px] text-left text-sm font-semibold'>
                                Date Requested
                            </th>
                            <th className='p-3 border-b-[1px] text-left text-sm font-semibold'>
                                Date Paid
                            </th>
                            <th className='p-3 border-b-[1px] text-left text-sm font-semibold'>
                                Status
                            </th>
                            <th className='p-3 border-b-[1px] text-left text-sm font-semibold'>
                                Payment Method
                            </th>
                            <th className='p-3 border-b-[1px] text-left text-sm font-semibold'>
                                Service Fee
                            </th>
                            <th className='p-3 border-b-[1px] text-left text-sm font-semibold'>
                                Tax
                            </th>
                        </tr>

                        {
                            userPayouts.map((payout, index) => (
                                <tr key={index}>
                                    {/* <td className='p-3 border-b-[1px] text-left text-sm'>
                        {payout.transactionRef ?? "Unavailable"}
                      </td> */}
                                    <td className='p-3 border-b-[1px] text-left text-sm'>
                                        &#8358;{payout.amount}
                                    </td>
                                    <td className='p-3 border-b-[1px] text-left text-sm'>
                                        {moment(payout.createdAt).format(
                                            "Do MMM, YYYY | hh:mma"
                                        )}
                                    </td>
                                    <td className='p-3 border-b-[1px] text-left text-sm'>
                                        {payout.payoutDate
                                            ? moment(payout.payoutDate).format(
                                                "Do MMM, YYYY | hh:mma"
                                            )
                                            : ""}
                                    </td>
                                    <td className='p-3 border-b-[1px] text-left text-sm'>
                                        {payout.status}
                                    </td>
                                    <td className='p-3 border-b-[1px] text-left text-sm'>
                                        {payout.paymentMethod}
                                    </td>
                                    <td className='p-3 border-b-[1px] text-left text-sm'>{`${payout.serviceFees ?? 0
                                        }%`}</td>
                                    <td className='p-3 border-b-[1px] text-left text-sm'>{`${payout.tax ?? 0
                                        }%`}</td>
                                    {/* <td className="p-3 border-b-[1px] text-left text-sm">
                                                    <span className="bg-success-color w-fit px-2 py-4 rounded-xl text-white text-lg">
                                                        5%
                                                    </span>
                                                </td> */}
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}