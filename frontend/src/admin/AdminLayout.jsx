import { useState, useMemo } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import SidebarLink from "./components/SidebarLink";

/**
 * Адаптивный каркас админки:
 * - md+ : сайдбар фиксирован слева
 * - <md : off-canvas (кнопка в топ-баре, затемненный оверлей)
 * - сверху — топ-бар с заголовком текущего раздела (плейсхолдер/маппинг)
 * - контент рендерится через <Outlet/>
 */
export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const titleMap = useMemo(
    () => ({
      "/admin": "Dashboard",
      "/admin/users": "Users",
      "/admin/problems": "Problems",
      "/admin/problem-sets": "Problem Sets",
      "/admin/submissions": "Submissions",
      "/admin/plagiarism": "Plagiarism",
      "/admin/datasets": "Datasets",
      "/admin/settings": "Settings",
    }),
    []
  );

  const currentTitle =
    titleMap[location.pathname] ||
    titleMap["/" + location.pathname.split("/").slice(1, 3).join("/")] ||
    "Admin";

  const navItems = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/problems", label: "Problems" },
    { to: "/admin/problem-sets", label: "Problem Sets" },
    { to: "/admin/submissions", label: "Submissions" },
    { to: "/admin/plagiarism", label: "Plagiarism" },
    { to: "/admin/datasets", label: "Datasets" },
    { to: "/admin/settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Топ-бар */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
        {/* ВСТАВЛЕНО: здесь слева линк «Контрольная панель» */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* слева: гамбургер (мобилка) + линк-назад */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-gray-100 text-gray-700"
              aria-label="Open sidebar"
              onClick={() => setOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <Link
              to="/dashboard"
              aria-label="Вернуться в контрольную панель"
              className="inline-flex items-center gap-2 h-9 rounded-xl px-3 text-sm text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Контрольная панель</span>
              <span className="sm:hidden">Панель</span>
            </Link>
          </div>

          <h1 className="text-lg font-semibold text-gray-900">{currentTitle}</h1>

          {/* правый плейсхолдер */}
          <div className="w-8 md:w-14" />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative grid md:grid-cols-[240px_1fr] gap-6 py-6">
          {/* Сайдбар: десктоп */}
          <aside className="hidden md:block">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <SidebarLink key={item.to} to={item.to}>
                  {item.label}
                </SidebarLink>
              ))}
            </nav>
          </aside>

          {/* Сайдбар: мобилка (off-canvas) */}
          {open && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/30 md:hidden"
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />
              <aside className="fixed z-50 inset-y-0 left-0 w-72 bg-white border-r border-gray-200 p-4 md:hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base font-semibold text-gray-900">Menu</span>
                  <button
                    className="rounded-lg p-2 hover:bg-gray-100"
                    aria-label="Close sidebar"
                    onClick={() => setOpen(false)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <SidebarLink
                      key={item.to}
                      to={item.to}
                      onNavigate={() => setOpen(false)}
                    >
                      {item.label}
                    </SidebarLink>
                  ))}
                </nav>
              </aside>
            </>
          )}

          {/* Контент */}
          <main className="min-h-[60vh]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
