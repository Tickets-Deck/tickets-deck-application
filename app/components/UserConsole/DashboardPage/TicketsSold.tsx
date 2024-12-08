import React, { useState } from 'react'
import ComponentLoader from '../../Loader/ComponentLoader'
import Link from 'next/link'
import { ApplicationRoutes } from '@/app/constants/applicationRoutes'
import styles from "../../../styles/Dashboard.module.scss";
import { TicketsSoldMetrics } from '@/app/models/IMetrics';

type Props = {
    isFetchingTicketsSoldMetrics: boolean
    ticketsSoldMetrics: TicketsSoldMetrics[]
}

export default function TicketsSold({ isFetchingTicketsSoldMetrics, ticketsSoldMetrics }: Props) {

    return (
        <div className="w-full order-1 md:order-2 md:basis-2/5">
            <div className="flex flex-row items-center justify-between mb-3">
                <h3 className="text-white">Tickets Sold</h3>
                <Link
                    href={`${ApplicationRoutes.EventTickets}?t=1`}
                    className="text-sm p-1 px-3 rounded-full bg-white/10 hover:bg-white/20">
                    See all
                </Link>
            </div>

            <div className={styles.tableContainer}>
                <table>
                    <tbody>
                        <tr>
                            <th>Event name</th>
                            <th>Tickets Sold</th>
                            <th>Revenue</th>
                            <th>Action</th>
                        </tr>
                        {
                            !isFetchingTicketsSoldMetrics && ticketsSoldMetrics?.map((ticketsSoldMetric, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{ticketsSoldMetric.title}</td>
                                        <td>{ticketsSoldMetric.totalTicketsSold}</td>
                                        <td>&#8358;{ticketsSoldMetric.totalAmountPaid.toLocaleString()}</td>
                                        <td>
                                            <Link
                                                className="text-primary-color p-2 px-3 rounded-full bg-primary-color/5 hover:bg-primary-color/20"
                                                href={`${ApplicationRoutes.EventTickets}/${ticketsSoldMetric.id}`}>
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

                {
                    ticketsSoldMetrics.length == 0 && !isFetchingTicketsSoldMetrics &&
                    <div className={styles.tableInfoUnavailable}>
                        <p>There is no data available</p>
                    </div>
                }
                {
                    ticketsSoldMetrics.length == 0 && isFetchingTicketsSoldMetrics &&
                    <div className={styles.tableLoader}>
                        <ComponentLoader isSmallLoader customBackground="#fff" customLoaderColor="#111111" />
                    </div>
                }
            </div>
        </div>
    )
}