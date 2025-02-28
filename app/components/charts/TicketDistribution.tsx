"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { TicketResponse } from "@/app/models/ITicket"

// Register Chart.js components
Chart.register(...registerables)

// Define the data structure for ticket distribution
export interface TicketDistributionData {
    labels: string[]
    datasets: {
        label: string
        data: number[]
        backgroundColor: string[]
        borderColor: string[]
        borderWidth: number
    }[]
}

interface TicketDistributionChartProps {
    data: TicketDistributionData
    height?: number
}

export default function TicketDistributionChart({ data, height = 200 }: TicketDistributionChartProps) {
    const chartRef = useRef<HTMLCanvasElement>(null)
    const chartInstance = useRef<Chart | null>(null)

    useEffect(() => {
        if (!chartRef.current) return

        // Destroy previous chart instance if it exists
        if (chartInstance.current) {
            chartInstance.current.destroy()
        }

        // Create new chart
        const ctx = chartRef.current.getContext("2d")
        if (!ctx) return

        chartInstance.current = new Chart(ctx, {
            type: "doughnut",
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "right",
                        labels: {
                            color: "rgba(255, 255, 255, 0.7)",
                            boxWidth: 12,
                            padding: 20,
                        },
                    },
                    tooltip: {
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        titleColor: "white",
                        bodyColor: "white",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        borderWidth: 1,
                        padding: 10,
                        callbacks: {
                            label: (context) => {
                                const label = context.label || ""
                                const value = context.parsed || 0
                                const total = context.dataset.data.reduce((acc: number, data: number) => acc + data, 0)
                                const percentage = Math.round((value * 100) / total)
                                return `${label}: ${value} ${value > 1 ? 'tickets' : 'ticket'} (${percentage}%)`
                            },
                        },
                    },
                },
                cutout: "70%",
            },
        })

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy()
            }
        }
    }, [data])

    return (
        <div style={{ height: `${height}px`, scale: 0.85 }}>
            <canvas ref={chartRef}></canvas>
        </div>
    )
}

// Helper function to generate ticket distribution data
export function generateTicketDistributionData(tickets: TicketResponse[]) {
    return {
        labels: tickets.map((ticket) => ticket.name),
        datasets: [
            {
                label: "Tickets Sold",
                data: tickets.map((ticket) => ticket.ticketOrdersCount),
                backgroundColor: [
                    "rgba(147, 51, 234, 0.7)", // Purple for General
                    "rgba(59, 130, 246, 0.7)", // Blue for Couples
                    "rgba(230, 126, 34, 0.7)", // Orange for VIP
                ],
                borderColor: ["rgba(147, 51, 234, 1)", "rgba(59, 130, 246, 1)", "rgba(230, 126, 34, 1)"],
                borderWidth: 1,
            },
        ],
    }
}

