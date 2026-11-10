import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, ShieldCheck, UserRound, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/ambulance_operator/dashboard" },
  { icon: ShieldCheck, label: "Verification", href: "/ambulance_operator/verification" },
  { icon: UserRound, label: "Profile", href: "/ambulance_operator/profile" },
];

function Brand() {
  return (
    <a href="/" className="inline-flex min-h-11 items-center gap-2.5 rounded-lg" aria-label="DocLabPharm home">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
        <img src="/images/logo-mark.png" alt="" width={28} height={30} />
      </span>
      <span className="text-xl font-extrabold tracking-tight text-ink-900">
        DocLab<span className="text-brand-600">Pharm</span>
      </span>
    </a>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { logout } = useAuth();

  const handleSignOut = () => {
    logout();
    window.location.href = "/partners/login";
  };

  return (
    <nav aria-label="Ambulance operator" className="flex h-full flex-col gap-1 p-4">
      <ul className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => (
          <li key={href}>
            <NavLink
              to={href}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex min-h-11 items-center gap-3 rounded-2xl px-4 py-2.5 font-bold transition-colors",
                  isActive ? "bg-brand-600 text-white" : "text-ink-700 hover:bg-brand-50"
                )
              }
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={handleSignOut}
        className="mt-auto flex min-h-11 items-center gap-3 rounded-2xl px-4 py-2.5 font-bold text-red-700 transition-colors hover:bg-red-50"
      >
        <LogOut className="h-5 w-5" aria-hidden="true" />
        Log out
      </button>
    </nav>
  );
}

/** Dashboard shell for ambulance operators, in the style of the new website. */
export default function AmbulanceOperatorLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-sand">
      <aside className="hidden w-72 shrink-0 flex-col border-r border-brand-100 bg-white md:flex">
        <div className="px-6 pb-2 pt-5">
          <Brand />
        </div>
        <SidebarNav />
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            className="absolute inset-0 bg-ink-900/40"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between px-5 pb-2 pt-4">
              <Brand />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full text-ink-700 hover:bg-brand-50"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <SidebarNav onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-brand-100 bg-white px-4 py-3 md:hidden">
          <Brand />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink-900 hover:bg-brand-50"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
