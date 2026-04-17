import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { adminOverviewStats } from "@/data/adminMockData";

const statusConfig = {
  reviewed: { label: "Revisado", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  pending_review: { label: "Pendiente", color: "#FBCE07", bg: "rgba(251,206,7,0.12)" },
  failed: { label: "Fallido", color: "#DD1D21", bg: "rgba(221,29,33,0.12)" },
};

const StatCard = ({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  delay = 0,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay }}
    className="rounded-xl p-5 flex items-start gap-4 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[0.06]"
  >
    <div
      className="flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0"
      style={{ background: `${accent}20` }}
    >
      <Icon size={22} style={{ color: accent }} />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm font-medium text-gray-500 dark:text-white/55">{label}</p>
      {sub && (
        <p className="text-xs mt-0.5 text-gray-400 dark:text-white/35">{sub}</p>
      )}
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const stats = adminOverviewStats;

  return (
    <AdminLayout breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Panel de Control</h1>
          <p className="text-sm mt-1 text-red-900/50 dark:text-red-300/55">
            Resumen general de la plataforma de capacitación
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Alumnos" value={stats.totalStudents} sub={`${stats.activeStudents} activos`} icon={Users} accent="#DD1D21" delay={0} />
          <StatCard label="Pendientes de Revisión" value={stats.pendingReviews} sub="Exámenes sin corregir" icon={AlertCircle} accent="#FBCE07" delay={0.05} />
          <StatCard label="Cursos Activos" value={stats.totalCourses} sub="2 módulos disponibles" icon={BookOpen} accent="#6366f1" delay={0.1} />
          <StatCard label="Promedio General" value={`${stats.avgScore}%`} sub={`Progreso: ${stats.avgProgress}%`} icon={TrendingUp} accent="#22c55e" delay={0.15} />
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent activity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="lg:col-span-2 rounded-xl p-5 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[0.06]"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <ClipboardList size={16} style={{ color: "#DD1D21" }} />
                Actividad Reciente
              </h2>
              <Link
                to="/admin/examenes"
                className="text-xs font-medium flex items-center gap-1 transition-colors text-red-900/50 dark:text-red-300/55 hover:text-red-700 dark:hover:text-white"
              >
                Ver todo <ChevronRight size={12} />
              </Link>
            </div>
            <div className="space-y-2">
              {stats.recentActivity.map((item, i) => {
                const cfg = statusConfig[item.status];
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 bg-gray-50 dark:bg-white/[0.03]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white flex-shrink-0"
                        style={{ background: "#DD1D21" }}
                      >
                        {item.studentCode.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                          {item.studentName}
                        </p>
                        <p className="text-[11px] truncate text-gray-500 dark:text-white/40">
                          {item.courseName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: cfg.bg, color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                      <span className="text-[11px] hidden sm:block text-gray-400 dark:text-white/30">
                        <Clock size={10} className="inline mr-1" />
                        {item.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Module completion */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25 }}
            className="rounded-xl p-5 space-y-4 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[0.06]"
          >
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp size={16} style={{ color: "#DD1D21" }} />
              Completitud por Módulo
            </h2>
            {stats.moduleStats.map((mod, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{mod.name}</p>
                    <p className="text-[11px] truncate text-gray-500 dark:text-white/40">
                      {mod.label}
                    </p>
                  </div>
                  <span className="text-sm font-bold" style={{ color: "#FBCE07" }}>
                    {mod.completionRate}%
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-gray-100 dark:bg-white/[0.08]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${mod.completionRate}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: "#DD1D21" }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 dark:text-white/35">
                  {mod.students} alumnos con acceso
                </p>
              </div>
            ))}

            {/* Summary stats */}
            <div className="mt-4 pt-4 grid grid-cols-2 gap-3 border-t border-gray-100 dark:border-white/[0.06]">
              <div className="text-center">
                <p className="text-lg font-bold" style={{ color: "#22c55e" }}>
                  {stats.completedStudents}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-white/40">Completados</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold" style={{ color: "#FBCE07" }}>
                  {stats.totalExamsSubmitted}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-white/40">Exámenes</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick access cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { to: "/admin/examenes", icon: AlertCircle, label: "Revisar Exámenes", sub: `${stats.pendingReviews} pendientes`, accent: "#FBCE07" },
            { to: "/admin/alumnos", icon: Users, label: "Gestionar Alumnos", sub: `${stats.totalStudents} registrados`, accent: "#6366f1" },
            { to: "/admin/cursos", icon: BookOpen, label: "Administrar Cursos", sub: `${stats.totalCourses} cursos activos`, accent: "#DD1D21" },
          ].map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="group flex items-center gap-4 rounded-xl p-4 transition-all duration-200 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/20"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0"
                style={{ background: `${card.accent}18` }}
              >
                <card.icon size={20} style={{ color: card.accent }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{card.label}</p>
                <p className="text-xs text-gray-500 dark:text-white/40">{card.sub}</p>
              </div>
              <ChevronRight
                size={16}
                className="flex-shrink-0 transition-transform group-hover:translate-x-0.5 text-gray-300 dark:text-white/30"
              />
            </Link>
          ))}
        </motion.div>

        {/* Status breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.35 }}
          className="rounded-xl p-5 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[0.06]"
        >
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Estado de los Alumnos
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Completados", value: stats.completedStudents, icon: CheckCircle2, color: "#22c55e" },
              { label: "Activos", value: stats.activeStudents, icon: TrendingUp, color: "#6366f1" },
              { label: "Inactivos", value: stats.inactiveStudents, icon: Clock, color: "#9ca3af" },
              { label: "Con Pendientes", value: stats.pendingReviews, icon: XCircle, color: "#FBCE07" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center rounded-lg py-4 px-3 text-center bg-gray-50 dark:bg-white/[0.03]"
              >
                <item.icon size={22} style={{ color: item.color }} className="mb-2" />
                <p className="text-xl font-bold text-gray-900 dark:text-white">{item.value}</p>
                <p className="text-[11px] mt-0.5 text-gray-500 dark:text-white/45">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
