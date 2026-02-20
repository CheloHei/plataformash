interface ProgressBarProps {
  value: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-3.5",
};

const ProgressBar = ({ value, size = "md", showLabel = false, className = "" }: ProgressBarProps) => {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex-1 overflow-hidden rounded-full bg-shell-gray-200 ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} rounded-full transition-all duration-500 ease-out ${
            clampedValue === 100
              ? "bg-green-500"
              : clampedValue > 0
              ? "shell-gradient"
              : ""
          }`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-muted-foreground min-w-[3ch] text-right">
          {clampedValue}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
