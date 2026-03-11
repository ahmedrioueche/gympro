import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../../context/ThemeContext";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode | ((closeDropdown: () => void) => React.ReactNode);
  align?: "left" | "right";
  className?: string;
  onOpen?: () => void;
}

export default function Dropdown({
  trigger,
  children,
  align = "right",
  className = "",
  onOpen,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  const closeDropdown = () => setIsOpen(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // Also check portals if needed, but for simple dropdowns this is usually enough
        // unless we want to ignore clicks inside the portal itself
        const portal = document.getElementById("dropdown-portal-root");
        if (portal && portal.contains(event.target as Node)) {
          return;
        }
        closeDropdown();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !isOpen;
    setIsOpen(newState);
    if (newState && onOpen) {
      onOpen();
    }
  };

  const getPortalContent = () => {
    if (!isOpen || !dropdownRef.current) return null;

    const rect = dropdownRef.current.getBoundingClientRect();
    const top = rect.bottom + window.scrollY + 2;
    // Desktop & Mobile positioning logic
    const isRtl = document.documentElement.dir === "rtl";
    const effectiveAlign = isRtl
      ? align === "left"
        ? "right"
        : "left"
      : align;

    const left =
      effectiveAlign === "left" ? rect.left + window.scrollX : "auto";
    const right =
      effectiveAlign === "right"
        ? window.innerWidth - (rect.right + window.scrollX)
        : "auto";

    return createPortal(
      <div
        id="dropdown-portal-root"
        className={`absolute w-72 rounded-xl border border-border bg-background shadow-2xl z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${className}`}
        style={{
          top: `${top}px`,
          left: left === "auto" ? "auto" : `${left}px`,
          right: right === "auto" ? "auto" : `${right}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-2">
          {typeof children === "function" ? children(closeDropdown) : children}
        </div>
      </div>,
      document.body,
    );
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <div onClick={toggle} className="cursor-pointer">
        {trigger}
      </div>
      {getPortalContent()}
    </div>
  );
}

// Dropdown.Item subcomponent
interface DropdownItemProps {
  icon?: React.ReactNode;
  label: string;
  description?: string | React.ReactNode; // Now accepts both string and JSX
  rightContent?: React.ReactNode; // New prop for content on the right
  onClick?: () => void;
  variant?: "default" | "danger";
  className?: string; // New prop for custom styling
}

export function DropdownItem({
  icon,
  label,
  description,
  rightContent,
  onClick,
  variant = "default",
  className = "",
}: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 flex items-${
        description ? "start" : "center"
      } gap-3 transition-colors ${
        variant === "danger"
          ? "hover:bg-danger/10 text-danger"
          : "hover:bg-border/50 text-text-primary"
      } ${className}`}
    >
      {icon && (
        <span className={`text-lg ${description ? "mt-0.5" : ""}`}>{icon}</span>
      )}
      <div className="flex-1 text-start">
        <div className="font-medium text-sm">{label}</div>
        {description && (
          <div className="text-xs text-text-secondary mt-0.5">
            {description}
          </div>
        )}
      </div>
      {rightContent && (
        <div className="flex items-center ms-2">{rightContent}</div>
      )}
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
  className?: string; // New prop for custom styling
}

export function DropdownHeader({
  children,
  className = "",
}: DropdownHeaderProps) {
  return (
    <div
      className={`px-4 py-2 text-xs font-semibold text-text-secondary uppercase tracking-wider ${className}`}
    >
      {children}
    </div>
  );
}
