"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface WorkScheduleData {
  period: string;
  worked: number;
  overtime: number;
  leave: number;
}

interface WorkScheduleChartProps {
  data: WorkScheduleData[];
}

const COLORS = {
  worked: "#22c55e",
  overtime: "#f97316",
  leave: "#3b82f6",
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
