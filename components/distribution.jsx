import { Users } from "lucide-react";
import { motion } from "framer-motion";

export default function AgeDistribution({ ages, eventData }) {
  const getAgeData = () => {
    if (!ages || Object.keys(ages).length === 0) return [];
    return Object.entries(ages)
      .filter(([_, count]) => count > 0)
      .sort(([a], [b]) => parseInt(a) - parseInt(b));
  };

  const ageData = getAgeData();

  if (ageData.length === 0) {
    return (
      <div className="w-full bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 hover:backdrop-blur-none backdrop-blur-sm transition-all duration-300 cursor-default group flex flex-col items-center justify-center min-h-[300px]">
        <Users size={32} className="text-white/20 mb-4" />
        <h4 className="text-xl font-subheading uppercase tracking-wider text-white/40">
          Age Distribution
        </h4>
        <p className="text-sm opacity-30 mt-2">No age data available yet</p>
      </div>
    );
  }

  const max = Math.max(...ageData.map(([_, count]) => count));
  const total = ageData.reduce((sum, [_, count]) => sum + count, 0);

  return (
    <div className="w-full bg-white/5 p-4 rounded-3xl border border-white/10 hover:bg-white/10 hover:backdrop-blur-none backdrop-blur-sm transition-all duration-300 cursor-default group flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-lg sm:text-xl font-subheading flex items-center gap-2 text-white/90">
            <Users size={20} className="text-purple-400" />
            Age Distribution
          </h4>
          <p className="text-xs sm:text-sm opacity-50 mt-1">
            {ageData.length} age groups • {total} selected
          </p>
        </div>
        <div className="grid grid-cols-5 gap-x-3 gap-y-0 text-right">
          {[
            ["he/him", eventData.participants?.boys],
            ["she/her", eventData.participants?.gals],
            ["other", eventData.participants?.other],
            ["orgs", eventData.participants?.volunteer],
            ["deleted", eventData.participants?.deleted],
          ].map(([l, c], i) => (
            <div key={i} className="flex flex-col">
              <span className="text-sm sm:text-md uppercase opacity-30 font-medium tracking-wider">
                {l}
              </span>
              <span className="text-md sm:text-lg font-subheading text-white/80 tabular-nums">
                {c || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div
          className="flex items-end justify-between gap-1 sm:gap-2 w-full"
          style={{ minHeight: "240px", height: "240px" }}
        >
          {ageData.map(([age, count], index) => {
            const percentage = Math.max(5, (count / max) * 100);
            return (
              <div
                key={age}
                className="group/bar relative flex-1 flex flex-col items-center gap-1.5 h-full justify-end min-w-0"
              >
                <div className="relative w-full bg-white/5 rounded-t-md overflow-hidden flex items-end justify-center transition-all duration-300 group-hover/bar:bg-white/10 h-full">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${percentage}%` }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.04,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="w-full absolute bottom-0 bg-purple-400 transition-all duration-300 rounded-t-sm"
                  >
                    {percentage > 25 && (
                      <div className="absolute inset-x-0 top-2 flex justify-center">
                        <span className="text-md sm:text-lg text-white tabular-nums">
                          {count}
                        </span>
                      </div>
                    )}
                  </motion.div>
                </div>
                <span className="text-sm sm:text-md font-medium opacity-40 group-hover/bar:opacity-100 group-hover/bar:text-purple-300 transition-all tabular-nums truncate w-full text-center">
                  {age}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}