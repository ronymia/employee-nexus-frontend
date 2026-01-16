"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface WorkScheduleData {
  period: string;
  worked: number;
  overtime: number;
  leave: number;
  scheduled?: number;
}

interface WorkScheduleChartProps {
  data: WorkScheduleData[];
}

const COLORS = {
  worked: "#22c55e",
  overtime: "#f97316",
  leave: "#3b82f6",
};

// Map period to scheduled hours (this should come from data in the future)
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
    const period = payload[0]?.payload?.period;
    const worked = payload.find((p: any) => p.dataKey === "worked")?.value || 0;
    const overtime =
      payload.find((p: any) => p.dataKey === "overtime")?.value || 0;
    const leave = payload.find((p: any) => p.dataKey === "leave")?.value || 0;
    const scheduled = getScheduledHours(period);

    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded"></div>
            <span className="text-base-content/70">Worked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-warning rounded"></div>
            <span className="text-base-content/70">Overtime</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-info rounded"></div>
            <span className="text-base-content/70">Leave</span>
          </div>
        </div>

        {/* Schedule Details */}
        <div className="space-y-2 border-t pt-2">
          <div className="flex justify-between items-center gap-4">
            <div>
              <p className="text-sm font-medium text-success">
                {period}&apos;s
              </p>
              <p className="text-xs text-base-content/60">
                Scheduled: {scheduled}h
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-base-content/60">
                Worked: <span className="font-medium">{worked}h</span>
              </p>
            </div>
          </div>

          {overtime > 0 && (
            <div className="text-xs text-base-content/60">
              Overtime:{" "}
              <span className="font-medium text-warning">{overtime}h</span>
            </div>
          )}

          {leave > 0 && (
            <div className="text-xs text-base-content/60">
              Leave: <span className="font-medium text-info">{leave}h</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default function WorkScheduleChart({ data }: WorkScheduleChartProps) {
  return (
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="period"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
          />
          <Bar dataKey="worked" fill={COLORS.worked} radius={[4, 4, 0, 0]} />
          <Bar
            dataKey="overtime"
            fill={COLORS.overtime}
            radius={[4, 4, 0, 0]}
          />
          <Bar dataKey="leave" fill={COLORS.leave} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
