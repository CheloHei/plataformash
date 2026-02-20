import { useState } from 'react';
import { useParams, Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import ProgressBar from "@/components/ProgressBar";
import StatusBadge from "@/components/StatusBadge";
import { ExamComponent } from "@/components/ExamComponent";
import { VideoPlayer } from "@/components/VideoPlayer";
import { courses } from "@/data/mockData";
import { CheckCircle2, Circle, Clock, PlayCircle, ArrowLeft, Lock, Play } from "lucide-react";
import { motion } from "framer-motion";
import { getExamScore, getCourseProgress } from "@/hooks/useExam";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);
  const course = courses.find((c) => c.id === id);

  // Verificar si una lección está desbloqueada
  const isLessonUnlocked = (lessonIndex: number): boolean => {
    if (lessonIndex === 0) return true; // Primera lección siempre desbloqueada
    
    const previousLesson = course?.lessons[lessonIndex - 1];
    if (!previousLesson?.questions) return true; // Si la anterior no tiene examen, está desbloqueada
    
    // Verificar si el examen anterior se completó al 100%
    const previousScore = getExamScore(course?.id || '', previousLesson.id);
    return previousScore === 100;
  };

  if (!course) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg font-medium text-foreground">Curso no encontrado</p>
          <Link to="/cursos" className="mt-4 text-sm text-accent hover:underline">
            Volver a cursos
          </Link>
        </div>
      </AppLayout>
    );
  }

  const nextLesson = course.lessons.find((l) => !l.completed);

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Cursos", href: "/cursos" },
        { label: course.title },
      ]}
    >
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Back */}
        <Link
          to="/cursos"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Volver a cursos
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden rounded-xl border border-border bg-card"
        >
          <div className="aspect-[21/9] overflow-hidden bg-black/10">
            {selectedVideo ? (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={selectedVideo.url}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <img
                src={course.image}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="p-6 lg:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {selectedVideo ? "VIDEO" : `${course.module} · ${course.category}`}
              </span>
              {!selectedVideo && <StatusBadge status={course.status} />}
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-3">
              {selectedVideo ? selectedVideo.title : course.title}
            </h1>
            <p className="text-muted-foreground mb-6">
              {selectedVideo ? `Lección del curso ${course.title}` : course.description}
            </p>

            {!selectedVideo && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <ProgressBar value={getCourseProgress(course.id, course.lessons)} size="md" showLabel className="flex-1" />
                  <div className="text-sm text-muted-foreground">
                    {course.completedLessons} de {course.totalLessons} lecciones completadas
                  </div>
                </div>

                {/* {nextLesson && (
                  <button className="mt-6 inline-flex items-center gap-2 rounded-lg shell-gradient-red px-6 py-3 text-sm font-semibold text-card shadow-md hover:opacity-90 transition-opacity">
                    <PlayCircle size={18} />
                    Continuar: {nextLesson.title}
                  </button>
                )} */}
                {course.status === "not-started" && (
                  <button className="mt-6 inline-flex items-center gap-2 rounded-lg shell-gradient px-6 py-3 text-sm font-semibold text-foreground shadow-md hover:opacity-90 transition-opacity">
                    <PlayCircle size={18} />
                    Comenzar curso
                  </button>
                )}
              </>
            )}
            {selectedVideo && (
              <button
                onClick={() => setSelectedVideo(null)}
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground shadow-md hover:bg-muted transition-colors"
              >
                <ArrowLeft size={18} />
                Volver al curso
              </button>
            )}
          </div>
        </motion.div>

        {/* Lessons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Contenido del curso ({course.totalLessons} lecciones)
          </h2>
          <div className="space-y-2">
            {course.lessons.map((lesson, i) => {
              const isNext = lesson.id === nextLesson?.id;
              const unlocked = isLessonUnlocked(i);
              const hasExam = lesson.questions && lesson.questions.length > 0;
              const prevLessonScore = i > 0 ? getExamScore(course.id, course.lessons[i - 1].id) : null;

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.2 + i * 0.04 }}
                  className={`flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg border p-4 transition-colors ${
                    !unlocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer group'
                  } ${
                    isNext && unlocked
                      ? "border-blue-500/50 bg-blue-50/10"
                      : "border-border bg-card hover:bg-muted/50"
                  }`}
                >
                  <div className="flex gap-4 flex-1 items-start sm:items-center">
                    <div className="flex-shrink-0">
                      {!unlocked ? (
                        <Lock size={22} className="text-destructive" />
                      ) : lesson.completed ? (
                        <CheckCircle2 size={22} className="text-green-500" />
                      ) : isNext ? (
                        <PlayCircle size={22} className="text-accent" />
                      ) : (
                        <Circle size={22} className="text-shell-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${lesson.completed ? "text-muted-foreground" : "text-foreground"}`}>
                        {lesson.title}
                      </p>
                      {hasExam && (
                        <p className="text-xs text-muted-foreground mt-1">
                          📝 {lesson.questions!.length} preguntas
                        </p>
                      )}
                      {!unlocked && i > 0 && (
                        <p className="text-xs text-destructive mt-1">
                          🔒 Completa el examen anterior al 100% para desbloquear
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto sm:flex-shrink-0 items-start sm:items-center">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={14} />
                      {lesson.duration}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {lesson.video && unlocked && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVideo({ url: lesson.video!, title: lesson.title });
                          }}
                          className="px-3 py-1 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-medium hover:bg-blue-500/30 transition-colors flex items-center gap-1"
                          title="Ver video"
                        >
                          <Play size={12} />
                          Ver video
                        </button>
                      )}
                      {hasExam && unlocked && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLesson(lesson.id);
                          }}
                          className="px-3 py-1 rounded bg-accent/20 text-accent text-xs font-medium hover:bg-accent/30 transition-colors"
                        >
                          Hacer examen
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Exam Modal */}
      {selectedLesson && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl my-8"
          >
            <div className="bg-background rounded-lg p-6 relative">
              <button
                onClick={() => setSelectedLesson(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>

              {course && (
                <ExamComponent
                  courseId={course.id}
                  lessonId={selectedLesson}
                  lessonTitle={course.lessons.find((l) => l.id === selectedLesson)?.title || ""}
                  questions={
                    course.lessons.find((l) => l.id === selectedLesson)?.questions || []
                  }
                  onComplete={() => {
                    setTimeout(() => setSelectedLesson(null), 2000);
                  }}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Video Player */}
      {/* <VideoPlayer
        isOpen={!!selectedVideo}
        videoUrl={selectedVideo?.url}
        lessonTitle={selectedVideo?.title || ""}
        onClose={() => setSelectedVideo(null)}
      /> */}
    </AppLayout>
  );
};

export default CourseDetail;
