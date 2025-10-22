export default function Dashboard() {
  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Здесь будут ключевые метрики платформы, быстрые ссылки на действия и последние события.
      </p>
    </section>
  );
}
/*
---------------------------------------
Пример использования Card + Table + Badge:

import Card from "../../shared/ui/Card";
import Table from "../../shared/ui/Table";
import Badge from "../../shared/ui/Badge";

const sampleColumns = [
  { key: "id", header: "ID", className: "w-[72px]" },
  { key: "title", header: "Название" },
  { key: "status", header: "Статус", render: (r) => (
      <Badge variant={r.status === "ok" ? "success" : "warn"}>
        {r.status === "ok" ? "Готово" : "Внимание"}
      </Badge>
    )
  },
];

const sampleRows = [
  { id: 101, title: "Последний сабмит", status: "ok" },
  { id: 102, title: "Сбор метрик", status: "warn" },
];

return (
  <section className="p-6">
    <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
    <p className="mt-2 text-gray-600">
      Здесь будут ключевые метрики платформы, быстрые ссылки на действия и последние события.
    </p>

    <div className="mt-6 grid gap-6 md:grid-cols-2">
      <Card title="Сводка">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Пользователи</div>
            <div className="text-2xl font-semibold text-gray-900">1,248</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Отправки</div>
            <div className="text-2xl font-semibold text-gray-900">8,421</div>
          </div>
        </div>
      </Card>

      <Card title="Последние события">
        <Table columns={sampleColumns} rows={sampleRows} />
      </Card>
    </div>
  </section>
);
---------------------------------------
*/
