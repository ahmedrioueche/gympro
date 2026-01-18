interface TabProps {
  label: string;
  count?: number;
  isActive?: boolean;
  onClick?: () => void;
}

export default function Tab({ label, count, isActive, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={`
        py-4 px-1 border-b-2 font-medium text-sm transition-colors
        ${
          isActive
            ? "border-primary text-primary"
            : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-hover"
        }
      `}
    >
      {label}
      {count !== undefined && <span className="ml-1">({count})</span>}
    </button>
  );
}
