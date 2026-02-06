"use client"
import { useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ChartArea } from "lucide-react";

export default function SignupGraph({ signupTimes = [] }) {
  const [hover, setHover] = useState(null);
  if (!signupTimes.length) return null;

  const W = 1000,
    H = 300,
    PY = 40;

  const dates = signupTimes.map((t) => new Date(t)).sort((a, b) => a - b);
  const start = new Date(dates[0]);
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const data = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 2)) {
    const n = new Date(d);
    n.setDate(n.getDate() + 2);
    data.push({
      label: format(d, "MMM d"),
      count: dates.filter((t) => t >= d && t < n).length,
    });
  }

  const max = Math.max(...data.map((d) => d.count), 1);
  const points = data.map((d, i) => ({
    x: (i / Math.max(data.length - 1, 1)) * W,
    y: PY + (1 - d.count / max) * (H - PY * 2),
    ...d,
  }));

  const pathD = points.reduce(
    (d, p, i) =>
      !i
        ? `M ${p.x} ${p.y}`
        : d +
          ` C ${(points[i - 1].x + p.x) / 2} ${points[i - 1].y},
               ${(points[i - 1].x + p.x) / 2} ${p.y},
               ${p.x} ${p.y}`,
    "",
  );

  const areaD = `${pathD} L ${W} ${H} L 0 ${H} Z`;

  return (
    <div className="w-full bg-white/5 p-0 rounded-2xl border border-white/10 hover:bg-white/10 hover:backdrop-blur-none backdrop-blur-sm transition-all duration-300 cursor-default group overflow-hidden group/graph flex flex-col justify-between">
      <div className="p-4 pb-0 flex justify-between items-start relative z-10">
        <div>
          <h4 className="text-lg sm:text-xl font-subheading flex items-center gap-2 text-white/90">
            <ChartArea size={20} className="text-green-400" />
            Signup Rate
          </h4>
          <p className="text-xs sm:text-sm opacity-50 mt-1">
            {data[0]?.label} — {data[data.length - 1]?.label}
          </p>
          <p className="text-xs sm:text-sm opacity-50 mt-0">
            {data[0]?.count} in the last 2 days
          </p>
        </div>
      </div>

      <div className="relative w-full mt-auto" style={{ aspectRatio: "3/1" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="liquidGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>
          </defs>

          <motion.path
            d={areaD}
            fill="url(#liquidGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          <motion.path
            d={pathD}
            fill="none"
            stroke="#34d399"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {points.map((p, i) => (
            <g key={i}>
              <rect
                x={p.x - W / data.length / 2}
                y={0}
                width={W / data.length}
                height={H}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
              />
              {hover === i && (
                <>
                  <g transform={`translate(${p.x}, ${p.y - 20})`}>
                    <text
                      textAnchor="middle"
                      className="fill-green-400 text-4xl font-subheading tabular-nums drop-shadow-md translate-x-4 select-none -z-2"
                    >
                      {p.count}
                    </text>
                  </g>
                </>
              )}
            </g>
          ))}
        </svg>

        <div className="absolute bottom-4 left-0 w-full pointer-events-none px-8">
          <AnimatePresence>
            {hover !== null && (
              <motion.div
                initial={{ opacity: 0, x: (points[hover].x / W) * 100, y: 0 }}
                animate={{ opacity: 1, x: (points[hover].x / W) * 100, y: 0 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute bottom-0"
                style={{
                  left: `${(points[hover].x / W) * 85 - 3}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <p className="text-md uppercase tracking-widest text-emerald-400 whitespace-nowrap bg-transparent">
                  {data[hover].label}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}