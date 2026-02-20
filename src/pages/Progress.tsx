import { useMemo, useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import ProgressBar from "@/components/ProgressBar";
import { courses } from "@/data/mockData";
import { CheckCircle2, Clock, BookOpen, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getCourseProgress, getExamScore } from "@/hooks/useExam";

const Progress = () => {
  const [refreshStats, setRefreshStats] = useState(0);

  // Actualizar cuando hay cambios en localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setRefreshStats((prev) => prev + 1);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const stats = useMemo(() => {
    const total = courses.length;
    
    // Contar realmente completados basado en exámenes al 100%
    const completedCourses = courses.filter((c) => {
      const lessonsWithExams = c.lessons.filter((l) => l.questions && l.questions.length > 0);
      if (lessonsWithExams.length === 0) return false;
      return lessonsWithExams.every((lesson) => getExamScore(c.id, lesson.id) === 100);
    });
    const totalLessons = courses.reduce((s, c) => s + c.totalLessons, 0);
    
    // Calcular lecciones completadas basado en exámenes al 100%
    let completedLessons = 0;
    courses.forEach((c) => {
      const lessonsWithExams = c.lessons.filter((l) => l.questions && l.questions.length > 0);
      lessonsWithExams.forEach((lesson) => {
        if (getExamScore(c.id, lesson.id) === 100) {
          completedLessons += 1;
        }
      });
    });

    // Progreso general: exámenes completados / exámenes totales posibles
    let totalExamsCompleted = 0;
    let totalExamsPossible = 0;
    
    courses.forEach((course) => {
      const lessonsWithExams = course.lessons.filter((l) => l.questions && l.questions.length > 0);
      lessonsWithExams.forEach((lesson) => {
        totalExamsPossible += 1;
        const score = getExamScore(course.id, lesson.id);
        if (score !== null) {
          totalExamsCompleted += 1;
        }
      });
    });

    const overallProgress = totalExamsPossible > 0 ? Math.round((totalExamsCompleted / totalExamsPossible) * 100) : 0;

    return { total, completed: completedCourses.length, totalLessons, completedLessons, overallProgress };
  }, [refreshStats]);

  const modules = useMemo(() => {
    const grouped: Record<string, typeof courses> = {};
    courses.forEach((c) => {
      if (!grouped[c.module]) grouped[c.module] = [];
      grouped[c.module].push(c);
    });
    return Object.entries(grouped).map(([name, items]) => {
      // Calcular progreso: exámenes completados / exámenes totales en el módulo
      let completedExams = 0;
      let totalExams = 0;
      
      items.forEach((course) => {
        const lessonsWithExams = course.lessons.filter((l) => l.questions && l.questions.length > 0);
        lessonsWithExams.forEach((lesson) => {
          totalExams += 1;
          const score = getExamScore(course.id, lesson.id);
          if (score !== null) {
            completedExams += 1;
          }
        });
      });

      const progress = totalExams > 0 ? Math.round((completedExams / totalExams) * 100) : 0;
      
      // Contar completados realmente (todos los exámenes al 100%)
      const completed = items.filter((c) => {
        const lessonsWithExams = c.lessons.filter((l) => l.questions && l.questions.length > 0);
        if (lessonsWithExams.length === 0) return false;
        return lessonsWithExams.every((lesson) => getExamScore(c.id, lesson.id) === 100);
      }).length;

      return {
        name,
        progress,
        total: items.length,
        completed,
      };
    });
  }, [refreshStats]);

  return (
    <AppLayout breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Mi Progreso" }]}>
      <div className="mx-auto max-w-5xl space-y-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Mi Progreso</h1>
          <p className="mt-1 text-muted-foreground">Tu avance general en Academia Shell</p>
        </motion.div>

        {/* Overview card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-6 lg:p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            {/* Circle progress */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative flex h-36 w-36 items-center justify-center">
                <svg className="h-36 w-36 -rotate-90" viewBox="0 0 144 144">
                  <circle cx="72" cy="72" r="64" fill="none" stroke="hsl(var(--shell-gray-200))" strokeWidth="10" />
                  <circle
                    cx="72" cy="72" r="64" fill="none"
                    stroke="hsl(var(--shell-yellow))"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 64}`}
                    strokeDashoffset={`${2 * Math.PI * 64 * (1 - stats.overallProgress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>
                <span className="absolute text-3xl font-bold text-foreground">{stats.overallProgress}%</span>
              </div>
              <span className="text-sm text-muted-foreground">Progreso general</span>
            </div>

            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { icon: BookOpen, label: "Total cursos", value: stats.total },
                { icon: CheckCircle2, label: "Completados", value: stats.completed },
                { icon: Trophy, label: "Lecciones", value: `${stats.completedLessons}/${stats.totalLessons}` },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <s.icon size={24} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Module progress */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Progreso por módulo</h2>
          <div className="space-y-3">
            {modules.map((mod, i) => (
              <motion.div
                key={mod.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="rounded-lg border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">{mod.name}</h3>
                  <span className="text-xs text-muted-foreground">{mod.completed}/{mod.total} cursos</span>
                </div>
                <ProgressBar value={mod.progress} size="md" showLabel />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Course list */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Detalle por curso</h2>
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Curso</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Módulo</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Progreso</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3">
                        <Link to={`/cursos/${course.id}`} className="font-medium text-foreground hover:text-accent transition-colors">
                          {course.title}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{course.module}</td>
                      <td className="px-5 py-3 w-48">
                        <ProgressBar value={getCourseProgress(course.id, course.lessons)} size="sm" showLabel />
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                          course.status === "completed" ? "text-green-600" : course.status === "in-progress" ? "text-primary-foreground" : "text-muted-foreground"
                        }`}>
                          {course.status === "completed" ? "✓ Completado" : course.status === "in-progress" ? "● En progreso" : "○ No iniciado"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Progress;
