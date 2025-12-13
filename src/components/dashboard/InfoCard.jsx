export default function InfoCard({ title, data }) {
    return (
      <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-[#EDE6DF] shadow-sm">
        <h2 className="font-semibold text-[#6C5F57] mb-2">Informasi {title}</h2>
  
        <p className="text-sm text-[#7d6f66]">
          Deskripsi dummy tentang {title}. Anda bisa mengubah konten ini sesuai
          kebutuhan aplikasi Anda.
        </p>
  
        <div className="mt-4 text-sm">
          <p>Protein: {data.protein}</p>
          <p>Lemak: {data.fat}</p>
          <p>Serat: {data.fiber}</p>
        </div>
      </div>
    );
  }
  