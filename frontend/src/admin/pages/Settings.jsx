import { useEffect, useState } from "react";
import Card from "../../shared/ui/Card.jsx";
import Badge from "../../shared/ui/Badge.jsx";

const KEY = "admin_settings_demo";

export default function Settings() {
  const [maintenance, setMaintenance] = useState(false);
  const [concurrency, setConcurrency] = useState(4);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        setMaintenance(!!obj.maintenance);
        setConcurrency(Number(obj.concurrency) || 4);
      }
    } catch {}
  }, []);

  const save = () => {
    localStorage.setItem(KEY, JSON.stringify({ maintenance, concurrency }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <section className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Settings</h1>

      <Card title="Общие">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="flex items-center justify-between gap-6 rounded-xl border border-slate-200 p-4">
            <div>
              <div className="font-medium text-slate-900">Режим обслуживания</div>
              <div className="text-sm text-slate-500">Временно закрыть отправки и входы</div>
            </div>
            <input
              type="checkbox"
              checked={maintenance}
              onChange={(e) => setMaintenance(e.target.checked)}
              className="h-5 w-5 accent-blue-600"
            />
          </label>

          <label className="flex items-center justify-between gap-6 rounded-xl border border-slate-200 p-4">
            <div>
              <div className="font-medium text-slate-900">Параллельных проверок</div>
              <div className="text-sm text-slate-500">Ограничение очереди раннера</div>
            </div>
            <input
              type="number"
              min={1}
              max={64}
              value={concurrency}
              onChange={(e) => setConcurrency(Number(e.target.value))}
              className="h-9 w-24 rounded-xl border border-slate-200 px-3 text-sm outline-none"
            />
          </label>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={save}
            className="inline-flex h-9 items-center rounded-xl border border-slate-200 px-4 text-sm text-slate-700 hover:bg-slate-50"
          >
            Сохранить
          </button>
          {saved && <Badge variant="success">Сохранено</Badge>}
        </div>
      </Card>
    </section>
  );
}
