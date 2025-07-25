"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { format, subDays } from "date-fns";
import { TicketResponse } from "@/app/models/ITicket";

// Register Chart.js components
Chart.register(...registerables);

interface SalesTrendDataDataset {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  tension: number;
  fill: boolean;
}

// Define the data structure for sales trend
export interface SalesTrendData {
  labels: string[];
  datasets: SalesTrendDataDataset[];
}

// New data structure from a hypothetical API for daily sales
export interface DailyTicketSales {
  date: string;
  sales: {
    [ticketId: string]: number;
  };
}

interface EventSalesTrendChartProps {
  data: SalesTrendData;
  height?: number;
}

export default function EventSalesTrendChart({
  data,
  height = 300,
}: EventSalesTrendChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
              precision: 0,
            },
          },
        },
        plugins: {
          legend: {
            position: "top",
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
            displayColors: true,
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${context.parsed.y} tickets`;
              },
            },
          },
        },
        interaction: {
          mode: "index",
          intersect: false,
        },
        elements: {
          point: {
            radius: 3,
            hoverRadius: 5,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div style={{ height: `${height}px` }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

// Helper function to generate mock sales data for the past n days
export function generateMockSalesData(
  days: number = 30,
  eventStartDate: string
) {
  const startDate = new Date(eventStartDate);
  const labels: string[] = [];
  const generalData: number[] = [];
  const couplesData: number[] = [];
  const vipData: number[] = [];

  // Generate data points for each day
  for (let i = days; i >= 0; i--) {
    const date = subDays(new Date(), i);
    labels.push(format(date, "MMM dd"));

    // Generate some realistic looking data with an upward trend
    // and some randomness, with higher sales closer to the event date
    const daysFactor = 1 + ((days - i) / days) * 2; // Increases as we get closer to today
    const randomFactor = Math.random() * 0.5 + 0.8; // Random factor between 0.8 and 1.3

    generalData.push(Math.floor(daysFactor * randomFactor * 5));
    couplesData.push(Math.floor(daysFactor * randomFactor * 3));
    vipData.push(Math.floor(daysFactor * randomFactor * 2));
  }

  return {
    labels,
    datasets: [
      {
        label: "General",
        data: generalData,
        backgroundColor: "rgba(147, 51, 234, 0.2)",
        borderColor: "rgba(147, 51, 234, 1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Couples",
        data: couplesData,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: "VIP",
        data: vipData,
        backgroundColor: "rgba(230, 126, 34, 0.2)",
        borderColor: "rgba(230, 126, 34, 1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };
}

// Helper function to generate dynamic colors for the chart
function generateDynamicColors(count: number): {
  backgroundColors: string[];
  borderColors: string[];
} {
  const backgroundColors: string[] = [];
  const borderColors: string[] = [];
  const saturation = 70;
  const lightness = 60;

  for (let i = 0; i < count; i++) {
    // Distribute hues evenly around the color wheel for distinct colors
    const hue = Math.floor((i * (360 / count)) % 360);
    backgroundColors.push(`hsla(${hue}, ${saturation}%, ${lightness}%, 0.2)`);
    borderColors.push(`hsla(${hue}, ${saturation}%, ${lightness}%, 1)`);
  }

  return { backgroundColors, borderColors };
}

// Helper function to generate sales trend data from an API response
export function generateSalesTrendData(
  sales: DailyTicketSales[],
  tickets: TicketResponse[]
): SalesTrendData {
  if (!sales || sales.length === 0 || !tickets || tickets.length === 0) {
    return { labels: [], datasets: [] };
  }

  // Sort sales data by date to ensure the chart is chronological
  const sortedSales = [...sales].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const labels = sortedSales.map((s) => format(new Date(s.date), "MMM dd"));
  const { backgroundColors, borderColors } = generateDynamicColors(
    tickets.length
  );

  const datasets = tickets.map((ticket, index) => {
    const salesDataForTicket = sortedSales.map(
      (dailySale) => dailySale.sales[ticket.id] || 0
    );

    return {
      label: ticket.name,
      data: salesDataForTicket,
      backgroundColor: backgroundColors[index],
      borderColor: borderColors[index],
      borderWidth: 2,
      tension: 0.4,
      fill: true,
    };
  });

  return {
    labels,
    datasets,
  };
}
