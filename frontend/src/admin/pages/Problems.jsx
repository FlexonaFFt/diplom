import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import Badge from "../../shared/ui/Badge.jsx";

const ALL = [
  { id: 1, code: "A", title: "Две суммы",               difficulty: "Лёгкая",  tags: ["массивы"],         status: "Готово" },
  { id: 2, code: "B", title: "Пути в графе",            difficulty: "Средняя", tags: ["графы", "поиск"],   status: "Готово" },
  { id: 3, code: "C", title: "Решето простых",          difficulty: "Лёгкая",  tags: ["матем", "prime"],   status: "Готово" },
  { id: 4, code: "D", title: "Редактор",                difficulty: "Сложная", tags: ["строки", "dp"],     status: "В работе" },
  { id: 5, code: "E", title: "Рюкзак (DP)",             difficulty: "Средняя", tags: ["dp"],               status: "Готово" },
  { id: 6, code: "F", title: "Дерево отрезков",         difficulty: "Сложная", tags: ["структуры"],        status: "Готово" },
];

export default function Problems() {
  const [q, setQ] = useState("");
  const [diff, setDiff] = useState("Все");

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return ALL.filter((p) => {
      const byText = !s || p.title.toLowerCase().includes(s) || p.code.toLowerCase().includes(s);
      const byDiff = diff === "Все" || p.difficulty === diff;
      return byText && byDiff;
    });
  }, [q, diff]);

  return (
    <section className="p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Problems</h1>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск по названию или коду"
            className="h-9 rounded-xl border border-slate-200 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          />
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={diff}
              onChange={(e) => setDiff(e.target.value)}
              className="h-8 bg-transparent text-sm outline-none"
            >
              {["Все", "Лёгкая", "Средняя", "Сложная"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                {["Код", "Название", "Сложность", "Теги", "Статус"].map((h) => (
                  <th
                    key={h}
                    className="bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="even:bg-white odd:bg-slate-50/40">
                  <td className="px-4 py-3 text-sm">{p.code}</td>
                  <td className="px-4 py-3 text-sm">{p.title}</td>
                  <td className="px-4 py-3 text-sm">{p.difficulty}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <Badge key={t} className="bg-slate-100 text-slate-700">{t}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={p.status === "Готово" ? "success" : "warn"}>{p.status}</Badge>
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
