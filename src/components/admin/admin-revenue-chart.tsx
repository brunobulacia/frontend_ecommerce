"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export function AdminRevenueChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Sample data
    const labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentYearData = [
      18000, 22000, 19000, 27000, 25000, 32000, 30000, 35000, 28000, 32000,
      33000, 38000,
    ];
    const previousYearData = [
      15000, 18000, 16000, 21000, 22000, 25000, 24000, 28000, 22000, 24000,
      25000, 30000,
    ];

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "This Year",
            data: currentYearData,
            borderColor: "#94a3b8", // slate-400
            backgroundColor: "rgba(148, 163, 184, 0.1)",
            tension: 0.3,
            fill: true,
          },
          {
            label: "Last Year",
            data: previousYearData,
            borderColor: "#64748b", // slate-500
            backgroundColor: "rgba(100, 116, 139, 0.1)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "#1e293b", // slate-800
            titleColor: "#f8fafc", // slate-50
            bodyColor: "#e2e8f0", // slate-200
            borderColor: "#334155", // slate-700
            borderWidth: 1,
            padding: 10,
            displayColors: true,
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(context.parsed.y);
                }
                return label;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: "rgba(51, 65, 85, 0.5)", // slate-700 with opacity
            },
            ticks: {
              color: "#94a3b8", // slate-400
            },
          },
          y: {
            grid: {
              color: "rgba(51, 65, 85, 0.5)", // slate-700 with opacity
            },
            ticks: {
              color: "#94a3b8", // slate-400
              callback: (value) => "$" + value.toLocaleString(),
            },
            beginAtZero: true,
          },
        },
        elements: {
          point: {
            radius: 2,
            hoverRadius: 4,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="h-80">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
