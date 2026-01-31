import { HiOutlineExternalLink } from "react-icons/hi";
import { motion } from "framer-motion";
import { useState } from "react";
import { CgBorderStyleDashed } from "react-icons/cg";
import { LuSparkles, LuTrendingDown, LuTrendingUp } from "react-icons/lu";

// const Typewriter = ({ text, delay = 50 }: { text: string; delay?: number }) => {
//   const [displayedText, setDisplayedText] = useState("");
//   const index = useRef(0);

//   useEffect(() => {
//     setDisplayedText("");
//     index.current = 0;
//     const interval = setInterval(() => {
//       if (index.current < text?.length) {
//         setDisplayedText((prev) => prev + text.charAt(index.current));
//         index.current += 1;
//       } else {
//         clearInterval(interval);
//       }
//     }, delay);
//     return () => clearInterval(interval);
//   }, [text, delay]);

//   return <span>{displayedText}</span>;
// };

const CircularProgress = ({
  value,
  max = 100,
  size = 60,
  strokeWidth = 8,
  color = "#10b981",
  isPercent = true,
}: {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  isPercent?: boolean;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / max) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="rotate-[-90deg] -z-10" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(16, 185, 129, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{
            strokeLinecap: "round",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`${isPercent ? "text-lg" : "text-3xl"} font-bold text-slate-800`}
        >
          {value}
          {isPercent ? "%" : ""}
        </span>
      </div>
    </div>
  );
};

export default function OverviewProgressCard({
  stat,
  handler,
  isLoading = false,
}: {
  stat: any;
  handler?: () => void;
  isLoading?: boolean;
}) {
  const [showTooltip] = useState(false);

  return (
    <div
      className={`${stat.bgColor} p-4 rounded-xl relative overflow-visible border border-base-300/50 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 duration-300 h-32 flex flex-col justify-between group ${showTooltip ? "z-50" : "z-0"}`}
    >
      {/* AI Generating Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px]"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 15, -15, 0],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-purple-500"
          >
            <LuSparkles size={32} />
          </motion.div>
          <span className="text-[10px] font-bold text-purple-600 mt-2 uppercase tracking-tighter">
            AI Calculating...
          </span>
        </motion.div>
      )}

      {/* Decoration Circles Container */}
      <div className="absolute inset-0 -z-10 rounded-4xl overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-4 -right-4 w-24 h-24 ${stat.decorationColor} rounded-full opacity-40 group-hover:scale-110 transition-transform duration-500`}
        />
        <div
          className={`absolute top-10 -right-8 w-20 h-20 ${stat.decorationColor} rounded-full opacity-30 group-hover:scale-125 transition-transform duration-700 delay-75`}
        />
      </div>

      <div>
        <p
          onClick={handler}
          className={`text-slate-600 flex items-center gap-x-2 font-medium text-sm ${handler ? "cursor-pointer link link-hover" : ""}`}
        >
          <span>{stat.title}</span> <HiOutlineExternalLink className="inline" />
        </p>
        <div className="flex items-center gap-x-3 h-full">
          <CircularProgress
            value={stat.value}
            max={stat.max || 100}
            size={90}
            strokeWidth={10}
            color="#10b981"
          />
          <div className="flex flex-col justify-center gap-1">
            <p className="text-xs text-slate-500 font-medium">{stat.subText}</p>
            {stat.change && (
              <div
                className={`flex items-center w-fit gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold mt-1 ${stat.trendColor} bg-white/50 backdrop-blur-sm border border-slate-100 shadow-sm`}
              >
                {stat.trend === "up" ? (
                  <LuTrendingUp size={12} />
                ) : stat.trend === "down" ? (
                  <LuTrendingDown size={12} />
                ) : (
                  <CgBorderStyleDashed size={12} />
                )}
                {stat.change}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
