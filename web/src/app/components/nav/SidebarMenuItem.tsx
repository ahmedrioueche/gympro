import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

interface SidebarMenuItemProps {
  link: {
    path: string;
    icon: React.ReactNode;
    label: string;
  };
  isActive: boolean;
  isCollapsed: boolean;
  onItemClick: () => void;
}

export const SidebarMenuItem = ({
  link,
  isActive,
  isCollapsed,
  onItemClick,
}: SidebarMenuItemProps) => {
  const { t } = useTranslation();

  return (
    <Link
      key={link.path}
      to={link.path}
      onClick={onItemClick}
      className="w-full block"
    >
      <button
        className={`sidebar-menu-item w-full group relative overflow-hidden rounded-r-xl flex items-center gap-3 px-3 py-3.5 transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary shadow-md"
            : "text-text-secondary hover:text-text-primary hover:bg-gradient-to-r hover:from-primary/25 via-accent/20 hover:to-secondary/25"
        }`}
        tabIndex={0}
      >
        {/* Light sweep effect */}
        <span className="absolute inset-0 w-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:w-full transition-all duration-500 ease-out"></span>

        {/* Icon - Fixed width to prevent shifting */}
        <span className="flex-shrink-0 relative z-10 flex items-center justify-center w-8">
          {link.icon}
        </span>

        {/* Text - absolute positioning prevents layout shift */}
        <span
          className={`relative z-10 font-semibold text-sm whitespace-nowrap transition-opacity duration-300 ${
            isCollapsed
              ? "opacity-0 pointer-events-none absolute"
              : "opacity-100"
          }`}
        >
          {t(`sidebar.${link.label}`)}
        </span>
      </button>
    </Link>
  );
};
