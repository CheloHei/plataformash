import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
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
  BarChart3,
  ChevronLeft,
  Menu,
  User,
  Bell,
  Search,
  LogOut,
  Settings,
  Sun,
  Moon,
} from "lucide-react";
import {  userEmail, userRole } from "@/data/mockData";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";
import logo from "@/assets/images/logo-shell.png";

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Cursos", url: "/cursos", icon: BookOpen },
  { title: "Mi Progreso", url: "/progreso", icon: BarChart3 },
];

const AppLayout = ({ children, breadcrumbs }: AppLayoutProps) => {
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-300 ${collapsed ? "w-[72px]" : "w-64"
          } ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg shell-gradient">
                <span className="text-sm font-extrabold text-foreground"><img src={logo} alt="Logo" className="h-full w-full object-cover" /></span>
              </div>
              <div>
                <span className="text-sm font-bold text-foreground">Plataforma</span>
                <span className="ml-1 text-sm font-bold text-accent">Shell</span>
              </div>
            </Link>
          )}
          {collapsed && (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg shell-gradient">
              <span className="text-sm font-extrabold text-foreground">SH</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.url ||
                (item.url !== "/" && location.pathname.startsWith(item.url));
              return (
                <li key={item.title}>
                  <Link
                    to={item.url}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    <item.icon size={20} className={isActive ? "text-accent" : ""} />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
          <button
            onClick={handleLogout}
            className="lg:hidden w-full flex items-center justify-center gap-2 bg-destructive/10 hover:bg-destructive/20 text-destructive px-3 py-2 rounded-lg font-medium transition-colors"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        <div className="border-t border-border p-3">
          {!collapsed ? (
            <div className="flex items-center gap-3 rounded-lg px-2 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-bold">
                {user.codUsuario.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{user.codUsuario}</p>
                <p className="truncate text-xs text-muted-foreground">{userRole}</p>

              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-bold">
                {user.codUsuario.slice(0, 2).toUpperCase()}
              </div>
            </div>
          )}
        </div>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-muted transition-colors"
        >
          <ChevronLeft size={14} className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                {breadcrumbs.map((crumb, i) => (
                  <span key={i} className="flex items-center gap-2">
                    {i > 0 && <span>/</span>}
                    {crumb.href ? (
                      <Link to={crumb.href} className="hover:text-foreground transition-colors">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-foreground font-medium">{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-1">
              <Sun size={14} className={`text-muted-foreground transition-colors ${theme === "light" ? "text-primary" : ""}`} />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-accent"
              />
              <Moon size={14} className={`text-muted-foreground transition-colors ${theme === "dark" ? "text-primary" : ""}`} />
            </div>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <Search size={20} />
            </button>
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden sm:flex items-center gap-2 ml-2 pl-2 border-l border-border hover:opacity-80 transition-opacity cursor-pointer">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                    {user.codUsuario.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-foreground">{user.codUsuario.split(" ")[0]}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-3 p-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-bold">
                    {user.codUsuario.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-medium text-foreground">{user.codUsuario}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button className="w-full flex items-center gap-2 cursor-pointer">
                    <User size={16} />
                    <span>Mi Perfil</span>
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button className="w-full flex items-center gap-2 cursor-pointer">
                    <Settings size={16} />
                    <span>Configuración</span>
                  </button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 cursor-pointer text-destructive hover:text-destructive"
                  >
                    <LogOut size={16} />
                    <span>Cerrar Sesión</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
