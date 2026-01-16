"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface WorkScheduleData {
  period: string;
  worked: number;
  overtime: number;
  leave: number;
}

interface WorkScheduleCompactChartProps {
  data: WorkScheduleData[];
}

const COLORS = {
  worked: "#22c55e", // green - success
  overtime: "#f97316", // orange - warning
  leave: "#3b82f6", // blue - info
  remaining: "#e5e7eb", // light gray - remaining
};

// Get scheduled hours for each period
const getScheduledHours = (period: string) => {
  switch (period) {
    case "Today":
      return 7.98;
    case "Week":
      return 47.88;
    case "Month":
      return 207.48;
    default:
      return 0;
  }
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const name = data.name;
    const value = data.value;

    // Don't show tooltip for remaining time
    if (name === "remaining" || value === 0) return null;

    const displayName =
      name === "worked"
        ? "Worked"
        : name === "overtime"
        ? "Overtime"
        : name === "leave"
        ? "Leave"
        : "";

    return (
      <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-lg text-xs">
        <p className="font-semibold">{displayName}</p>
        <p className="text-base-content/60">{value}h</p>
      </div>
    );
  }
  return null;
};

export default function WorkScheduleCompactChart({
  data,
}: WorkScheduleCompactChartProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {data.map((item, index) => {
        const scheduled = getScheduledHours(item.period);
        const total = item.worked + item.overtime + item.leave;
        const remaining = Math.max(0, scheduled - total);
        const percentage = scheduled > 0 ? (total / scheduled) * 100 : 0;

        // Data for the donut chart
        const chartData = [
          { name: "worked", value: item.worked },
          { name: "overtime", value: item.overtime },
          { name: "leave", value: item.leave },
          { name: "remaining", value: remaining },
        ];

        return (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-base-200/30 hover:bg-base-200/50 transition-colors"
          >
            {/* Donut Chart */}
            <div className="relative w-24 h-24 md:w-28 md:h-28">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius="70%"
                    outerRadius="100%"
                    paddingAngle={2}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {chartData.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={
                          entry.name === "worked"
                            ? COLORS.worked
                            : entry.name === "overtime"
                            ? COLORS.overtime
                            : entry.name === "leave"
                            ? COLORS.leave
                            : COLORS.remaining
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg md:text-xl font-bold text-base-content">
                  {total}h
                </span>
                <span className="text-[10px] text-base-content/60">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Period Label */}
            <div className="mt-2 text-center">
              <p className="text-xs md:text-sm font-semibold text-base-content">
                {item.period}
              </p>
              <p className="text-[10px] text-base-content/60">
                of {scheduled}h
              </p>
            </div>

            {/* Breakdown (shows on hover or always) */}
            <div className="mt-2 space-y-0.5 w-full text-[10px]">
              {item.worked > 0 && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-base-content/70">Worked</span>
                  </div>
                  <span className="font-medium">{item.worked}h</span>
                </div>
              )}
              {item.overtime > 0 && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-warning"></div>
                    <span className="text-base-content/70">Overtime</span>
                  </div>
                  <span className="font-medium">{item.overtime}h</span>
                </div>
              )}
              {item.leave > 0 && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-info"></div>
                    <span className="text-base-content/70">Leave</span>
                  </div>
                  <span className="font-medium">{item.leave}h</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
