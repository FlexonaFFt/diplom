const statusStyles = {
  ok: 'text-emerald-600 border-emerald-100 bg-emerald-50',
  wrong_answer: 'text-red-600 border-red-100 bg-red-50',
  runtime_error: 'text-red-600 border-red-100 bg-red-50',
  tle: 'text-amber-600 border-amber-100 bg-amber-50',
  error: 'text-red-600 border-red-100 bg-red-50'
};

const formatStatus = (status) => status?.replace(/_/g, ' ') || '—';

const Results = ({ rows, totalTime, verdict }) => {
  const verdictClass = verdict === 'accepted'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : verdict === 'failed'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : verdict === 'error'
        ? 'bg-red-50 text-red-700 border-red-200'
        : 'bg-gray-50 text-gray-600 border-gray-200';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`rounded-full border px-3 py-1 text-sm font-medium ${verdictClass}`}>
          Итог: {verdict ? verdict.toUpperCase() : '—'}
        </span>
        <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-600">
          Время: {totalTime ?? 0} мс
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
          Пока нет данных. Отправьте решение, чтобы увидеть результаты.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => {
            const rowClass = statusStyles[row.status] || 'text-gray-600 border-gray-200 bg-gray-50';
            return (
              <div
                key={row.id}
                className={`flex flex-wrap items-center gap-4 rounded-xl border px-4 py-3 text-sm ${rowClass}`}
              >
                <span className="font-medium">Тест #{row.test_case_id}</span>
                <span>Статус: {formatStatus(row.status)}</span>
                <span>Время: {row.time_ms} мс</span>
                <span className="truncate">
                  Выход:{' '}
                  <span className="font-mono text-gray-800">
                    {row.actual_text || '—'}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Results;
