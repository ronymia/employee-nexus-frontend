import { HiOutlineExternalLink } from "react-icons/hi";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  LuBadgeInfo,
  LuSparkles,
  LuTrendingDown,
  LuTrendingUp,
} from "react-icons/lu";

const Typewriter = ({ text, delay = 50 }: { text: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  const index = useRef(0);

  useEffect(() => {
    setDisplayedText("");
    index.current = 0;
    const interval = setInterval(() => {
      if (index.current < text?.length) {
        setDisplayedText((prev) => prev + text.charAt(index.current));
        index.current += 1;
      } else {
        clearInterval(interval);
      }
    }, delay);
    return () => clearInterval(interval);
  }, [text, delay]);

  return <span>{displayedText}</span>;
};

export default function OverviewCard({
  stat,
  handler,
  isLoading = true,
}: {
  stat: any;
  handler?: () => void;
  isLoading?: boolean;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`${stat.bgColor} p-6 rounded-xl relative overflow-visible border border-base-300/50 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 duration-300 h-32 flex flex-col justify-between group ${showTooltip ? "z-50" : "z-0"}`}
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

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p
            onClick={handler}
            className={`text-slate-600 flex items-center gap-x-2 font-medium text-sm ${handler ? "cursor-pointer link link-hover" : ""}`}
          >
            <span>{stat.title}</span>{" "}
            {handler && <HiOutlineExternalLink className="inline" />}
          </p>

          {/* Info Icon with Tooltip */}
          {stat.description && (
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-white/50"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(!showTooltip);
                }}
              >
                <LuBadgeInfo size={14} />
              </button>

              {/* Tooltip */}
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-2 z-50 w-64 bg-slate-800 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-700"
                  style={{ pointerEvents: "none" }}
                >
                  <div className="absolute -top-1.5 left-4 w-3 h-3 bg-slate-800 border-l border-t border-slate-700 rotate-45" />
                  <p className="leading-relaxed">{stat.description}</p>
                </motion.div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center flex-row justify-between gap-2">
          <span
            className={`${stat?.valueClassName ? stat?.valueClassName : "text-3xl"} font-bold text-slate-800`}
          >
            {isLoading ? <Typewriter text={stat.value} /> : stat.value}
          </span>
          {/* {stat.Icon && (
            <stat.Icon className={`${stat?.iconColor} pr-1`} size={36} />
          )} */}
          {/* <div
            className={`bg-linear-to-br ${stat.gradient} p-3 rounded-lg text-white`}
          >
            {stat.icon}
          </div> */}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {stat.change && (
          <div
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${stat.trendColor} bg-base-300 shadow-sm border border-slate-100`}
          >
            {stat.trend ? (
              stat.trend === "up" ? (
                <LuTrendingUp size={14} />
              ) : (
                <LuTrendingDown size={14} />
              )
            ) : null}
            {stat.change}
          </div>
        )}

        <span className="text-xs text-slate-500 font-medium">
          {stat.subText}
        </span>
      </div>
    </div>
  );
}
