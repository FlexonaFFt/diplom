import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  FileCode,
  Users as UsersIcon,
  Clock,
  CheckCircle2,
  XCircle,
  Hourglass,
} from "lucide-react";

import Card from "../../shared/ui/Card.jsx";
import Badge from "../../shared/ui/Badge.jsx";

/* ------------------------------ helpers ------------------------------ */

const fmt = (n) =>
  typeof n === "number" ? n.toLocaleString("ru-RU") : String(n ?? "");

function statusToBadge(status) {
  const s = String(status).toUpperCase();
  if (s === "OK") return { variant: "success", Icon: CheckCircle2 };
  if (s === "PENDING" || s === "RUNNING") return { variant: "default", Icon: Hourglass };
  return { variant: "warn", Icon: XCircle }; // WA, TLE, MLE, RE, CE…
}

/* ------------------------------ skeletons ------------------------------ */

function MetricSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-9 w-9 animate-pulse rounded-full bg-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
          <div className="h-5 w-20 animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

function TableSkeleton({ rows = 8 }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr>
            {["ID", "Пользователь", "Задача", "Статус", "Время", "Язык", "Когда"].map(
              (h) => (
                <th
                  key={h}
                  className="sticky top-0 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="even:bg-white odd:bg-slate-50/40">
              {Array.from({ length: 7 }).map((__, j) => (
                <td key={j} className="px-4 py-3">
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------ mocks ------------------------------ */

function fetchDashboardMock() {
  return new Promise((resolve, reject) => {
    const fail = Math.random() < 0.08; // ~8% ошибка
    setTimeout(() => {
      if (fail) return reject(new Error("mock-fail"));

      const metrics = [
        {
          key: "problems",
          label: "Всего задач",
          value: 1248,
          hint: "+4,2% за 24ч",
          Icon: FileCode,
        },
        {
          key: "sub24",
          label: "Сабмиты за 24ч",
          value: 5603,
          hint: "+2,1% за 24ч",
          Icon: TrendingUp,
        },
        {
          key: "pass",
          label: "Успешные отправки",
          value: "48,7%",
          hint: "по всем задачам",
          Icon: CheckCircle2,
        },
        {
          key: "queue",
          label: "Очередь проверки",
          value: 37,
          hint: "в ожидании",
          Icon: Clock,
        },
      ];

      const submissions = [
        { id: 10421, user: "Алина",  problem: "A. Две суммы",           status: "OK",      time: "0.92 c", lang: "Python 3.12", when: "3 мин назад" },
        { id: 10420, user: "Борис",  problem: "B. Пути в графе",        status: "WA",      time: "1.24 c", lang: "Python 3.10", when: "7 мин назад" },
        { id: 10419, user: "Виктор", problem: "C. Решето простых",      status: "TLE",     time: "2.00 c", lang: "Python 3.11", when: "15 мин назад" },
        { id: 10418, user: "Дарья",  problem: "D. Редактор",            status: "PENDING", time: "—",      lang: "Python 3.12", when: "20 мин назад" },
        { id: 10417, user: "Елена",  problem: "E. Рюкзак (DP)",         status: "RE",      time: "0.11 c", lang: "Python 3.9",  when: "вчера" },
        { id: 10416, user: "Фёдор",  problem: "F. Дерево отрезков",     status: "OK",      time: "0.63 c", lang: "Python 3.11", when: "вчера" },
        { id: 10415, user: "Галина", problem: "G. Уровни BFS",          status: "RUNNING", time: "—",      lang: "Python 3.12", when: "сейчас" },
        { id: 10414, user: "Игорь",  problem: "H. Строки и префиксы",   status: "MLE",     time: "0.45 c", lang: "Python 3.10", when: "1 день назад" },
        { id: 10413, user: "Ирина",  problem: "I. Бинарный поиск",      status: "OK",      time: "0.09 c", lang: "Python 3.8",  when: "2 дня назад" },
      ];

      resolve({ metrics, submissions });
    }, 800);
  });
}

/* ------------------------------ page ------------------------------ */

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({ metrics: [], submissions: [] });

  const load = () => {
    setLoading(true);
    setError("");
    fetchDashboardMock()
      .then((res) => setData(res))
      .catch(() => setError("Не удалось загрузить данные дашборда"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const hasRows = (data.submissions || []).length > 0;

  const headerNote = useMemo(
    () => (
      <span className="inline-flex items-center gap-2 text-sm text-slate-500">
        <span className="inline-flex items-center rounded-full border border-slate-200 px-2 py-0.5 text-xs font-medium">
          Preview
        </span>
        Мок-данные: интерфейс для предварительного просмотра
      </span>
    ),
    [],
  );

  return (
    <section className="p-6">
      {/* header */}
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">
          Дашборд администрирования
        </h1>
        {headerNote}
      </div>

      {/* ошибка */}
      {error && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm">{error}</span>
            </div>
            <button
              onClick={load}
              className="rounded-lg border border-amber-200 px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
            >
              Повторить
            </button>
          </div>
        </div>
      )}

      {/* метрики */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <MetricSkeleton key={i} />)
          : data.metrics.map(({ key, label, value, hint, Icon }) => (
              <Card key={key} className="p-0">
                <div className="p-5">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-50">
                      <Icon className="h-5 w-5 text-slate-600" aria-hidden="true" />
                    </span>
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        {label}
                      </div>
                      <div className="text-2xl font-semibold text-slate-900">
                        {typeof value === "number" ? fmt(value) : value}
                      </div>
                      <div className="text-xs text-slate-400">{hint}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
      </div>

      {/* таблица сабмитов */}
      <Card
        title="Последние сабмиты"
        actions={
          <Link
            to="/admin/submissions"
            className="inline-flex h-9 items-center rounded-xl border border-slate-200 px-3 text-sm text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Показать все
          </Link>
        }
        className="mt-6"
      >
        {loading ? (
          <TableSkeleton />
        ) : hasRows ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  {[
                    "ID",
                    "Пользователь",
                    "Задача",
                    "Статус",
                    "Время",
                    "Язык",
                    "Когда",
                  ].map((h) => (
                    <th
                      key={h}
                      className="sticky top-0 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.submissions.map((r) => {
                  const { variant, Icon } = statusToBadge(r.status);
                  return (
                    <tr key={r.id} className="even:bg-white odd:bg-slate-50/40">
                      <td className="px-4 py-3 text-sm text-slate-800">{r.id}</td>
                      <td className="px-4 py-3 text-sm text-slate-800">{r.user}</td>
                      <td className="px-4 py-3 text-sm text-slate-800">{r.problem}</td>
                      <td className="px-4 py-3">
                        <Badge variant={variant}>
                          <span className="inline-flex items-center gap-1.5">
                            <Icon className="h-4 w-4" aria-hidden="true" />
                            {r.status}
                          </span>
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-800">{r.time}</td>
                      <td className="px-4 py-3 text-sm text-slate-800">{r.lang}</td>
                      <td className="px-4 py-3 text-sm text-slate-800">{r.when}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <FileCode className="h-12 w-12 text-slate-300" aria-hidden="true" />
            <div className="text-sm font-medium text-slate-900">Пока нет сабмитов</div>
            <div className="text-sm text-slate-500">
              Здесь появятся последние отправки, когда начнутся попытки решений.
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
