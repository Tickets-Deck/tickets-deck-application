import { ApplicationRoutes } from '@/app/constants/applicationRoutes'
import Link from 'next/link'
import React from 'react'
import { EventIcon } from '../../SVGs/SVGicons'
import { DashboardInfoResponse } from '@/app/models/IDashboardInfoResponse'
import styles from "../../../styles/Dashboard.module.scss";

type Props = {
    dashboardInfo: DashboardInfoResponse
}

export default function KpiSection({ dashboardInfo }: Props) {
    return (
        <div className={styles.kpis}>
            <Link href={ApplicationRoutes.Events} className={styles.kpi}>
                <span><EventIcon /></span>
                <div className={styles.content}>
                    <h4>{dashboardInfo.totalEvents}</h4>
                    <p>Total {dashboardInfo.totalEvents > 1 ? "Events" : "Event"}</p>
                </div>
            </Link>
            <Link href={`${ApplicationRoutes.EventTickets}?t=0`} className={styles.kpi}>
                <span><EventIcon /></span>
                <div className={styles.content}>
                    <h4>{dashboardInfo.ticketsBought}</h4>
                    <p>Tickets Bought</p>
                </div>
            </Link>
            <Link href={`${ApplicationRoutes.EventTickets}?t=1`} className={styles.kpi}>
                <span><EventIcon /></span>
                <div className={styles.content}>
                    <h4>{dashboardInfo.ticketsSold}</h4>
                    <p>Tickets Sold</p>
                </div>
            </Link>
            <Link href={ApplicationRoutes.Wallet} className={styles.kpi}>
                <span><EventIcon /></span>
                <div className={styles.content}>
                    <h4>&#8358;{dashboardInfo.totalRevenue.toLocaleString()}</h4>
                    <p>Total Revenue</p>
                </div>
            </Link>
        </div>
    )
}