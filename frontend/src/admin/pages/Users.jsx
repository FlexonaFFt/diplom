import { useMemo, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import Badge from "../../shared/ui/Badge.jsx";

const MOCK = [
  { id: 1, name: "Алина",  email: "alina@example.com",  role: "user",  active: true,  created: "2024-11-03" },
  { id: 2, name: "Борис",  email: "boris@example.com",  role: "admin", active: true,  created: "2024-11-05" },
  { id: 3, name: "Виктор", email: "victor@example.com", role: "user",  active: false, created: "2024-11-20" },
  { id: 4, name: "Дарья",  email: "daria@example.com",  role: "user",  active: true,  created: "2025-01-12" },
  { id: 5, name: "Елена",  email: "elena@example.com",  role: "user",  active: true,  created: "2025-02-08" },
];

export default function Users() {
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return MOCK;
    return MOCK.filter(
      (u) =>
        u.name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s),
    );
  }, [q]);

  return (
    <section className="p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск по имени или email"
              className="h-9 rounded-xl border border-slate-200 pl-8 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            />
          </div>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 hover:bg-slate-50"
            title="Демо-кнопка"
          >
            <UserPlus className="h-4 w-4" /> Создать
          </button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                {["ID", "Имя", "Email", "Роль", "Статус", "Зарегистрирован"].map((h) => (
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
              {rows.map((u) => (
                <tr key={u.id} className="even:bg-white odd:bg-slate-50/40">
                  <td className="px-4 py-3 text-sm">{u.id}</td>
                  <td className="px-4 py-3 text-sm">{u.name}</td>
                  <td className="px-4 py-3 text-sm">{u.email}</td>
                  <td className="px-4 py-3 text-sm">{u.role === "admin" ? "Админ" : "Пользователь"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.active ? "success" : "warn"}>{u.active ? "Активен" : "Выключен"}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(u.created).toLocaleDateString("ru-RU")}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-sm text-slate-500" colSpan={6}>
                    Нет результатов.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
