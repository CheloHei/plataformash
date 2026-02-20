import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import CourseCard from "@/components/CourseCard";
import { courses } from "@/data/mockData";
import { CourseStatus } from "@/components/StatusBadge";
import { motion } from "framer-motion";
import { isModuleComplete } from "@/hooks/useExam";

const statusFilters: { label: string; value: CourseStatus | "all" }[] = [
  { label: "Todos", value: "all" },
  { label: "En progreso", value: "in-progress" },
  { label: "Completados", value: "completed" },
  { label: "No iniciados", value: "not-started" },
];

const Courses = () => {
  const [activeFilter, setActiveFilter] = useState<CourseStatus | "all">("all");
  const [search, setSearch] = useState("");

  // Obtener estado de módulos
  const modulo1 = courses.find((c) => c.module === "Módulo 1");
  const module1Complete = modulo1 ? isModuleComplete(modulo1.id, modulo1.lessons) : false;

  const filtered = useMemo(() => {
    return courses
      .map((course) => {
        // Bloquear Módulo 2 si Módulo 1 no está completado al 100%
        const isLocked = course.module === "Módulo 2" && !module1Complete;
        return { ...course, isLocked };
      })
      .filter((c) => {
        const matchesStatus = activeFilter === "all" || c.status === activeFilter;
        const matchesSearch =
          !search ||
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.category.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
      });
  }, [activeFilter, search, module1Complete]);

  return (
    <AppLayout breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Cursos" }]}>
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Catálogo de Cursos</h1>
          <p className="mt-1 text-muted-foreground">Explora todos los cursos disponibles en Academia Shell</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeFilter === f.value
                    ? "shell-gradient text-foreground shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cursos..."
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:ml-auto sm:w-64"
          />
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((courseData, i) => {
              const { isLocked, ...course } = courseData as any;
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <CourseCard course={course} isLocked={isLocked} />
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium text-foreground">No se encontraron cursos</p>
            <p className="text-sm text-muted-foreground mt-1">Intenta con otros filtros o busca otro término</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Courses;
