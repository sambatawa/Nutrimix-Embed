"use client";

import { useState } from "react";
import FormulaCard from "@/components/dashboard/FormulaCard";
import InfoCard from "@/components/dashboard/InfoCard";
import Notification from "@/components/dashboard/Notification";
import FormulaModal from "@/components/dashboard/FormulaModal";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import InformasiSistem from "@/components/dashboard/InformasiSistem"; // <-- NEW

const formulas = [
  "Formula 1",
  "Formula 2",
  "Formula 3",
  "Formula 4",
  "Formula 5",
  "Formula 6",
];

const formulaCatchphrases = {
  "Formula 1": "Untuk nutrisi penuh",
  "Formula 2": "Untuk menghemat bahan",
  "Formula 3": "Untuk energi maksimal",
  "Formula 4": "Untuk kesehatan optimal",
  "Formula 5": "Untuk pertumbuhan cepat",
  "Formula 6": "Untuk rasa lezat",
};

const formulaData = {
  "Formula 1": { protein: 40, fat: 20, fiber: 10 },
  "Formula 2": { protein: 50, fat: 10, fiber: 5 },
  "Formula 3": { protein: 35, fat: 25, fiber: 12 },
  "Formula 4": { protein: 45, fat: 15, fiber: 14 },
  "Formula 5": { protein: 30, fat: 18, fiber: 9 },
  "Formula 6": { protein: 55, fat: 12, fiber: 11 },
};

export default function DashboardPage() {
  const [selectedFormula, setSelectedFormula] = useState("Formula 1");
  const [showNotification, setShowNotification] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalFormula, setModalFormula] = useState("Formula 1");

  const handleSelect = (f) => {
    setSelectedFormula(f);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleCardClick = (f) => {
    setModalFormula(f);
    setShowModal(true);
  };

  const handleChooseFormula = () => {
    setShowModal(false);
    handleSelect(modalFormula);
  };

  return (
    <div className="space-y-6 mt-2">
      {/* Dashboard Header */}
      <DashboardHeader />

      {/* Formula Cards Section */}
      <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md shadow-md border border-[#EDE6DF] space-y-4">
        <h3 className="text-lg font-semibold text-[#6C5F57]">Pilih Formula</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {formulas.map((f) => (
            <FormulaCard
              key={f}
              name={f}
              catchphrase={formulaCatchphrases[f]}
              isActive={selectedFormula === f}
              onClick={() => handleCardClick(f)}
            />
          ))}
        </div>
      </div>

      {/* Informasi Sistem (REPLACES ChartBox) */}
      <InformasiSistem
        formulas={formulas}
        formulaData={formulaData}
        selected={selectedFormula}
        onSelect={(f) => setSelectedFormula(f)}
        overallDistribution={{
          "Formula 1": 120,
          "Formula 2": 90,
          "Formula 3": 75,
          "Formula 4": 60,
          "Formula 5": 40,
          "Formula 6": 30,
        }}
      />

      {/* Info Card (nutrisi) */}
      <InfoCard title={selectedFormula} data={formulaData[selectedFormula]} />

      {/* Notification */}
      <Notification
        show={showNotification}
        message={`Proses Menggiling ${selectedFormula}`}
      />

      {/* Formula Modal */}
      <FormulaModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onChoose={handleChooseFormula}
        formulaName={modalFormula}
        ingredients={{ Wheat: 35, Corn: 25, Soy: 30, Salt: 10 }}
        nutrients={{ Protein: 40, Fat: 20, Fiber: 10 }}
      />
    </div>
  );
}
