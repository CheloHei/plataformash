import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  BookOpen,
  GripVertical,
  HelpCircle,
  Video,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { courses as initialCourses, type Course, type Lesson, type Question } from "@/data/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// ─── Draft types for the form ─────────────────────────────────────────────────

interface DraftQuestion {
  id: string;
  text: string;
  pointsCorrect: number;
  pointsPartial: number;
  pointsFailed: number;
}

interface DraftLesson {
  id: string;
  title: string;
  duration: string;
  video: string;
  questions: DraftQuestion[];
  expanded: boolean;
}

interface DraftCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  module: string;
  image: string;
  lessons: DraftLesson[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);

const courseToDraft = (c: Course): DraftCourse => ({
  id: c.id,
  title: c.title,
  description: c.description,
  category: c.category,
  module: c.module,
  image: c.image,
  lessons: (c.lessons || []).map((l) => ({
    id: l.id,
    title: l.title,
    duration: l.duration,
    video: l.video ?? "",
    questions: (l.questions || []).map((q) => ({
      id: q.id,
      text: q.text,
      pointsCorrect: q.points.correct,
      pointsPartial: q.points.partial,
      pointsFailed: q.points.failed,
    })),
    expanded: false,
  })),
});

const emptyDraft = (): DraftCourse => ({
  id: uid(),
  title: "",
  description: "",
  category: "",
  module: "",
  image: "",
  lessons: [],
});

const draftToCourse = (d: DraftCourse): Course => ({
  id: d.id,
  title: d.title,
  description: d.description,
  category: d.category,
  module: d.module,
  image: d.image,
  progress: 0,
  status: "not-started",
  totalLessons: d.lessons.length,
  completedLessons: 0,
  lessons: d.lessons.map((l) => ({
    id: l.id,
    title: l.title,
    duration: l.duration,
    completed: false,
    video: l.video || undefined,
    questions: l.questions.map((q) => ({
      id: q.id,
      text: q.text,
      points: {
        correct: q.pointsCorrect,
        partial: q.pointsPartial,
        failed: q.pointsFailed,
      },
    })),
  })),
});

// ─── Sub-components ───────────────────────────────────────────────────────────

const FieldRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-semibold text-gray-500 dark:text-white/70 uppercase tracking-wide">
      {label}
    </Label>
    {children}
  </div>
);

const inputStyle =
  "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 focus:border-[#DD1D21]/60 focus:ring-0";

