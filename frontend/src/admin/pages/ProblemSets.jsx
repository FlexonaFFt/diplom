import { useState } from "react";
import { Plus } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import Badge from "../../shared/ui/Badge.jsx";

const INIT = [
  { id: 1, name: "Алгоритмы базовые", problems: 12, updated: "2025-01-09", status: "Опубликован" },
  { id: 2, name: "Графы старт",       problems: 8,  updated: "2025-02-14", status: "Черновик" },
];

export default function ProblemSets() {
  const [rows, setRows] = useState(INIT);

  const addSet = () => {
    const next = {
      id: rows.length + 1,
      name: `Набор #${rows.length + 1}`,
      problems: Math.floor(5 + Math.random() * 10),
      updated: new Date().toISOString().slice(0, 10),
      status: "Черновик",
    };
    setRows([next, ...rows]);
  };

  return (
    <section className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Problem Sets</h1>
        <button
          onClick={addSet}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 hover:bg-slate-50"
        >
          <Plus className="h-4 w-4" /> Создать набор
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                {["Набор", "Задач", "Обновлён", "Статус"].map((h) => (
                  <th key={h} className="bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="even:bg-white odd:bg-slate-50/40">
                  <td className="px-4 py-3 text-sm">{r.name}</td>
                  <td className="px-4 py-3 text-sm">{r.problems}</td>
                  <td className="px-4 py-3 text-sm">{new Date(r.updated).toLocaleDateString("ru-RU")}</td>
                  <td className="px-4 py-3">
                    <Badge variant={r.status === "Опубликован" ? "success" : "default"}>{r.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
