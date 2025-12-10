"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FormulaModal({
  show,
  onClose,
  onChoose,
  formulaName,
  ingredients,
  nutrients,
}) {

  const ingredientData = {
    labels: Object.keys(ingredients),
    datasets: [
      {
        data: Object.values(ingredients),
        backgroundColor: ["#CBBFB4", "#D8CDC3", "#E7DFD7", "#FAF6F1"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const nutrientData = {
    labels: Object.keys(nutrients),
    datasets: [
      {
        data: Object.values(nutrients),
        backgroundColor: ["#6C5F57", "#A58F85", "#D8CDC3"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    plugins: { legend: { position: "bottom" } },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 w-full h-screen bg-black z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-2xl md:max-w-3xl p-4 sm:p-5 shadow-lg">
              
              {/* Modal Title */}
              <h2 className="text-xl sm:text-2xl font-semibold text-[#6C5F57] mb-3">{formulaName}</h2>

              {/* Highlighted Instruction */}
              <div className="bg-[#FFF1E5] text-[#6C5F57] p-2 rounded-xl mb-4 text-center font-medium text-sm">
                Perhatikan bahan dan nutrisi sebelum memilih formula.
              </div>

              {/* Ingredients Table */}
              <div className="mb-4 overflow-x-auto">
                <table className="min-w-full bg-white rounded-2xl shadow-md overflow-hidden text-sm">
                  <thead className="bg-[#F5F0EB]">
                    <tr>
                      <th className="text-left px-3 py-2 text-[#6C5F57] font-medium">Bahan</th>
                      <th className="text-left px-3 py-2 text-[#6C5F57] font-medium">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(ingredients).map(([key, value]) => (
                      <tr key={key} className="border-b last:border-b-0 border-gray-200 hover:bg-[#FAF6F1] transition-colors">
                        <td className="px-3 py-2 text-[#6C5F57]">{key}</td>
                        <td className="px-3 py-2 text-[#6C5F57]">{value}g</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Charts Side by Side (stack on small screens) */}
              <div className="flex flex-row flex-wrap gap-4 mb-4 justify-center sm:justify-start">
                {/* Ingredients Pie */}
                <div className="flex-1 w-full max-w-[150px] sm:max-w-none sm:h-30 p-1">
                    <h3 className="font-medium text-[#6C5F57] mb-1 text-sm text-center sm:text-left">Ingredients (%)</h3>
                    <div className="w-full aspect-[1/1] sm:aspect-auto">
                    <Pie data={ingredientData} options={chartOptions} />
                    </div>
                </div>

                {/* Nutrients Pie */}
                <div className="flex-1 w-full max-w-[150px] sm:max-w-none sm:h-30 p-1">
                    <h3 className="font-medium text-[#6C5F57] mb-1 text-sm text-center sm:text-left">Nutrients per 100g</h3>
                    <div className="w-full aspect-[1/1] sm:aspect-auto">
                    <Pie data={nutrientData} options={chartOptions} />
                    </div>
                </div>
              </div>

              {/* Buttons + Info Text */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
                {/* Info Text */}
                <div className="text-[#6C5F57] font-medium bg-[#FFF1E5] px-3 py-2 rounded-xl text-xs text-center sm:text-left">
                  Klik Choose Formula untuk mulai menggiling
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-gray-200 text-[#6C5F57] hover:bg-gray-300 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onChoose}
                    className="px-4 py-2 rounded-xl bg-[#CBBFB4] text-white hover:bg-[#bca8a0] text-sm"
                  >
                    Choose Formula
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
