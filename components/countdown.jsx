"use client";
import { useState, useEffect } from "react";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(null);

  const targetDate = new Date("2026-02-28T08:00:00+05:00");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      if (now >= targetDate) {
        setTimeLeft(null);
        return;
      }
      setTimeLeft({
        days: differenceInDays(targetDate, now),
        hours: differenceInHours(targetDate, now) % 24,
        minutes: differenceInMinutes(targetDate, now) % 60,
        seconds: differenceInSeconds(targetDate, now) % 60,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!timeLeft)
    return (
      <div className="text-xl font-subheading">The Campfire is Lit! 🔥</div>
    );

  return (
    <div className="flex gap-5 text-center justify-center">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <span className="text-5xl tabular-nums">
            {String(value).padStart(2, "0")}
          </span>
          <span className="text-md uppercase font-subheading opacity-60 mt-1">
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}