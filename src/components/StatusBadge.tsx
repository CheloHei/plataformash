export type CourseStatus = "not-started" | "in-progress" | "completed";

interface StatusBadgeProps {
  status: CourseStatus;
  className?: string;
}

const statusConfig: Record<CourseStatus, { label: string; className: string }> = {
  "not-started": {
    label: "No iniciado",
    className: "bg-shell-gray-100 text-shell-gray-700",
  },
  "in-progress": {
    label: "En progreso",
    className: "bg-primary/15 text-shell-dark",
  },
  completed: {
    label: "Completado",
    className: "bg-green-50 text-green-700",
  },
};

const StatusBadge = ({ status, className = "" }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${config.className} ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "completed"
            ? "bg-green-500"
            : status === "in-progress"
            ? "bg-primary"
            : "bg-shell-gray-300"
        }`}
      />
      {config.label}
    </span>
  );
};

export default StatusBadge;
