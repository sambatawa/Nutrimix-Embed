"use client";

import { useState, useEffect } from "react";

export default function DashboardHeader() {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false); // track if component mounted

  useEffect(() => {
    setMounted(true); // mark as mounted
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null; // render nothing on server

  // Format time (HH:MM)
  const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Format date as "[Hari], [Tanggal] [Bulan] [Tahun]"
  const formattedDate = time.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Greeting logic
  const hour = time.getHours();
  let greeting = "Selamat Malam";
  if (hour >= 4 && hour < 11) greeting = "Selamat Pagi";
  else if (hour >= 11 && hour < 15) greeting = "Selamat Siang";
  else if (hour >= 15 && hour < 18) greeting = "Selamat Sore";

  return (
    <div className="w-full bg-[#FFF1E5] rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center shadow-md mb-4 font-sans">
      {/* Left: Clock */}
      <div className="text-[#6C5F57] font-semibold text-center sm:text-left">
        <div className="text-2xl sm:text-3xl">{formattedTime}</div>
        <div className="text-lg sm:text-xl">{formattedDate}</div>
      </div>

      {/* Right: Greeting */}
      <div className="text-[#6C5F57] font-semibold text-center sm:text-right mt-2 sm:mt-0 text-xl sm:text-2xl">
        {greeting}, {"{user name}"}
      </div>
    </div>
  );
}
