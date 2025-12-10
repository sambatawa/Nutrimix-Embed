"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function InformasiSistem({
  formulas = [],
  formulaData = {},
  selected = "",
  onSelect = () => {},
  overallDistribution = null,
}) {
  const initial = selected || (formulas.length ? formulas[0] : "");
  const [current, setCurrent] = useState(initial);

  useEffect(() => {
    if (selected && selected !== current) setCurrent(selected);
  }, [selected]);

  const handleChange = (name) => {
    setCurrent(name);
    onSelect(name);
  };

  /* ================================
     1) LINE CHART (high contrast)
  ================================= */
  const lineSeries = useMemo(() => {
    const seed = current.split("").reduce((s, ch) => s + ch.charCodeAt(0), 0);
    const values = Array.from({ length: 24 }, (_, h) => {
      const base = Math.floor(Math.abs(Math.sin((h + seed / 10) * 0.7)) * 20) + 2;
      const mod =
        h >= 7 && h <= 9
          ? 8
          : h >= 12 && h <= 14
          ? 12
          : h >= 18 && h <= 20
          ? 10
          : 0;
      return base + Math.floor(mod * Math.abs(Math.cos((seed + h) / 10)));
    });
    return [{ name: current || "Formula", data: values }];
  }, [current]);

  const lineOptions = useMemo(
    () => ({
      chart: {
        id: "clicks-line",
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      stroke: {
        curve: "smooth",
        width: 4, // thicker
        colors: ["#000000"], // high contrast blue
      },
      markers: {
        size: 5,
        colors: ["#000000"],
        strokeWidth: 2,
      },
      xaxis: {
        categories: Array.from({ length: 24 }, (_, i) => `${i}`),
        labels: { style: { fontSize: "12px", colors: "#6C5F57" } },
        title: { text: "Hour", style: { fontSize: "13px", color: "#6C5F57" } },
      },
      yaxis: {
        labels: { style: { fontSize: "12px", colors: "#6C5F57" } },
      },
      grid: {
        borderColor: "#D8D0C8",
        strokeDashArray: 4,
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          opacityFrom: 0.50,
          opacityTo: 0.05,
        },
      },
      tooltip: { theme: "light" },
      legend: { show: false },
    }),
    []
  );

  /* ================================
     2) DOUGHNUT CHART (more contrast & bigger)
  ================================= */
  const doughnutSeries = useMemo(() => {
    if (overallDistribution) return Object.values(overallDistribution);
    return formulas.map((f, idx) => 20 + (idx % 3) * 5);
  }, [overallDistribution, formulas]);

  const doughnutLabels = useMemo(
    () => (overallDistribution ? Object.keys(overallDistribution) : formulas),
    [overallDistribution, formulas]
  );

  const doughnutOptions = useMemo(
    () => ({
      chart: { toolbar: { show: false } },
      labels: doughnutLabels,
      legend: { position: "bottom", fontSize: "13px" },

      plotOptions: {
        pie: {
          donut: { size: "72%" }, // bigger donut
        },
      },

      // HIGH CONTRAST COLORS
      colors: [
        "#4F46E5", // indigo
        "#F59E0B", // yellow
        "#EF4444", // red
        "#10B981", // green
        "#EC4899", // pink
        "#6366F1", // purple
      ],

      tooltip: { theme: "light" },
    }),
    [doughnutLabels]
  );

  /* ================================
     3) RADAR CHART (stronger contrast)
  ================================= */
  const radarSeries = useMemo(() => {
    const nutrients = formulaData[current] || { protein: 0, fat: 0, fiber: 0 };
    return [
      {
        name: current,
        data: [
          nutrients.protein || 0,
          nutrients.fat || 0,
          nutrients.fiber || 0,
        ],
      },
    ];
  }, [current, formulaData]);

  const radarOptions = useMemo(
    () => ({
      chart: { toolbar: { show: false } },
      xaxis: {
        categories: ["Protein", "Fat", "Fiber"],
        labels: { style: { fontSize: "13px", colors: "#6C5F57" } },
      },

      stroke: {
        show: true,
        width: 3, // thicker
        colors: ["#059669"], // high contrast green
      },

      fill: { opacity: 0.25, colors: ["#10B981"] },

      markers: { size: 5, colors: ["#047857"] },

      yaxis: { show: false },
      legend: { show: false },
      tooltip: { theme: "light" },
    }),
    []
  );

  /* ================================
     RENDER
  ================================= */
  return (
    <section className="p-4 rounded-2xl bg-white/80 backdrop-blur-md shadow-md border border-[#EDE6DF]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#6C5F57]">Informasi Detail Formula</h3>

        {/* Dropdown */}
        <div className="relative inline-flex items-center">
          <select
            value={current}
            onChange={(e) => handleChange(e.target.value)}
            className="appearance-none bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm shadow-sm pr-8"
          >
            {formulas.map((f) => (
              <option value={f} key={f}>
                {f}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Line Chart */}
        <div className="w-full lg:w-[70%] bg-white/0 rounded-lg p-2">
          <div className="h-72 lg:h-[360px]"> {/* bigger */}
            <Chart
              options={lineOptions}
              series={lineSeries}
              type="line"
              height={"100%"}
            />
          </div>
          <p className="text-xs text-[#6C5F57] mt-2">
            Clicks per hour (last 24 hours) — {current}
          </p>
        </div>

        {/* Right column */}
        <div className="w-full lg:w-[30%] flex flex-col gap-4">
          {/* Doughnut */}
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="h-48"> {/* bigger */}
              <Chart
                options={doughnutOptions}
                series={doughnutSeries}
                type="donut"
                height={"100%"}
              />
            </div>
            <p className="text-xs text-[#6C5F57] mt-2">
              Overall clicks distribution
            </p>
          </div>

          {/* Radar */}
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="h-48"> {/* bigger */}
              <Chart
                options={radarOptions}
                series={radarSeries}
                type="radar"
                height={"100%"}
              />
            </div>
            <p className="text-xs text-[#6C5F57] mt-2">
              Nutrients (per 100g) — {current}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
