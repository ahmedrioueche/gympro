// components/ui/Dropdown.tsx
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

export default function Dropdown({
  trigger,
  children,
  align = "right",
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`fixed w-72 rounded-lg border border-border ${
            isDark
              ? "dark:bg-gradient-to-br dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900"
              : "bg-background"
          }  shadow-xl z-50 ${
            align === "right" ? "right-auto" : "left-auto"
          } ${className}`}
          style={{
            top: `${
              dropdownRef.current?.getBoundingClientRect().bottom ?? 0
            }px`,
            [align === "right" ? "right" : "left"]: `${
              align === "right"
                ? window.innerWidth -
                  (dropdownRef.current?.getBoundingClientRect().right ?? 0)
                : dropdownRef.current?.getBoundingClientRect().left ?? 0
            }px`,
          }}
        >
          <div className="py-2">{children}</div>
        </div>
      )}
    </div>
  );
}

// Dropdown.Item subcomponent
interface DropdownItemProps {
  icon?: React.ReactNode;
  label: string;
  description?: string;
  onClick?: () => void;
  variant?: "default" | "danger";
}

export function DropdownItem({
  icon,
  label,
  description,
  onClick,
  variant = "default",
}: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 flex items-start gap-3 transition-colors ${
        variant === "danger"
          ? "hover:bg-danger/10 text-danger"
          : "hover:bg-border/50 text-text-primary"
      }`}
    >
      {icon && <span className="text-lg mt-0.5">{icon}</span>}
      <div className="flex-1 text-left">
        <div className="font-medium text-sm">{label}</div>
        {description && (
          <div className="text-xs text-text-secondary mt-0.5">
            {description}
          </div>
        )}
      </div>
    </button>
  );
}

// Dropdown.Divider subcomponent
export function DropdownDivider() {
  return <div className="my-2 border-t border-border" />;
}

// Dropdown.Header subcomponent
interface DropdownHeaderProps {
  children: React.ReactNode;
}

export function DropdownHeader({ children }: DropdownHeaderProps) {
  return (
    <div className="px-4 py-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
      {children}
    </div>
  );
}
