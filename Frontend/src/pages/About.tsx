import { FaBalanceScale, FaLightbulb, FaMapMarkedAlt } from "react-icons/fa";

export default function About() {
  const features = [
    {
      icon: <FaMapMarkedAlt />,
      title: "Fokus Kota Tegal",
      desc: "Semua hotel yang ditampilkan berlokasi di Tegal, jadi rekomendasinya benar-benar relevan.",
    },
    {
      icon: <FaBalanceScale />,
      title: "6 Kriteria Terukur",
      desc: "Harga, jarak, rating, fasilitas, kebersihan, dan pelayanan dinilai secara konsisten untuk tiap hotel.",
    },
    {
      icon: <FaLightbulb />,
      title: "Rekomendasi Transparan",
      desc: "Menggunakan metode Simple Additive Weighting (SAW) — kamu bisa lihat sendiri kenapa sebuah hotel direkomendasikan.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="bg-gradient-to-br from-sky-600 via-cyan-500 to-sky-400 text-white py-20 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Tentang WisTour</h1>
          <p className="mt-4 text-sky-100">
            Sistem pendukung keputusan pemilihan hotel terbaik, khusus untuk Kota Tegal
          </p>
        </div>
      </section>

      {/* DESKRIPSI */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-slate-800">Apa itu WisTour?</h2>
        <p className="mt-6 text-slate-600 leading-relaxed">
          WisTour adalah platform yang membantu kamu memilih hotel terbaik di Kota Tegal.
          Alih-alih hanya menampilkan daftar hotel, WisTour membandingkan setiap hotel
          menggunakan Sistem Pendukung Keputusan (SPK) metode{" "}
          <span className="font-semibold">Simple Additive Weighting (SAW)</span> — sehingga
          rekomendasi yang muncul benar-benar berdasarkan data, bukan sekadar urutan acak
          atau iklan berbayar.
        </p>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-center text-slate-800">
          Kenapa Pakai WisTour?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-3xl p-8 shadow hover:shadow-lg transition text-center border border-slate-100"
            >
              <div className="text-4xl text-sky-600 flex justify-center">{f.icon}</div>
              <h3 className="mt-5 text-xl font-semibold">{f.title}</h3>
              <p className="mt-3 text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* METODE */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-2xl font-bold text-sky-600">Bagaimana Cara Kerjanya?</h3>
            <p className="mt-4 text-slate-600">
              Setiap hotel dinilai berdasarkan 6 kriteria: harga (30%), jarak (20%), rating
              (15%), fasilitas (15%), kebersihan (10%), dan pelayanan (10%). Kamu juga bisa
              mengubah bobot prioritas ini langsung di halaman pencarian hotel.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-sky-600">Kenapa Metode SAW?</h3>
            <p className="mt-4 text-slate-600">
              SAW menormalisasi nilai tiap kriteria lalu menjumlahkannya sesuai bobot,
              sehingga hasil perankingan mudah ditelusuri dan dijelaskan — cocok untuk
              keputusan yang butuh transparansi, seperti memilih tempat menginap.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-r from-sky-600 to-cyan-500 text-white rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold">Siap Cari Hotel Terbaik di Tegal?</h2>
            <p className="mt-4 text-sky-100">
              Sesuaikan prioritasmu dan temukan hotel yang paling pas dalam hitungan detik.
            </p>
            <a
              href="/accommodation"
              className="inline-block mt-8 bg-white text-sky-600 px-8 py-3 rounded-xl font-semibold hover:scale-105 transition"
            >
              Mulai Cari Hotel
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
