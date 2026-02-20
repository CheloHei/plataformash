import { Link } from "react-router-dom";
import { Course } from "@/data/mockData";
import StatusBadge from "./StatusBadge";
import ProgressBar from "./ProgressBar";
import { BookOpen, Clock, Lock } from "lucide-react";
import { getCourseProgress } from "@/hooks/useExam";

interface CourseCardProps {
  course: Course;
  isLocked?: boolean;
}

const CourseCard = ({ course, isLocked = false }: CourseCardProps) => {
  if (isLocked) {
    return (
      <div className="overflow-hidden rounded-lg border border-border bg-card opacity-60 cursor-not-allowed">
        <div className="aspect-video overflow-hidden relative">
          <img
            src={course.image}
            alt={course.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Lock size={32} className="text-white" />
              <p className="text-white text-xs font-medium">Bloqueado</p>
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {course.module}
            </span>
            <StatusBadge status={course.status} />
          </div>
          <h3 className="mb-2 text-base font-semibold text-foreground line-clamp-2">
            {course.title}
          </h3>
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
          <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-xs text-destructive font-medium">
              🔒 Completa el Módulo 1 al 100% para desbloquear
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/cursos/${course.id}`} className="block">
      <div className="group overflow-hidden rounded-lg border border-border bg-card card-hover">
        <div className="aspect-video overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {course.module}
            </span>
            <StatusBadge status={course.status} />
          </div>
          <h3 className="mb-2 text-base font-semibold text-foreground line-clamp-2 group-hover:text-accent transition-colors">
            {course.title}
          </h3>
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
          <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen size={14} />
              {course.totalLessons} lecciones
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {course.completedLessons}/{course.totalLessons}
            </span>
          </div>
          <ProgressBar value={getCourseProgress(course.id, course.lessons)} size="sm" showLabel />
        </div>
      </div>
    </Link>
  );
};;

export default CourseCard;
