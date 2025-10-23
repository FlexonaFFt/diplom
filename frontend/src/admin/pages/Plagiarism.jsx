import Card from "../../shared/ui/Card.jsx";
import Badge from "../../shared/ui/Badge.jsx";

const CASES = [
  { id: 501, users: ["Алина", "Артём"],   problem: "A. Две суммы",        similarity: 92, status: "Требует проверки" },
  { id: 502, users: ["Борис", "Виктор"],  problem: "B. Пути в графе",     similarity: 78, status: "Под наблюдением" },
  { id: 503, users: ["Дарья", "Егор"],    problem: "E. Рюкзак (DP)",      similarity: 61, status: "Под наблюдением" },
];

export default function Plagiarism() {
  return (
    <section className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Plagiarism</h1>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                {["ID", "Пара пользователей", "Задача", "Сходство", "Статус"].map((h) => (
                  <th key={h} className="bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CASES.map((c) => (
                <tr key={c.id} className="even:bg-white odd:bg-slate-50/40">
                  <td className="px-4 py-3 text-sm">{c.id}</td>
                  <td className="px-4 py-3 text-sm">{c.users.join(" — ")}</td>
                  <td className="px-4 py-3 text-sm">{c.problem}</td>
                  <td className="px-4 py-3 text-sm">{c.similarity}%</td>
                  <td className="px-4 py-3">
                    <Badge variant={c.similarity >= 85 ? "warn" : "default"}>{c.status}</Badge>
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