// ─── Main Component ────────────────────────────────────────────────────────────

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draft, setDraft] = useState<DraftCourse>(emptyDraft());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ── Sheet helpers ──────────────────────────────────────────────────────────

  const openNew = () => {
    setDraft(emptyDraft());
    setEditingId(null);
    setSheetOpen(true);
  };

  const openEdit = (course: Course) => {
    setDraft(courseToDraft(course));
    setEditingId(course.id);
    setSheetOpen(true);
  };

  const saveDraft = () => {
    const updated = draftToCourse(draft);
    setCourses((prev) =>
      editingId
        ? prev.map((c) => (c.id === editingId ? updated : c))
        : [...prev, updated]
    );
    setSheetOpen(false);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setCourses((prev) => prev.filter((c) => c.id !== deleteId));
      setDeleteId(null);
    }
  };

  // ── Draft updaters ─────────────────────────────────────────────────────────

  const updateField = (field: keyof DraftCourse, value: string) =>
    setDraft((d) => ({ ...d, [field]: value }));

  const addLesson = () =>
    setDraft((d) => ({
      ...d,
      lessons: [
        ...d.lessons,
        { id: uid(), title: "", duration: "", video: "", questions: [], expanded: true },
      ],
    }));

  const removeLesson = (li: number) =>
    setDraft((d) => ({
      ...d,
      lessons: d.lessons.filter((_, i) => i !== li),
    }));

  const toggleLesson = (li: number) =>
    setDraft((d) => ({
      ...d,
      lessons: d.lessons.map((l, i) =>
        i === li ? { ...l, expanded: !l.expanded } : l
      ),
    }));

  const updateLesson = (li: number, field: keyof DraftLesson, value: string) =>
    setDraft((d) => ({
      ...d,
      lessons: d.lessons.map((l, i) =>
        i === li ? { ...l, [field]: value } : l
      ),
    }));

  const addQuestion = (li: number) =>
    setDraft((d) => ({
      ...d,
      lessons: d.lessons.map((l, i) =>
        i === li
          ? {
              ...l,
              questions: [
                ...l.questions,
                { id: uid(), text: "", pointsCorrect: 10, pointsPartial: 5, pointsFailed: 0 },
              ],
            }
          : l
      ),
    }));

  const removeQuestion = (li: number, qi: number) =>
    setDraft((d) => ({
      ...d,
      lessons: d.lessons.map((l, i) =>
        i === li
          ? { ...l, questions: l.questions.filter((_, j) => j !== qi) }
          : l
      ),
    }));

  const updateQuestion = (
    li: number,
    qi: number,
    field: keyof DraftQuestion,
    value: string | number
  ) =>
    setDraft((d) => ({
      ...d,
      lessons: d.lessons.map((l, i) =>
        i === li
          ? {
              ...l,
              questions: l.questions.map((q, j) =>
                j === qi ? { ...q, [field]: value } : q
              ),
            }
          : l
      ),
    }));

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <AdminLayout breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Cursos" }]}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cursos</h1>
            <p className="text-sm mt-0.5 text-red-900/50 dark:text-red-300/55">
              {courses.length} cursos registrados en la plataforma
            </p>
          </div>
          <Button
            onClick={openNew}
            className="bg-[#DD1D21] hover:bg-[#bb1519] text-white gap-2"
          >
            <Plus size={16} />
            Nuevo Curso
          </Button>
        </div>

        {/* Course cards/table */}
        <div className="space-y-3">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl p-4 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[0.06]"
            >
              <div className="flex items-start gap-4">
                {/* Image */}
                <div
                  className="hidden sm:flex h-14 w-20 rounded-lg overflow-hidden flex-shrink-0 items-center justify-center"
                  style={{ background: "rgba(221,29,33,0.1)" }}
                >
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <BookOpen size={20} style={{ color: "#DD1D21" }} />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{course.title}</h3>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(221,29,33,0.15)",
                        color: "#DD1D21",
                      }}
                    >
                      {course.module}
                    </span>
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-white/50"
                    >
                      {course.category}
                    </span>
                  </div>
                  <p className="text-xs line-clamp-1 text-gray-500 dark:text-white/45">
                    {course.description}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <span className="text-xs text-gray-400 dark:text-white/35">
                      {course.lessons.length} lección(es)
                    </span>
                    <span className="text-xs text-gray-400 dark:text-white/35">
                      {course.lessons.reduce(
                        (sum, l) => sum + (l.questions?.length ?? 0),
                        0
                      )}{" "}
                      pregunta(s)
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(course)}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/[0.1]"
                  >
                    <Edit3 size={13} />
                    <span className="hidden sm:inline">Editar</span>
                  </button>
                  <button
                    onClick={() => setDeleteId(course.id)}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors bg-[#DD1D21]/10 text-[#DD1D21] hover:bg-[#DD1D21]/20"
                  >
                    <Trash2 size={13} />
                    <span className="hidden sm:inline">Eliminar</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-16 text-gray-400 dark:text-white/30">
            <BookOpen size={32} className="mx-auto mb-3" />
            <p className="text-sm">No hay cursos. Crea el primero.</p>
          </div>
        )}
      </div>

      {/* ── Course Form Dialog ────────────────────────────────────────── */}
      <Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden bg-[#fff5f5] dark:bg-[#0d0303] border-red-200/40 dark:border-red-900/30 text-gray-900 dark:text-white p-0">
          <DialogHeader className="border-b border-red-200/25 dark:border-red-900/20 pb-4 px-4 sm:px-6 pt-4">
            <DialogTitle className="text-lg sm:text-xl text-gray-900 dark:text-white">
              {editingId ? "Editar Curso" : "Nuevo Curso"}
            </DialogTitle>
          </DialogHeader>

          <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-hidden">
            {/* Course info */}
            <section className="space-y-4">
              <h3
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "#DD1D21" }}
              >
                Información del Curso
              </h3>

              <FieldRow label="Título">
                <Input
                  value={draft.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Ej: Bienvenido a Shell"
                  className={inputStyle}
                />
              </FieldRow>

              <FieldRow label="Descripción">
                <Textarea
                  value={draft.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Describe el contenido del curso..."
                  rows={2}
                  className={inputStyle}
                />
              </FieldRow>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FieldRow label="Categoría">
                  <Input
                    value={draft.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    placeholder="Ej: Inducción"
                    className={inputStyle}
                  />
                </FieldRow>
                <FieldRow label="Módulo">
                  <Input
                    value={draft.module}
                    onChange={(e) => updateField("module", e.target.value)}
                    placeholder="Ej: Módulo 1"
                    className={inputStyle}
                  />
                </FieldRow>
              </div>

              <FieldRow label="URL de la imagen de portada">
                <Input
                  value={draft.image}
                  onChange={(e) => updateField("image", e.target.value)}
                  placeholder="https://..."
                  className={inputStyle}
                />
              </FieldRow>
            </section>

            {/* Divider */}
            <div className="border-t border-red-200/25 dark:border-red-900/20" />

            {/* Lessons */}
            <section className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h3
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "#DD1D21" }}
                >
                  Lecciones ({draft.lessons.length})
                </h3>
                <button
                  onClick={addLesson}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors w-full sm:w-auto justify-center sm:justify-start"
                  style={{
                    background: "rgba(221,29,33,0.15)",
                    color: "#DD1D21",
                  }}
                >
                  <Plus size={13} />
                  Agregar Lección
                </button>
              </div>

              <AnimatePresence initial={false}>
                {draft.lessons.map((lesson, li) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/[0.08]"
                  >
                    {/* Lesson header */}
                    <div
                      className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 cursor-pointer bg-gray-50 dark:bg-white/[0.03]"
                      onClick={() => toggleLesson(li)}
                    >
                      <GripVertical
                        size={14}
                        className="text-gray-300 dark:text-white/25 flex-shrink-0 hidden sm:block"
                      />
                      <span className="flex-1 text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                        {lesson.title || `Lección ${li + 1}`}
                      </span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-white/45 flex-shrink-0"
                      >
                        {lesson.questions.length} preg.
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeLesson(li);
                        }}
                        className="p-1 rounded transition-colors flex-shrink-0"
                        style={{ color: "rgba(221,29,33,0.6)" }}
                      >
                        <X size={13} />
                      </button>
                      {lesson.expanded ? (
                        <ChevronUp size={14} className="text-gray-400 dark:text-white/35 flex-shrink-0" />
                      ) : (
                        <ChevronDown size={14} className="text-gray-400 dark:text-white/35 flex-shrink-0" />
                      )}
                    </div>

                    {/* Lesson body */}
                    <AnimatePresence initial={false}>
                      {lesson.expanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 sm:px-4 pb-4 pt-3 space-y-3 sm:space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <FieldRow label="Título de la lección">
                                <Input
                                  value={lesson.title}
                                  onChange={(e) =>
                                    updateLesson(li, "title", e.target.value)
                                  }
                                  placeholder="Ej: Video 1: Productos"
                                  className={inputStyle}
                                />
                              </FieldRow>
                              <FieldRow label="Duración">
                                <Input
                                  value={lesson.duration}
                                  onChange={(e) =>
                                    updateLesson(li, "duration", e.target.value)
                                  }
                                  placeholder="Ej: 12 min"
                                  className={inputStyle}
                                />
                              </FieldRow>
                            </div>

                            <FieldRow label="URL del video (YouTube embed)">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                <Video
                                  size={15}
                                  style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0, marginTop: "10px" }}
                                  className="sm:mt-0"
                                />
                                <Input
                                  value={lesson.video}
                                  onChange={(e) =>
                                    updateLesson(li, "video", e.target.value)
                                  }
                                  placeholder="https://www.youtube.com/embed/..."
                                  className={`${inputStyle} text-xs sm:text-sm`}
                                />
                              </div>
                            </FieldRow>

                            {/* Questions */}
                            <div className="space-y-2">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                <p
                                    className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/40"
                                >
                                  Preguntas del Examen
                                </p>
                                <button
                                  onClick={() => addQuestion(li)}
                                  className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg w-full sm:w-auto justify-center sm:justify-start"
                                  style={{
                                    background: "rgba(251,206,7,0.1)",
                                    color: "#FBCE07",
                                  }}
                                >
                                  <Plus size={11} />
                                  Agregar
                                </button>
                              </div>

                              <AnimatePresence initial={false}>
                                {lesson.questions.map((q, qi) => (
                                  <motion.div
                                    key={q.id}
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.15 }}
                                    className="rounded-lg p-2 sm:p-3 space-y-2 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]"
                                  >
                                    <div className="flex items-center gap-2">
                                      <HelpCircle
                                        size={14}
                                        className="flex-shrink-0"
                                        style={{ color: "#FBCE07" }}
                                      />
                                      <Input
                                        value={q.text}
                                        onChange={(e) =>
                                          updateQuestion(li, qi, "text", e.target.value)
                                        }
                                        placeholder={`Pregunta ${qi + 1}...`}
                                        className={`flex-1 text-xs sm:text-sm ${inputStyle}`}
                                      />
                                      <button
                                        onClick={() => removeQuestion(li, qi)}
                                        className="flex-shrink-0"
                                        style={{ color: "rgba(221,29,33,0.6)" }}
                                      >
                                        <X size={13} />
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 sm:gap-3 pl-6">
                                      {(
                                        [
                                          {
                                            field: "pointsCorrect" as const,
                                            label: "Correcto",
                                            color: "#22c55e",
                                          },
                                          {
                                            field: "pointsPartial" as const,
                                            label: "Parcial",
                                            color: "#FBCE07",
                                          },
                                          {
                                            field: "pointsFailed" as const,
                                            label: "Fallido",
                                            color: "#DD1D21",
                                          },
                                        ] as const
                                      ).map(({ field, label, color }) => (
                                        <div key={field} className="space-y-1">
                                          <p
                                            className="text-[9px] sm:text-[10px] font-semibold text-center"
                                            style={{ color }}
                                          >
                                            {label}
                                          </p>
                                          <Input
                                            type="number"
                                            value={q[field]}
                                            onChange={(e) =>
                                              updateQuestion(
                                                li,
                                                qi,
                                                field,
                                                Number(e.target.value)
                                              )
                                            }
                                            min={0}
                                            className={`text-center text-xs sm:text-sm ${inputStyle}`}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </motion.div>
                                ))}
                              </AnimatePresence>

                              {lesson.questions.length === 0 && (
                                <p className="text-xs text-center py-3 text-gray-400 dark:text-white/25">
                                  Sin preguntas — agrega al menos una
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>

              {draft.lessons.length === 0 && (
                <div
                  className="text-center py-8 rounded-xl border border-dashed border-gray-200 dark:border-white/[0.12] text-gray-400 dark:text-white/30"
                >
                  <BookOpen size={24} className="mx-auto mb-2" />
                  <p className="text-xs">Agrega la primera lección al curso</p>
                </div>
              )}
            </section>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-red-200/25 dark:border-red-900/20 px-4 sm:px-6 py-4">
            <Button
              variant="outline"
              onClick={() => setSheetOpen(false)}
              className="border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={saveDraft}
              disabled={!draft.title.trim()}
              className="bg-[#DD1D21] hover:bg-[#bb1519] text-white w-full sm:w-auto"
            >
              {editingId ? "Guardar Cambios" : "Crear Curso"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirmation ────────────────────────────────────────── */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este curso?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El curso y todas sus lecciones serán
              eliminados de la plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminCourses;
