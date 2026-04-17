import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  ChevronLeft,
  Menu,
  LogOut,
  Settings,
  Sun,
  Moon,
  Shield,
  ExternalLink,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import logo from "@/assets/images/logo-shell.png";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

const adminNavItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Cursos", url: "/admin/cursos", icon: BookOpen },
  { title: "Alumnos", url: "/admin/alumnos", icon: Users },
  { title: "Exámenes", url: "/admin/examenes", icon: ClipboardList },
];

const AdminLayout = ({ children, breadcrumbs }: AdminLayoutProps) => {
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f9f5f5] dark:bg-[#060606]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Admin Sidebar ─────────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300",
          "bg-[#fff5f5] dark:bg-[#0d0303]",
          "border-r border-red-200/40 dark:border-red-950/40",
          collapsed ? "w-[72px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static"
        )}
      >
        {/* Logo area */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-red-200/30 dark:border-red-950/30">
          {!collapsed ? (
            <Link to="/admin" className="flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0"
                style={{ background: "#DD1D21" }}
              >
                <img src={logo} alt="Shell" className="h-6 w-6 object-contain" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold text-[#1a0101] dark:text-white">
                  Plataforma Shell
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Shield size={10} style={{ color: "#FBCE07" }} />
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: "#FBCE07" }}
                  >
                    Admin Panel
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <Link to="/admin" className="mx-auto">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ background: "#DD1D21" }}
              >
                <Shield size={16} className="text-white" />
              </div>
            </Link>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-0.5">
            {adminNavItems.map((item) => {
              const isActive =
                item.url === "/admin"
                  ? location.pathname === "/admin"
                  : location.pathname.startsWith(item.url);
              return (
                <li key={item.title}>
                  <Link
                    to={item.url}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                      collapsed ? "justify-center" : "",
                      isActive
                        ? "bg-[#DD1D21]/[0.15] border-l-2 border-[#DD1D21] text-[#DD1D21] dark:text-white"
                        : "text-red-900/50 dark:text-red-300/55 hover:bg-red-100/60 hover:text-red-900 dark:hover:bg-white/[0.04] dark:hover:text-white"
                    )}
                  >
                    <item.icon
                      size={18}
                      className={cn(
                        "flex-shrink-0",
                        isActive ? "text-[#DD1D21]" : ""
                      )}
                    />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Divider */}
          {!collapsed && (
            <div className="mt-4 pt-4 border-t border-red-200/20 dark:border-red-950/20">
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-red-900/30 dark:text-red-300/35">
                Herramientas
              </p>
              <Link
                to="/"
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all text-red-900/40 dark:text-red-300/45 hover:bg-red-100/60 hover:text-red-900 dark:hover:bg-white/[0.04] dark:hover:text-white"
              >
                <ExternalLink size={16} className="flex-shrink-0" />
                <span>Ver App Alumno</span>
              </Link>
            </div>
          )}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-red-200/25 dark:border-red-950/25">
          {!collapsed ? (
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-bold flex-shrink-0"
                style={{ background: "#DD1D21" }}
              >
                {user?.codUsuario?.slice(0, 2).toUpperCase() ?? "AD"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-semibold text-[#1a0101] dark:text-white">
                  {user?.codUsuario ?? "ADMIN"}
                </p>
                <div className="flex items-center gap-1">
                  <Shield size={9} style={{ color: "#FBCE07" }} />
                  <p className="text-[10px]" style={{ color: "#FBCE07" }}>
                    Administrador
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-bold"
                style={{ background: "#DD1D21" }}
              >
                {user?.codUsuario?.slice(0, 2).toUpperCase() ?? "AD"}
              </div>
            </div>
          )}
        </div>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "hidden lg:flex absolute -right-3 top-[72px] h-6 w-6 items-center justify-center rounded-full shadow-lg transition-colors",
            "bg-[#fff5f5] dark:bg-[#0d0303]",
            "border border-red-300/40 dark:border-red-900/40"
          )}
        >
          <ChevronLeft
            size={12}
            className={cn(
              "text-red-700/60 dark:text-red-300/70 transition-transform",
              collapsed ? "rotate-180" : ""
            )}
          />
        </button>
      </aside>

      {/* ── Main content ──────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-4 lg:px-8 bg-[#fff5f5]/95 dark:bg-[#060606]/95 backdrop-blur-[12px] border-b border-red-200/40 dark:border-[#DD1D21]/10">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#DD1D21] dark:text-white transition-colors bg-red-100/60 dark:bg-white/[0.05]"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="hidden sm:flex items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, i) => (
                  <span key={i} className="flex items-center gap-2">
                    {i > 0 && (
                      <span className="text-red-900/30 dark:text-red-600/50">/</span>
                    )}
                    {crumb.href ? (
                      <Link
                        to={crumb.href}
                        className="text-red-900/50 dark:text-red-300/55 transition-colors hover:text-red-700 dark:hover:text-white"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="font-semibold text-[#1a0101] dark:text-white">
                        {crumb.label}
                      </span>
                    )}
                  </span>
                ))}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <div className="flex items-center gap-1.5">
              <Sun size={13} className="text-red-900/40 dark:text-red-300/45" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-[#DD1D21] scale-90"
              />
              <Moon size={13} className="text-red-900/40 dark:text-red-300/45" />
            </div>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 ml-1 pl-3 transition-opacity hover:opacity-80 cursor-pointer border-l border-red-200/40 dark:border-red-900/35">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-bold"
                    style={{ background: "#DD1D21" }}
                  >
                    {user?.codUsuario?.slice(0, 2).toUpperCase() ?? "AD"}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-[#1a0101] dark:text-white">
                    {user?.codUsuario?.split(" ")[0] ?? "Admin"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer">
                  <Settings size={15} className="mr-2" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut size={15} className="mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 text-gray-900 dark:text-white bg-[#f9f5f5] dark:bg-[#060606]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

