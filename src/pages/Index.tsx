import { useMemo, useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import CourseCard from "@/components/CourseCard";
import ProgressBar from "@/components/ProgressBar";
import { courses, userName } from "@/data/mockData";
import { BookOpen, CheckCircle2, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores";
import { isModuleComplete, getExamScore, getCourseProgress } from "@/hooks/useExam";

const Index = () => {
  const { user } = useAuthStore();
  const [refreshStats, setRefreshStats] = useState(0);

  // Recalcular estadísticas cuando cambia el localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setRefreshStats((prev) => prev + 1);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Obtener estado de módulos
  const modulo1 = courses.find((c) => c.module === "Módulo 1");
  const module1Complete = modulo1 ? isModuleComplete(modulo1.id, modulo1.lessons) : false;

  const stats = useMemo(() => {
    // Contar cursos completados basado en exámenes al 100%
    const courseCompletionStatus = courses.map((course) => {
      if (!course.lessons) return { course, completed: false };
      const lessonsWithExams = course.lessons.filter((l) => l.questions && l.questions.length > 0);
      if (lessonsWithExams.length === 0) return { course, completed: false };
      
      const allExams100 = lessonsWithExams.every((lesson) => {
        const score = getExamScore(course.id, lesson.id);
        return score === 100;
      });
      return { course, completed: allExams100 };
    });

    const total = courses.length;
    const completed = courseCompletionStatus.filter((c) => c.completed).length;
    
    // Calcular progreso general: exámenes completados / exámenes totales posibles
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

    return { total, completed, overallProgress };
  }, [refreshStats]);

  const continueCourse = courses.find((c) => c.status === "in-progress");
  const recentCourses = courses
    .slice(0, 4)
    .map((course) => {
      const isLocked = course.module === "Módulo 2" && !module1Complete;
      return { ...course, isLocked };
    });

  const statCards = [
    { label: "Total Cursos", value: stats.total, icon: BookOpen, color: "bg-primary/15 text-shell-dark" },
    { label: "Completados", value: stats.completed, icon: CheckCircle2, color: "bg-green-50 text-green-700" },
    { label: "Progreso General", value: `${stats.overallProgress}%`, icon: TrendingUp, color: "bg-accent/10 text-accent" },
  ];

  return (
    <AppLayout breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
            Hola, {user.codUsuario.split(" ")[0].toUpperCase()} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            ¿Qué habilidades aprenderás hoy?
          </p>
        </motion.div>

        {/* Continue course banner */}
        {continueCourse && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Link
              to={`/cursos/${continueCourse.id}`}
              className="group flex flex-col sm:flex-row items-stretch overflow-hidden rounded-xl border border-border bg-card card-hover"
            >
              <div className="sm:w-64 h-40 sm:h-auto overflow-hidden">
                <img
                  src={continueCourse.image}
                  alt={continueCourse.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center p-6">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                  Continuar capacitación
                </span>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  {continueCourse.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
                  {continueCourse.description}
                </p>
                <div className="flex items-center gap-4">
                  <ProgressBar value={getCourseProgress(continueCourse.id, continueCourse.lessons)} size="sm" showLabel className="flex-1 max-w-xs" />
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-accent group-hover:gap-2 transition-all">
                    Continuar <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Courses grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Cursos Destacados</h2>
            <Link
              to="/cursos"
              className="text-sm font-medium text-accent hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recentCourses.map((courseData, i) => {
              const { isLocked, ...course } = courseData as any;
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.35 + i * 0.05 }}
                >
                  <CourseCard course={course} isLocked={isLocked} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Index;
