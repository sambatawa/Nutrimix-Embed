"use client";

import { motion } from "framer-motion";

export default function FormulaCard({ name, catchphrase, onClick, isActive }) {
  return (
    <motion.div
      onClick={onClick} // now just call a callback to parent
      whileHover={{ scale: 1.03, boxShadow: "0 8px 16px rgba(0,0,0,0.12)" }}
      whileTap={{ scale: 0.97 }}
      className={`
        group cursor-pointer p-4 rounded-2xl border shadow-sm
        bg-gradient-to-br from-[#CBBFB4]/80 via-[#D8CDC3]/80 to-[#E7DFD7]/80
        backdrop-blur-xl border-[#EDE6DF]
        transition-all
        flex flex-col justify-between h-28
        ${isActive ? "ring-2 ring-[#CBBFB4]" : ""}
      `}
    >
      {/* Formula Title */}
      <h3 className="text-xl font-bold text-[#6C5F57]">{name}</h3>

      {/* Catchphrase reacts when card is hovered */}
      <p className="text-xs text-[#6C5F57] mt-1 px-2 py-1 rounded transition-all
                    group-hover:scale-105 group-hover:bg-white/20">
        {catchphrase}
      </p>
    </motion.div>
  );
}
