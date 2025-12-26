"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface WorkScheduleData {
  period: string;
  worked: number;
  overtime: number;
  leave: number;
}

interface WorkScheduleStackedChartProps {
  data: WorkScheduleData[];
}

export default function WorkScheduleStackedChart({
  data,
}: WorkScheduleStackedChartProps) {
  // Transform data to calculate percentages
  const transformedData = data.map((item) => {
    const total = item.worked + item.overtime + item.leave;
    return {
      period: item.period,
      total,
      workedPercent: total > 0 ? (item.worked / total) * 100 : 0,
      overtimePercent: total > 0 ? (item.overtime / total) * 100 : 0,
      leavePercent: total > 0 ? (item.leave / total) * 100 : 0,
      worked: item.worked,
      overtime: item.overtime,
      leave: item.leave,
    };
  });

  // Custom tooltip to show actual values
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-sm mb-2">{data.period}</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span>
                Worked: {data.worked}h ({data.workedPercent.toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-warning rounded"></div>
              <span>
                Overtime: {data.overtime}h ({data.overtimePercent.toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-info rounded"></div>
              <span>
                Leave: {data.leave}h ({data.leavePercent.toFixed(1)}%)
              </span>
            </div>
            <div className="pt-1 mt-1 border-t">
              <span className="font-medium">Total: {data.total}h</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom bar component that renders stacked segments
  const CustomStackedBar = (props: any) => {
    const { x, y, width, height, payload } = props;

    if (!payload) return null;

    const { workedPercent, overtimePercent, leavePercent } = payload;

    // Calculate segment widths based on percentages
    const workedWidth = (workedPercent / 100) * width;
    const overtimeWidth = (overtimePercent / 100) * width;
    const leaveWidth = (leavePercent / 100) * width;

    return (
      <g>
        {/* Worked segment */}
        {workedPercent > 0 && (
          <rect
            x={x}
            y={y}
            width={workedWidth}
            height={height}
            fill="hsl(var(--su))" // success color
            rx={4}
          />
        )}
        {/* Overtime segment */}
        {overtimePercent > 0 && (
          <rect
            x={x + workedWidth}
            y={y}
            width={overtimeWidth}
            height={height}
            fill="hsl(var(--wa))" // warning color
            rx={4}
          />
        )}
        {/* Leave segment */}
        {leavePercent > 0 && (
          <rect
            x={x + workedWidth + overtimeWidth}
            y={y}
            width={leaveWidth}
            height={height}
            fill="hsl(var(--in))" // info color
            rx={4}
          />
        )}
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={transformedData}
        margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis
          dataKey="period"
          tick={{ fill: "hsl(var(--bc))", fontSize: 12 }}
          axisLine={{ stroke: "hsl(var(--bc) / 0.2)" }}
        />
        <YAxis
          tick={{ fill: "hsl(var(--bc))", fontSize: 12 }}
          axisLine={{ stroke: "hsl(var(--bc) / 0.2)" }}
          label={{ value: "Hours", angle: -90, position: "insideLeft" }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
        <Bar
          dataKey="total"
          shape={<CustomStackedBar />}
          radius={[8, 8, 8, 8]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
