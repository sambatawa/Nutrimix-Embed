export default function ChartBox({ data, title }) {
    return (
      <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-[#EDE6DF] shadow-sm">
        <h2 className="font-semibold text-[#6C5F57] mb-4">{title} – Nutrient Chart</h2>
  
        <div className="space-y-4">
          {Object.entries(data).map(([label, value]) => (
            <div key={label}>
              <p className="text-sm font-medium text-[#7d6f66]">{label.toUpperCase()}</p>
              <div className="w-full bg-[#EDE6DF] h-3 rounded-xl">
                <div
                  className="h-3 rounded-xl bg-[#CBBFB4]"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  