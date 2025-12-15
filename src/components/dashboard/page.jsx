"use client";

import { useState, useEffect, createRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FormulaCard from "@/components/dashboard/FormulaCard";
import Notification from "@/components/dashboard/Notification";
import FormulaModal from "@/components/dashboard/FormulaModal";
import TankFillingPage from "@/components/dashboard/TankVisualization";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import InformasiSistem from "@/components/dashboard/InformasiSistem";
import { getAllFormulas, listenToDeviceData, sendCommandToDevice } from "@/lib/firebase";

export default function DashboardPage() {
  const [formulas, setFormulas] = useState([]);
  const [biasaFormulas, setBiasaFormulas] = useState([]);
  const [hematFormulas, setHematFormulas] = useState([]);
  const [selectedFormula, setSelectedFormula] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTankPage, setShowTankPage] = useState(false);
  const [modalFormula, setModalFormula] = useState("");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [deviceData, setDeviceData] = useState(null);
  const carouselRef = createRef();

  const handleSelect = (f) => {
    setSelectedFormula(f);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleCardClick = (f) => {
    setModalFormula(f);
    setShowModal(true);
  };

  const handleChooseFormula = async () => {
    setShowModal(false);
    handleSelect(modalFormula);
    
    const formulaId = formulas.findIndex(f => f.name === modalFormula) + 1;
    
    const command = {
      event: "SELECT_FORMULA",
      formula: formulaId,
      formulaName: modalFormula,
      mode: "FORMULA_MODE"
    };
    
    await sendCommandToDevice(command);
    
    setShowTankPage(true);
  };

  const handleOpenModal = (f) => {
    setModalFormula(f);
    setShowModal(true);
  };

  const checkScrollPosition = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
      setTimeout(checkScrollPosition, 300);
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
      setTimeout(checkScrollPosition, 300);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const unsubscribe = listenToDeviceData((data) => {
      setDeviceData(data);
      setDeviceConnected(true);
      
      if (data.state === "CHOOSE_MODE") {
        setDeviceConnected(true);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    const fetchFormulas = async () => {
      try {
        setLoading(true);
        const formulasData = await getAllFormulas();
        setFormulas(formulasData);
        const biasa = formulasData.filter(f => f.category === 'biasa');
        const hemat = formulasData.filter(f => f.category === 'hemat');
        setBiasaFormulas(biasa);
        setHematFormulas(hemat);
        if (formulasData.length > 0) {
          setSelectedFormula(formulasData[0].name);
          setModalFormula(formulasData[0].name);
        }
      } catch (error) {
        console.error('Error fetching formulas:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFormulas();
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [mounted]);

  return (
    <div className="relative z-10">
      <DashboardHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="p-6 rounded-2xl bg-white/30 backdrop-blur-md shadow-md border border-[#EDE6DF] space-y-4 lg:col-span-2">
          <h3 className="text-lg font-semibold text-[#6C5F57]">Formula Biasa</h3>
          <div className="relative">
            {!loading && biasaFormulas.length > 1 && canScrollLeft && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1, rotate: -15 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollLeft}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white p-3 transition-all duration-300 group"
              >
                <motion.div animate={{ x: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="flex items-center justify-center">
                  <ChevronLeft className="w-5 h-5" />
                </motion.div>
                <motion.div className="absolute inset-0 rounded-full bg-linear-to-t from-[#D4A574] to-[#E8D5C4] opacity-0" whileHover={{ opacity: 0.3 }} transition={{ duration: 0.3 }}/>
              </motion.button>
            )}

            {!loading && biasaFormulas.length > 1 && canScrollRight && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollRight}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white p-3 transition-all duration-300 group"
              >
                <motion.div animate={{ x: [0, 3, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="flex items-center justify-center">
                  <ChevronRight className="w-5 h-5" />
                </motion.div>
                <motion.div className="absolute inset-0 rounded-full bg-linear-to-b from-[#D4A574] to-[#E8D5C4] opacity-0" whileHover={{ opacity: 0.3 }} transition={{ duration: 0.3 }}/>
              </motion.button>
            )}

            <div 
              ref={carouselRef}
              onScroll={checkScrollPosition}
              className="flex overflow-x-auto gap-4 scrollbar-hide pb-2 scroll-smooth p-2"
            >
              {loading ? (
                <div className="flex items-center justify-center w-full py-8">
                  <p className="text-[#7d6f66]">Memuat formula...</p>
                </div>
              ) : biasaFormulas.length === 0 ? (
                <div className="flex items-center justify-center w-full py-8">
                  <p className="text-[#7d6f66]">Belum ada formula biasa</p>
                </div>
              ) : (
                biasaFormulas.map((formula) => (
                  <div key={formula.id} className="flex shrink-0 w-80">
                    <FormulaCard
                      title={formula.name}
                      catchphrase={formula.ingredients}
                      data={formula}
                      selected={selectedFormula === formula.name}
                      onSelect={() => handleSelect(formula.name)}
                      onModal={() => handleOpenModal(formula.name)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/40 backdrop-blur-md shadow-md border border-[#EDE6DF] space-y-4">
          <h3 className="text-lg font-semibold text-[#D4A574]">Formula Hemat</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-[#7d6f66]">Memuat formula...</p>
            </div>
          ) : hematFormulas.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-[#7d6f66]">Belum ada formula hemat</p>
            </div>
          ) : (
            hematFormulas.map((formula) => (
              <FormulaCard
                key={formula.id}
                title={formula.name}
                catchphrase={formula.ingredients}
                data={formula}
                selected={selectedFormula === formula.name}
                onSelect={() => handleSelect(formula.name)}
                onModal={() => handleOpenModal(formula.name)}
              />
            ))
          )}
        </div>
      </div>

      {showTankPage && (
        <TankFillingPage 
          isVisible={showTankPage}
          onClose={async () => {
            await sendCommandToDevice({
              event: "STOP_PROCESS",
              mode: "NONE"
            });
            setShowTankPage(false);
          }}
          formulaName={selectedFormula}
          totalWeight={(formulas.find(f => f.name === selectedFormula)?.total_weight || 0) * 1000}
          deviceData={deviceData}
          deviceConnected={deviceConnected}
        />
      )}

      <InformasiSistem
        formulas={formulas}
        formulaData={formulas}
        selected={selectedFormula}
        onSelect={(f) => setSelectedFormula(f)}
        overallDistribution={formulas.reduce((acc, formula) => {
          acc[formula.name] = 100;
          return acc;
        }, {})}
      />

      <Notification
        show={showNotification}
        message={`Proses Menggiling ${selectedFormula}`}
      />

      <FormulaModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onChoose={handleChooseFormula}
        formulaName={modalFormula}
        ingredients={formulas.find(f => f.name === modalFormula)?.steps?.reduce((acc, step) => {
          acc[step.material] = step.target_weight;
          return acc;
        }, {}) || {}}
        nutrients={{ 
          Protein: formulas.find(f => f.name === modalFormula)?.protein || 0, 
          Fat: formulas.find(f => f.name === modalFormula)?.fat || 0, 
          Fiber: formulas.find(f => f.name === modalFormula)?.fiber || 0 
        }}
      />
    </div>
  );
}
