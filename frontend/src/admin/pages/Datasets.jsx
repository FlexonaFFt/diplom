import { useState } from "react";
import { Download, Plus } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import Badge from "../../shared/ui/Badge.jsx";

const INIT = [
  { id: 1, name: "submissions-2025-01-01.csv", size: "12.4 MB", created: "2025-01-01 12:30", status: "Готово" },
  { id: 2, name: "users-2025-02-10.csv",       size: "1.9 MB",  created: "2025-02-10 09:12", status: "Готово" },
];

export default function Datasets() {
  const [rows, setRows] = useState(INIT);

  const createExport = () => {
    const id = rows.length + 1;
    const draft = {
      id,
      name: `export-${id}.csv`,
      size: "—",
      created: new Date().toLocaleString("ru-RU"),
      status: "В процессе",
    };
    setRows([draft, ...rows]);
    setTimeout(() => {
      setRows((cur) =>
        cur.map((r) =>
          r.id === id ? { ...r, size: "3.1 MB", status: "Готово" } : r,
        ),
      );
    }, 1200);
  };

  return (
    <section className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Datasets</h1>
        <button
          onClick={createExport}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 hover:bg-slate-50"
        >
          <Plus className="h-4 w-4" /> Создать экспорт
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                {["Файл", "Размер", "Создан", "Статус", ""].map((h) => (
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
                  <td className="px-4 py-3 text-sm">{r.size}</td>
                  <td className="px-4 py-3 text-sm">{r.created}</td>
                  <td className="px-4 py-3">
                    <Badge variant={r.status === "Готово" ? "success" : r.status === "В процессе" ? "default" : "warn"}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.status === "Готово" ? (
                      <a
                        href="#"
                        className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Download className="h-4 w-4" /> Скачать
                      </a>
                    ) : (
                      <span className="text-sm text-slate-400">—</span>
                    )}
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
