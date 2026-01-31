import { motion } from "motion/react";
import { IconType } from "react-icons";

export interface IStatsCardProps {
  icon: IconType;
  label: string;
  count: number;
  color: "primary" | "success" | "warning" | "error" | "info";
  index: number;
}

export default function StatsCard({
  icon: Icon,
  label,
  count,
  color,
  index,
}: IStatsCardProps) {
  const themes = {
    primary: {
      bg: "bg-[#edebff]",
      circles: ["bg-[#d0c9ff]", "bg-[#e2dcff]"],
      text: "text-[#5b4eb1]",
    },
    success: {
      bg: "bg-[#e3f9eb]",
      circles: ["bg-[#bcf0cf]", "bg-[#d1f5de]"],
      text: "text-[#1f8c54]",
    },
    warning: {
      bg: "bg-[#fff7d6]",
      circles: ["bg-[#ffeea3]", "bg-[#fff2c2]"],
      text: "text-[#b08800]",
    },
    error: {
      bg: "bg-[#ffe3e3]",
      circles: ["bg-[#ffc2c2]", "bg-[#ffd1d1]"],
      text: "text-[#c92a2a]",
    },
    info: {
      bg: "bg-[#e0f2ff]",
      circles: ["bg-[#bae0ff]", "bg-[#d1eaff]"],
      text: "text-[#1a7bc7]",
    },
  };

  const theme = themes[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.23, 1, 0.32, 1],
      }}
      className={`
        relative overflow-hidden
        ${theme.bg}
        rounded-[2rem] p-6
        transition-all duration-300
        hover:shadow-lg hover:-translate-y-1
        cursor-default min-h-[160px] flex flex-col justify-between
      `}
    >
      {/* DECORATIVE CIRCLES */}
      <div
        className={`absolute -top-12 -right-12 w-40 h-40 rounded-full ${theme.circles[0]} opacity-50 blur-3xl`}
      />
      <div
        className={`absolute top-[-20%] right-[-10%] w-32 h-32 rounded-full ${theme.circles[1]} opacity-60 mix-blend-multiply`}
      />

      {/* CONTENT */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2 opacity-80">
          <span className={`font-semibold text-lg tracking-wide ${theme.text}`}>
            {label}
          </span>
          <Icon size={18} className={theme.text} />
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`text-5xl font-extrabold ${theme.text} tracking-tight`}
          >
            {count}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
