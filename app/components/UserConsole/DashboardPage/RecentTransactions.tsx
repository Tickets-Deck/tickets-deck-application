import React, { useEffect, useState } from 'react'
import ComponentLoader from '../../Loader/ComponentLoader'
import moment from 'moment'
import { serializeOrderStatus } from '@/app/constants/serializer'
import styles from "../../../styles/Dashboard.module.scss";
import { useFetchUserRecentTransactions } from '@/app/api/apiClient';
import { Session } from 'next-auth';
import { catchError } from '@/app/constants/catchError';
import { UserRecentTransaction } from '@/app/models/IUserRecentTransaction';
import { OrderStatus } from '@/app/enums/IOrderStatus';

type Props = {
    session: Session | null
}

export default function RecentTransactions({ session }: Props) {

    const user = session?.user;

    const fetchUserRecentTransactions = useFetchUserRecentTransactions();
    const [isFetchingUserRecentTransactions, setIsFetchingUserRecentTransactions] = useState(true);
    const [userRecentTransactions, setUserRecentTransactionss] = useState<UserRecentTransaction[]>([]);

    async function handleFetchUserRecentTransactions(duration?: string) {

        // Start loader
        setIsFetchingUserRecentTransactions(true);

        await fetchUserRecentTransactions(user?.id as string, duration)
            .then((response) => {
                setUserRecentTransactionss(response.data);
            })
            .catch((error) => {
                catchError(error);
            })
            .finally(() => {
                setIsFetchingUserRecentTransactions(false);
            });
    };

    function showTagStyle(orderStatus: OrderStatus) {
        switch (orderStatus) {
            case OrderStatus.Pending:
                return styles.pendingTag;
            case OrderStatus.PaymentInitiated:
                return styles.initiatedTag;
            case OrderStatus.Confirmed:
                return styles.completedTag;
            case OrderStatus.Cancelled:
                return styles.cancelledTag;
            default:
                return styles.pendingTag;
        }
    }

    useEffect(() => {
        if (user) {
            handleFetchUserRecentTransactions("14"); // set to fetch transactions within the last 2 weeks by default
        }
    }, [user]);

    return (
        <div className={`${styles.activities} w-full order-2 md:order-1 md:basis-3/5`}>
            <h3>Recent transactions&nbsp;
                <select onChange={(e) => handleFetchUserRecentTransactions(e.target.value)}>
                    <option value="14">within the last 2 weeks</option>
                    <option value="30">within the last 1 month</option>
                    <option value="60">within the last 2 months</option>
                    <option value="90">within the last 3 months</option>
                </select>
            </h3>

            <div className={styles.tableContainer}>
                <table>
                    <tbody>
                        <tr>
                            <th>Event name</th>
                            <th>Order ID</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>

                        {/* <tr>
                                <td>eventName</td>
                                <td>ticketName</td>
                                <td>&#8358;5,000</td>
                                <td>Mon 15th Jan, 2024 | 04:25pm</td>
                                <td>
                                    <span className={showTagStyle(OrderStatus.Pending)}>
                                        Pending
                                    </span>
                                </td>
                            </tr> */}
                        {
                            !isFetchingUserRecentTransactions && userRecentTransactions.map((userRecentTransaction, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{userRecentTransaction.eventName}</td>
                                        <td>{userRecentTransaction.orderId}</td>
                                        {
                                            userRecentTransaction.amount == "0" ?
                                                <td>Free</td> :
                                                <td>&#8358;{Number(userRecentTransaction.amount).toLocaleString()}</td>
                                        }
                                        <td>{moment(userRecentTransaction.date).format("ddd Do MMM, YYYY | hh:mma")}</td>
                                        <td>
                                            <span className={showTagStyle(userRecentTransaction.status)}>
                                                {serializeOrderStatus(userRecentTransaction.status)}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

                {
                    userRecentTransactions.length == 0 && !isFetchingUserRecentTransactions &&
                    <div className={styles.tableInfoUnavailable}>
                        <p>There is no data available</p>
                    </div>
                }
                {
                    userRecentTransactions.length == 0 && isFetchingUserRecentTransactions &&
                    <div className={styles.tableLoader}>
                        <ComponentLoader isSmallLoader customBackground="#fff" customLoaderColor="#111111" />
                    </div>
                }
            </div>
        </div>
    )
}