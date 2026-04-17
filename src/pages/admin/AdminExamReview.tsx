import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Minus,
  ThumbsDown,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import {
  examSubmissions as initialSubmissions,
  type AdminExamSubmission,
  type AdminExamAnswer,
} from "@/data/adminMockData";
import { Button } from "@/components/ui/button";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcScore(answers: AdminExamAnswer[], maxPoints: number): number {
  const total = answers.reduce((sum, a) => {
    const grade = a.adminOverride ?? a.studentSelection;
    if (grade === "correct") return sum + a.pointsCorrect;
    if (grade === "partial") return sum + a.pointsPartial;
    return sum + a.pointsFailed;
  }, 0);
  return maxPoints > 0 ? Math.round((total / maxPoints) * 100) : 0;
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-PY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Grade button ─────────────────────────────────────────────────────────────

type Grade = "correct" | "partial" | "failed";

const gradeConfig: Record<Grade, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  correct: { label: "Correcto", icon: ThumbsUp, color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
  partial: { label: "Parcial", icon: Minus, color: "#FBCE07", bg: "rgba(251,206,7,0.15)" },
  failed: { label: "Fallido", icon: ThumbsDown, color: "#DD1D21", bg: "rgba(221,29,33,0.15)" },
};

// ─── Submission card ───────────────────────────────────────────────────────────

const SubmissionCard = ({
  submission,
  index,
  onSave,
}: {
  submission: AdminExamSubmission;
  index: number;
  onSave: (updated: AdminExamSubmission) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, Grade>>(
    Object.fromEntries(
      submission.answers.map((a) => [a.questionId, (a.adminOverride ?? a.studentSelection) as Grade])
    )
  );
  const [saved, setSaved] = useState(submission.status === "reviewed");

  const maxPoints = submission.answers.reduce((s, a) => s + a.pointsCorrect, 0);
  const currentScore = useMemo(() => {
    const total = submission.answers.reduce((sum, a) => {
      const g = overrides[a.questionId] ?? a.studentSelection;
      if (g === "correct") return sum + a.pointsCorrect;
      if (g === "partial") return sum + a.pointsPartial;
      return sum + a.pointsFailed;
    }, 0);
    return maxPoints > 0 ? Math.round((total / maxPoints) * 100) : 0;
  }, [overrides, submission.answers, maxPoints]);

  const handleSave = () => {
    const updated: AdminExamSubmission = {
      ...submission,
      status: "reviewed",
      adminScore: currentScore,
      answers: submission.answers.map((a) => ({
        ...a,
        adminOverride: overrides[a.questionId],
      })),
    };
    onSave(updated);
    setSaved(true);
  };

  const hasDiff = submission.answers.some(
    (a) => overrides[a.questionId] !== a.studentSelection
  );

  const isPending = submission.status === "pending_review";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`rounded-xl overflow-hidden border ${isPending && !saved ? "border-yellow-400/25" : "border-gray-100 dark:border-white/[0.06]"}`}
    >
      {/* Header row */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-white dark:bg-[#111]"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Avatar */}
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-white text-xs font-bold flex-shrink-0"
          style={{ background: "#DD1D21" }}
        >
          {submission.studentCode.slice(0, 2)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {submission.studentName}
          </p>
          <p className="text-xs truncate text-gray-500 dark:text-white/40">
            {submission.courseName} · {submission.lessonTitle}
          </p>
        </div>

        {/* Score */}
        <div className="text-right flex-shrink-0 hidden sm:block">
          <p
            className="text-sm font-bold"
            style={{
              color:
                currentScore >= 80
                  ? "#22c55e"
                  : currentScore >= 60
                  ? "#FBCE07"
                  : "#DD1D21",
            }}
          >
            {currentScore}%
          </p>
          <p className="text-[10px] text-gray-400 dark:text-white/30">
            alumno: {submission.studentScore}%
          </p>
        </div>

        {/* Status badge */}
        <div
          className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
          style={
            saved || submission.status === "reviewed"
              ? { background: "rgba(34,197,94,0.12)", color: "#22c55e" }
              : { background: "rgba(251,206,7,0.12)", color: "#FBCE07" }
          }
        >
          {saved || submission.status === "reviewed" ? (
            <CheckCircle2 size={11} />
          ) : (
            <AlertCircle size={11} />
          )}
          <span className="hidden sm:inline">
            {saved || submission.status === "reviewed" ? "Revisado" : "Pendiente"}
          </span>
        </div>

        {/* Time */}
        <span className="text-[11px] hidden md:block text-gray-400 dark:text-white/30">
          <Clock size={10} className="inline mr-1" />
          {formatTime(submission.timeSpentSeconds)}
        </span>

        {/* Expand */}
        {expanded ? (
          <ChevronUp size={15} className="text-gray-300 dark:text-white/25 flex-shrink-0" />
        ) : (
          <ChevronDown size={15} className="text-gray-300 dark:text-white/25 flex-shrink-0" />
        )}
      </div>

      {/* Expanded review panel */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pt-3 pb-5 space-y-4 bg-gray-50/40 dark:bg-white/[0.015] border-t border-gray-100 dark:border-white/[0.06]"
            >
              {/* Submission meta */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-white/40">
                <span>Enviado: {formatDate(submission.submittedAt)}</span>
                <span>Tiempo: {formatTime(submission.timeSpentSeconds)}</span>
                <span>Preguntas: {submission.answers.length}</span>
                {hasDiff && (
                  <span style={{ color: "#FBCE07" }}>
                    ⚠ Tienes modificaciones sin guardar
                  </span>
                )}
              </div>

              {/* Questions */}
              <div className="space-y-3">
                {submission.answers.map((answer, qi) => {
                  const currentGrade = overrides[answer.questionId];
                  const studentGrade = answer.studentSelection;
                  const isDifferent = currentGrade !== studentGrade;

                  return (
                    <div
                      key={answer.questionId}
                      className={`rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-white/[0.03] border ${isDifferent ? "border-yellow-400/20" : "border-gray-100 dark:border-white/[0.06]"}`}
                    >
                      {/* Question text */}
                      <div className="flex items-start gap-2">
                        <span
                          className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold flex-shrink-0 mt-0.5"
                          style={{ background: "rgba(221,29,33,0.2)", color: "#DD1D21" }}
                        >
                          {qi + 1}
                        </span>
                        <p className="text-sm text-gray-900 dark:text-white">{answer.questionText}</p>
                      </div>

                      {/* Student selection */}
                      <div className="flex items-center gap-2 pl-7">
                        <p className="text-[11px] text-gray-500 dark:text-white/40">
                          El alumno indicó:
                        </p>
                        <span
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: gradeConfig[studentGrade].bg,
                            color: gradeConfig[studentGrade].color,
                          }}
                        >
                          {gradeConfig[studentGrade].label}
                        </span>
                        {isDifferent && (
                          <button
                            onClick={() =>
                              setOverrides((prev) => ({
                                ...prev,
                                [answer.questionId]: studentGrade,
                              }))
                            }
                            className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-white/30"
                          >
                            <RotateCcw size={10} />
                            Restaurar
                          </button>
                        )}
                      </div>

                      {/* Admin grade buttons */}
                      <div className="pl-7">
                        <p className="text-[10px] font-semibold uppercase tracking-wide mb-2 text-gray-400 dark:text-white/30">
                          Calificación del administrador:
                        </p>
                        <div className="flex gap-2">
                          {(["correct", "partial", "failed"] as Grade[]).map((g) => {
                            const cfg = gradeConfig[g];
                            const isSelected = currentGrade === g;
                            const Ic = cfg.icon;
                            return (
                              <button
                                key={g}
                                onClick={() =>
                                  setOverrides((prev) => ({
                                    ...prev,
                                    [answer.questionId]: g,
                                  }))
                                }
                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                                style={
                                  isSelected
                                    ? { background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}40` }
                                    : { background: "rgba(156,163,175,0.12)", color: "#6b7280", border: "1px solid rgba(156,163,175,0.2)" }
                                }
                              >
                                <Ic size={12} />
                                {cfg.label}
                                {g === "correct" && (
                                  <span className="opacity-60 text-[10px]">
                                    {answer.pointsCorrect}pt
                                  </span>
                                )}
                                {g === "partial" && (
                                  <span className="opacity-60 text-[10px]">
                                    {answer.pointsPartial}pt
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Score preview + save */}
              <div className="flex items-center justify-between rounded-xl px-4 py-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
                <div>
                  <p className="text-xs text-gray-500 dark:text-white/40">
                    Puntaje final tras revisión
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{
                      color: currentScore >= 80 ? "#22c55e" : currentScore >= 60 ? "#FBCE07" : "#DD1D21",
                    }}
                  >
                    {currentScore}%
                  </p>
                </div>
                <Button
                  onClick={handleSave}
                  disabled={saved && !hasDiff}
                  className="bg-[#DD1D21] hover:bg-[#bb1519] text-white gap-2"
                >
                  <CheckCircle2 size={15} />
                  {saved ? "Actualizar revisión" : "Confirmar revisión"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main page ─────────────────────────────────────────────────────────────────

type FilterTab = "all" | "pending_review" | "reviewed";

const AdminExamReview = () => {
  const [submissions, setSubmissions] = useState<AdminExamSubmission[]>(initialSubmissions);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const handleSave = (updated: AdminExamSubmission) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  };

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "Todos", count: submissions.length },
    {
      key: "pending_review",
      label: "Pendientes",
      count: submissions.filter((s) => s.status === "pending_review").length,
    },
    {
      key: "reviewed",
      label: "Revisados",
      count: submissions.filter((s) => s.status === "reviewed").length,
    },
  ];

  const filtered = useMemo(
    () =>
      activeTab === "all"
        ? submissions
        : submissions.filter((s) => s.status === activeTab),
    [submissions, activeTab]
  );

  const pendingCount = submissions.filter((s) => s.status === "pending_review").length;

  return (
    <AdminLayout breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Exámenes" }]}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Revisión de Exámenes</h1>
          <p className="text-sm mt-0.5 text-red-900/50 dark:text-red-300/55">
            Revisa y valida los exámenes enviados por los alumnos
          </p>
        </div>

        {/* Alert for pending */}
        {pendingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: "rgba(251,206,7,0.08)", border: "1px solid rgba(251,206,7,0.25)" }}
          >
            <AlertCircle size={18} style={{ color: "#FBCE07", flexShrink: 0 }} />
            <p className="text-sm font-medium" style={{ color: "#FBCE07" }}>
              Hay {pendingCount} examen{pendingCount !== 1 ? "es" : ""} pendiente
              {pendingCount !== 1 ? "s" : ""} de revisión
            </p>
          </motion.div>
        )}

        {/* Tabs */}
        <div
          className="flex gap-1 rounded-lg p-1 w-fit bg-gray-100 dark:bg-white/[0.05]"
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-md transition-all"
              style={
                activeTab === tab.key
                  ? { background: "rgba(209,213,219,0.8)", color: "#111827" }
                  : { color: "#6b7280" }
              }
            >
              {tab.label}
              <span
                className="text-[11px] px-1.5 py-0.5 rounded-full"
                style={{
                  background:
                    activeTab === tab.key
                      ? tab.key === "pending_review"
                        ? "rgba(251,206,7,0.25)"
                        : "rgba(255,255,255,0.15)"
                      : "transparent",
                  color:
                    tab.key === "pending_review" && tab.count > 0
                      ? "#FBCE07"
                      : activeTab === tab.key ? "#374151" : "#9ca3af",
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Column headers (desktop) */}
        <div
          className="hidden md:flex items-center gap-3 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30"
        >
          <div className="w-9 flex-shrink-0" />
          <div className="flex-1">Alumno / Examen</div>
          <div className="w-20 text-right">Puntaje</div>
          <div className="w-28 text-center">Estado</div>
          <div className="w-16">Tiempo</div>
          <div className="w-4" />
        </div>

        {/* Submissions */}
        <div className="space-y-2">
          {filtered.map((sub, i) => (
            <SubmissionCard
              key={sub.id}
              submission={sub}
              index={i}
              onSave={handleSave}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div
            className="text-center py-16 text-gray-400 dark:text-white/30"
          >
            <ClipboardList size={32} className="mx-auto mb-3" />
            <p className="text-sm">No hay exámenes en esta categoría</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminExamReview;
