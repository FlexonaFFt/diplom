/**
 * Нейтральная карточка.
 * props:
 * - title?: ReactNode — заголовок в хедере
 * - actions?: ReactNode — правый слот в хедере (кнопки/ссылки)
 * - children: ReactNode — содержимое
 * - className?: string — доп. классы
 */
export default function Card({ title, actions, children, className = "" }) {
  return (
    <section
      className={[
        "bg-white border border-gray-200 rounded-2xl shadow-sm",
        "overflow-hidden", // аккуратные края у таблиц/вложенного контента
        className,
      ].join(" ")}
    >
      {(title || actions) && (
        <header className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          {actions}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}
