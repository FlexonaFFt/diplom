import { NavLink } from "react-router-dom";

export default function SidebarLink({ to, children, onNavigate }) {
  const base =
    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors";
  const idle = "text-gray-600 hover:text-gray-900 hover:bg-gray-50";
  const active = "text-white bg-gray-900 hover:bg-gray-900";

  return (
    <NavLink
      to={to}
      className={({ isActive }) => [base, isActive ? active : idle].join(" ")}
      onClick={onNavigate}
      end
    >
      {children}
    </NavLink>
  );
}
