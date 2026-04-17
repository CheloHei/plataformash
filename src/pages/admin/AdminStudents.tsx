import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useTheme } from "@/components/ThemeProvider";
import { adminStudents, type AdminStudent } from "@/data/adminMockData";
import { Input } from "@/components/ui/input";

// ─── Status config ────────────────────────────────────────────────────────────

const statusConfig = {
  completed: {
    label: "Completado",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
    icon: CheckCircle2,
  },
  active: {
    label: "En progreso",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.12)",
    icon: TrendingUp,
  },
  inactive: {
    label: "Inactivo",
    color: "#9ca3af",
    bg: "rgba(156,163,175,0.12)",
    icon: Clock,
  },
} as const;

// ─── Progress bar ─────────────────────────────────────────────────────────────

const ProgressBar = ({ value }: { value: number }) => {
  const color =
    value >= 100 ? "#22c55e" : value >= 50 ? "#6366f1" : value > 0 ? "#FBCE07" : "#d1d5db";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-200 dark:bg-white/[0.08]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className="text-[11px] font-semibold w-8 text-right" style={{ color }}>
        {value}%
      </span>
    </div>
  );
};

// ─── Student detail row ────────────────────────────────────────────────────────

const StudentRow = ({ student, index }: { student: AdminStudent; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[student.status];
  const StatusIcon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-xl overflow-hidden border border-gray-100 dark:border-white/[0.06]"
    >
      {/* Main row */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-white dark:bg-[#111]"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Avatar */}
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-white text-xs font-bold flex-shrink-0"
          style={{ background: "#DD1D21" }}
        >
          {student.codUsuario.slice(0, 2)}
        </div>

        {/* Name + code */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {student.nombreVendedor}
          </p>
          <p className="text-xs text-gray-500 dark:text-white/40">
            {student.codUsuario} · {student.codSucursal}
          </p>
        </div>

        {/* Progress (hidden on mobile) */}
        <div className="hidden md:block w-32">
          <ProgressBar value={student.overallProgress} />
        </div>

        {/* Courses */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs w-20 justify-center text-gray-400 dark:text-white/50">
          <BookOpen size={12} />
          {student.completedCourses}/{student.totalCourses}
        </div>

        {/* Status badge */}
        <div
          className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ background: cfg.bg, color: cfg.color }}
        >
          <StatusIcon size={11} />
          <span className="hidden sm:inline">{cfg.label}</span>
        </div>

        {/* Expand chevron */}
        <div className="text-gray-300 dark:text-white/25">
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="px-4 pb-4 pt-1 bg-gray-50/60 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/[0.05]"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-white/35">
                Progreso general
              </p>
              <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                {student.overallProgress}%
              </p>
              <ProgressBar value={student.overallProgress} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-white/35">
                Cursos completados
              </p>
              <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                {student.completedCourses} / {student.totalCourses}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-white/35">
                Sucursal
              </p>
              <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                {student.codSucursal}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-white/35">
                Última actividad
              </p>
              <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                {new Date(student.lastActivity).toLocaleDateString("es-PY", {
                  day: "2-digit",
                  month: "short",
                })}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <p className="text-xs text-gray-400 dark:text-white/35">Email:</p>
            <p className="text-xs text-gray-900 dark:text-white">{student.email}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

type FilterStatus = "all" | "active" | "completed" | "inactive";

const AdminStudents = () => {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const filtered = useMemo(() => {
    return adminStudents.filter((s) => {
      const matchesSearch =
        s.nombreVendedor.toLowerCase().includes(search.toLowerCase()) ||
        s.codUsuario.toLowerCase().includes(search.toLowerCase()) ||
        s.codSucursal.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" || s.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [search, filterStatus]);

  const counts = useMemo(
    () => ({
      all: adminStudents.length,
      active: adminStudents.filter((s) => s.status === "active").length,
      completed: adminStudents.filter((s) => s.status === "completed").length,
      inactive: adminStudents.filter((s) => s.status === "inactive").length,
    }),
    []
  );

  const filters: { key: FilterStatus; label: string; count: number; color: string }[] = [
    { key: "all", label: "Todos", count: counts.all, color: "#374151" },
    { key: "active", label: "En progreso", count: counts.active, color: "#6366f1" },
    { key: "completed", label: "Completados", count: counts.completed, color: "#22c55e" },
    { key: "inactive", label: "Inactivos", count: counts.inactive, color: "#9ca3af" },
  ];

  return (
    <AdminLayout breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Alumnos" }]}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alumnos</h1>
            <p className="text-sm mt-0.5 text-red-900/50 dark:text-red-300/55">
              {adminStudents.length} usuarios registrados en la plataforma
            </p>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total", value: counts.all, icon: Users, color: "#DD1D21" },
            { label: "En progreso", value: counts.active, icon: TrendingUp, color: "#6366f1" },
            { label: "Completados", value: counts.completed, icon: CheckCircle2, color: "#22c55e" },
            { label: "Inactivos", value: counts.inactive, icon: AlertCircle, color: "#9ca3af" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl px-4 py-3 flex items-center gap-3 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[0.06]"
            >
              <s.icon size={18} style={{ color: s.color }} />
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-[11px] text-gray-500 dark:text-white/40">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search & filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, código o sucursal..."
              className="pl-9 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 focus:border-[#DD1D21]/60"
            />
          </div>

          <div className="flex gap-1 rounded-lg p-1 bg-gray-100 dark:bg-white/[0.05]">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterStatus(f.key)}
                className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-md transition-all"
                style={
                  filterStatus === f.key
                    ? {
                        background: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(209,213,219,0.8)",
                        color: theme === "dark" ? "#fff" : "#111827",
                      }
                    : {
                        color: theme === "dark" ? "#d1d5db" : "#6b7280",
                      }
                }
              >
                {f.label}
                <span
                  className="px-1.5 py-0.5 rounded-full text-[10px]"
                  style={{
                    background:
                      filterStatus === f.key
                        ? theme === "dark"
                          ? "rgba(255,255,255,0.15)"
                          : "rgba(0,0,0,0.08)"
                        : "transparent",
                    color:
                      filterStatus === f.key
                        ? theme === "dark"
                          ? "#fff"
                          : "#111827"
                        : theme === "dark"
                          ? "#9ca3af"
                          : "#9ca3af",
                  }}
                >
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table header (desktop) */}
        <div
          className="hidden md:grid gap-3 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30"
          style={{ gridTemplateColumns: "2.5rem 1fr 8rem 5rem 7rem 1.5rem" }}
        >
          <span />
          <span>Alumno</span>
          <span>Progreso</span>
          <span className="text-center">Cursos</span>
          <span>Estado</span>
          <span />
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {filtered.map((student, i) => (
            <StudentRow key={student.id} student={student} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 dark:text-white/30">
            <Users size={32} className="mx-auto mb-3" />
            <p className="text-sm">
              {search
                ? `No se encontraron alumnos para "${search}"`
                : "No hay alumnos en esta categoría"}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminStudents;
