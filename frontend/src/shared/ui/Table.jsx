/**
 * Простая таблица.
 * props:
 * - columns: Array<{ key: string, header: string, className?: string, render?: (row) => ReactNode }>
 * - rows: Array<Record<string, any>>
 * - emptyText?: string
 * - className?: string
 * Пример columns:
 *   [
 *     { key: "id", header: "ID", className: "w-[72px]" },
 *     { key: "title", header: "Title" },
 *     { key: "status", header: "Status", render: (row) => <Badge>{row.status}</Badge> },
 *   ]
 */
export default function Table({ columns = [], rows = [], emptyText = "Нет данных", className = "" }) {
  return (
    <div className={["overflow-x-auto", className].join(" ")}>
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={[
                  "text-left text-xs font-semibold uppercase tracking-wide text-gray-500",
                  "bg-gray-50 border-b border-gray-200",
                  "px-4 py-3",
                  col.className || "",
                ].join(" ")}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                className="px-4 py-6 text-sm text-gray-500 border-b border-gray-200"
                colSpan={columns.length || 1}
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={row.id ?? idx} className="even:bg-white odd:bg-gray-50/30">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={[
                      "px-4 py-3 text-sm text-gray-800 border-b border-gray-200",
                      col.className || "",
                    ].join(" ")}
                  >
                    {typeof col.render === "function" ? col.render(row) : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
