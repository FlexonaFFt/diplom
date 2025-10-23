import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import Badge from "../../shared/ui/Badge.jsx";
import { CheckCircle2, XCircle, Hourglass } from "lucide-react";

const DATA = [
  { id: 10430, user: "Антон",  problem: "A. Две суммы",         status: "OK",      time: "0.21 c", lang: "Python 3.11", when: "только что" },
  { id: 10429, user: "Борис",  problem: "B. Пути в графе",      status: "WA",      time: "1.01 c", lang: "Python 3.10", when: "1 мин назад" },
  { id: 10428, user: "Вера",   problem: "C. Решето простых",    status: "TLE",     time: "—",      lang: "Python 3.12", when: "4 мин назад" },
  { id: 10427, user: "Глеб",   problem: "D. Редактор",          status: "PENDING", time: "—",      lang: "Python 3.12", when: "7 мин назад" },
  { id: 10426, user: "Денис",  problem: "E. Рюкзак (DP)",       status: "RE",      time: "0.10 c", lang: "Python 3.9",  when: "вчера" },
  { id: 10425, user: "Ева",    problem: "F. Дерево отрезков",   status: "OK",      time: "0.58 c", lang: "Python 3.11", when: "вчера" },
];

function statusView(s) {
  const S = s.toUpperCase();
  if (S === "OK") return { label: "OK", variant: "success", Icon: CheckCircle2 };
  if (S === "PENDING" || S === "RUNNING") return { label: S, variant: "default", Icon: Hourglass };
  return { label: S, variant: "warn", Icon: XCircle };
}

export default function Submissions() {
  const [status, setStatus] = useState("Все");

  const rows = useMemo(() => {
    if (status === "Все") return DATA;
    return DATA.filter((r) => r.status.toUpperCase() === status.toUpperCase());
  }, [status]);

  return (
    <section className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Submissions</h1>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-8 bg-transparent text-sm outline-none"
          >
            {["Все", "OK", "WA", "TLE", "RE", "CE", "PENDING", "RUNNING"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                {["ID", "Пользователь", "Задача", "Статус", "Время", "Язык", "Когда"].map((h) => (
                  <th key={h} className="bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const { label, variant, Icon } = statusView(r.status);
                return (
                  <tr key={r.id} className="even:bg-white odd:bg-slate-50/40">
                    <td className="px-4 py-3 text-sm">{r.id}</td>
                    <td className="px-4 py-3 text-sm">{r.user}</td>
                    <td className="px-4 py-3 text-sm">{r.problem}</td>
                    <td className="px-4 py-3">
                      <Badge variant={variant}>
                        <span className="inline-flex items-center gap-1.5">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                          {label}
                        </span>
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{r.time}</td>
                    <td className="px-4 py-3 text-sm">{r.lang}</td>
                    <td className="px-4 py-3 text-sm">{r.when}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
