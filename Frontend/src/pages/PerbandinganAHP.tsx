import { useEffect, useMemo, useState } from "react";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import api from "../utils/api";




const AHP_SCALE = [
  { value: 1, label: "1 - Sama penting" },
  { value: 2, label: "2 - Sedikit lebih penting" },
  { value: 3, label: "3 - Lebih penting" },
  { value: 4, label: "4 - Jauh lebih penting" },
  { value: 5, label: "5 - Sangat lebih penting" },
  { value: 6, label: "6 - Antara 5 dan 7" },
  { value: 7, label: "7 - Sangat penting" },
  { value: 8, label: "8 - Antara 7 dan 9" },
  { value: 9, label: "9 - Mutlak lebih penting" },
];
interface Kriteria {
  id_kriteria: number;
  kode: string;
  nama: string;
  bobot?: number;
  tipe?: string;
}

interface PerbandinganKriteria {
  id: number;
  kriteria1Id: number;
  kriteria2Id: number;
  nilai: number;
}
export default function PerbandinganAHP() {
  const [loading, setLoading] = useState(false);

  const [kriterias, setKriterias] = useState<Kriteria[]>([]);
  const [perbandingans, setPerbandingans] = useState<PerbandinganKriteria[]>([]);

  const [modal, setModal] = useState<{
    open: boolean;
    mode: "add" | "edit";
    id?: number;
  }>({
    open: false,
    mode: "add",
  });

  const [form, setForm] = useState<Omit<PerbandinganKriteria, "id">>({
    kriteria1Id: 0,
    kriteria2Id: 0,
    nilai: 1,
  });

  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const loadKriteria = async () => {
    try {
      const res = await api.get("/kriteria");

      console.log("KRITERIA =", res.data);

      setKriterias(
        (res.data.data || []).map((k: any) => ({
          id_kriteria: k.id,
          kode: k.kode,
          nama: k.nama,
          bobot: k.bobot,
          tipe: k.jenis,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

 const loadPerbandingan = async () => {
  try {
    setLoading(true);

    const res = await api.get("/api/ahp");

    // console.log("AHP RESPONSE:", res);
    // console.log("AHP DATA:", res.data);

    setPerbandingans(res.data);

  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    setLoading(false);
  }
};
  const getNama = (id: number) =>
    kriterias.find((k) => k.id_kriteria === id)?.nama ?? "-";

  const getKode = (id: number) =>
    kriterias.find((k) => k.id_kriteria === id)?.kode ?? "-";
  const matrixMap = useMemo(() => {
    const map = new Map<string, number>();

    perbandingans.forEach((p) => {
      map.set(`${p.kriteria1Id}-${p.kriteria2Id}`, p.nilai);

      map.set(
        `${p.kriteria2Id}-${p.kriteria1Id}`,
        1 / p.nilai
      );
    });

    return map;
  }, [perbandingans]);
  const openAdd = () => {
    if (kriterias.length < 2) return;

    setForm({
      kriteria1Id: kriterias[0].id_kriteria,
      kriteria2Id: kriterias[1].id_kriteria,
      nilai: 1,
    });

    setModal({
      open: true,
      mode: "add",
    });
  };
  const openEdit = (item: PerbandinganKriteria) => {
    const { id, ...rest } = item;

    setForm(rest);

    setModal({
      open: true,
      mode: "edit",
      id,
    });
  };
  const handleSave = async () => {
    try {
      if (modal.mode === "add") {
        await api.post("/api/ahp/save", {
          rekomendasiId: 1,
          comparisons: [
            {
              kriteria1Id: form.kriteria1Id,
              kriteria2Id: form.kriteria2Id,
              nilai: form.nilai,
            },
          ],
        });
      } else {
        await api.put(`/api/ahp/${modal.id}`, form);
      }

      // Refresh data
      await loadPerbandingan();

      // Hitung ulang AHP
      await loadHasilAHP();

      setModal({
        open: false,
        mode: "add",
      });

      alert("Berhasil disimpan");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan");
    }
  };
  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await api.delete(`/api/ahp/${deleteTarget}`);

      await loadPerbandingan();

      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus");
    }
  };
  const [hasilAHP, setHasilAHP] = useState<any>(null);

  const loadHasilAHP = async () => {
    try {
      const res = await api.post("/api/ahp/hitung", {
        rekomendasiId: 1,
      });

      console.log("HASIL AHP");
      console.log(res.data);

      setHasilAHP(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadKriteria();
    loadPerbandingan();
    loadHasilAHP();
  }, []);

  // function lainnya...



  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Perbandingan Kriteria AHP
          </h1>
          <p className="text-sm text-slate-500">
            Bandingkan tingkat kepentingan antar kriteria menggunakan skala Saaty.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700"
        >
          <FaPlus />
          Tambah
        </button>
      </div>

      {/* Info */}
      <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 flex gap-3">
        <FaInfoCircle className="text-sky-600 mt-1" />

        <div>
          <p className="font-semibold text-sky-700">
            Analytic Hierarchy Process
          </p>

          <p className="text-sm text-sky-600">
            Nilai diagonal selalu 1. Nilai kebalikannya dihitung otomatis.
          </p>
        </div>
      </div>

      {/* Matrix */}
      <div className="bg-white rounded-xl border overflow-auto">

        <table className="min-w-full text-sm">

          <thead className="bg-slate-50">

            <tr>

              <th className="border p-3"></th>

              {kriterias.map((k) => (
                <th
                  key={k.id_kriteria}
                  className="border p-3"
                >
                  {k.kode}
                </th>
              ))}

            </tr>

          </thead>

          <tbody>

            {kriterias.map((r) => (

              <tr key={r.id_kriteria}>

                <td className="border p-3 font-semibold">
                  {r.kode}
                </td>

                {kriterias.map((c) => {

                  const value =
                    r.id_kriteria === c.id_kriteria
                      ? 1
                      : matrixMap.get(
                        `${r.id_kriteria}-${c.id_kriteria}`
                      );

                  return (
                    <td
                      key={c.id_kriteria}
                      className="border p-3 text-center"
                    >
                      {value
                        ? Number.isInteger(value)
                          ? value
                          : value.toFixed(3)
                        : "-"}
                    </td>
                  );
                })}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Table */}

      <div className="bg-white rounded-xl border overflow-hidden">
        {/* <pre>{JSON.stringify(perbandingans, null, 2)}</pre> */}
        <table className="min-w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="p-3 text-left">
                Kriteria 1
              </th>

              <th className="p-3">
                Nilai
              </th>

              <th className="p-3 text-left">
                Kriteria 2
              </th>

              <th className="p-3">
                Aksi
              </th>

            </tr>

          </thead>

          <tbody>

            {loading && (

              <tr>

                <td
                  colSpan={4}
                  className="text-center py-10"
                >
                  Loading...
                </td>

              </tr>

            )}

            {!loading &&
              perbandingans.map((item) => (

                <tr
                  key={item.id}
                  className="border-t"
                >

                  <td className="p-3">
                    <b>{getKode(item.kriteria1Id)}</b>
                    {" - "}
                    {getNama(item.kriteria1Id)}
                  </td>

                  <td className="text-center">
                    {item.nilai}
                  </td>

                  <td className="p-3">
                    <b>{getKode(item.kriteria2Id)}</b>
                    {" - "}
                    {getNama(item.kriteria2Id)}
                  </td>

                  <td>

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => openEdit(item)}
                        className="p-2 rounded bg-yellow-100 text-yellow-600"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() =>
                          setDeleteTarget(item.id)
                        }
                        className="p-2 rounded bg-red-100 text-red-600"
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>
      {/* Modal Add / Edit */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">

            <div className="border-b px-6 py-4">
              <h2 className="font-bold text-lg">
                {modal.mode === "add"
                  ? "Tambah Perbandingan"
                  : "Edit Perbandingan"}
              </h2>
            </div>

            <div className="p-6 space-y-4">

              <div>
                <label className="text-sm font-medium">
                  Kriteria 1
                </label>

                <select
                  className="w-full border rounded-xl p-3 mt-1"
                  value={form.kriteria1Id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      kriteria1Id: Number(e.target.value),
                    })
                  }
                >
                  {kriterias.map((k) => (
                    <option
                      key={k.id_kriteria}
                      value={k.id_kriteria}
                    >
                      {k.kode} - {k.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Kriteria 2
                </label>

                <select
                  className="w-full border rounded-xl p-3 mt-1"
                  value={form.kriteria2Id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      kriteria2Id: Number(e.target.value),
                    })
                  }
                >
                  {kriterias.map((k) => (
                    <option
                      key={k.id_kriteria}
                      value={k.id_kriteria}
                    >
                      {k.kode} - {k.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Nilai Perbandingan
                </label>

                <select
                  className="w-full border rounded-xl p-3 mt-1"
                  value={form.nilai}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      nilai: Number(e.target.value),
                    })
                  }
                >
                  {AHP_SCALE.map((s) => (
                    <option
                      key={s.value}
                      value={s.value}
                    >
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="border-t px-6 py-4 flex justify-end gap-3">

              <button
                onClick={() =>
                  setModal({
                    open: false,
                    mode: "add",
                  })
                }
                className="px-4 py-2 rounded-xl border"
              >
                Batal
              </button>

              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-sky-600 text-white"
              >
                Simpan
              </button>

            </div>

          </div>
        </div>
      )}

      {/* Modal Delete */}

      {deleteTarget !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white rounded-2xl w-full max-w-sm p-6">

            <div className="flex justify-center mb-4">

              <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <FaExclamationTriangle size={22} />
              </div>

            </div>

            <h2 className="font-bold text-center text-lg">
              Hapus Perbandingan?
            </h2>

            <p className="text-center text-sm text-slate-500 mt-2">
              Data yang dihapus tidak dapat dikembalikan.
            </p>

            <div className="flex gap-3 mt-6">

              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 border rounded-xl py-2"
              >
                Batal
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white rounded-xl py-2"
              >
                Hapus
              </button>

            </div>

          </div>

        </div>
      )}
      {hasilAHP && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-bold mb-4">
            Bobot Prioritas AHP
          </h2>

          <table className="min-w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 border">Kriteria</th>
                <th className="p-3 border">Bobot</th>
              </tr>
            </thead>

            <tbody>
              {hasilAHP.weights.map((item: any) => (
                <tr key={item.kriteriaId}>
                  <td className="border p-3">
                    {item.nama}
                  </td>

                  <td className="border p-3 text-center">
                    {item.bobot.toFixed(6)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {hasilAHP && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-bold mb-3">
            Uji Konsistensi
          </h2>

          <div className="space-y-2">

            <p>
              <b>λ Max :</b> {hasilAHP.lambdaMax.toFixed(4)}
            </p>

            <p>
              <b>CI :</b> {hasilAHP.ci.toFixed(4)}
            </p>

            <p>
              <b>RI :</b> {hasilAHP.cr.toFixed(4)}
            </p>

            <p className={hasilAHP.cr <= 0.1 ? "text-green-600" : "text-red-600"}>
              {hasilAHP.cr <= 0.1
                ? "Konsisten"
                : "Tidak Konsisten"}
            </p>

          </div>
        </div>
      )}

    </div>

  );
}