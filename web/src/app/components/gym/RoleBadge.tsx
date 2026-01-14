import { useTranslation } from "react-i18next";

const ROLE_STYLES = {
  owner: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  manager: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  receptionist: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  coach: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  member: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  cleaner: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  maintenance: "bg-gray-500/10 text-gray-600 border-gray-500/20",
} as const;

interface RoleBadgeProps {
  role: string;
  size?: "xs" | "sm" | "md";
}

export default function RoleBadge({ role, size = "md" }: RoleBadgeProps) {
  const { t } = useTranslation();

  const sizeClasses = {
    xs: "text-[10px] px-1.5 py-0.5",
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
  };

  const normalizedRole = role.toLowerCase();
  const style =
    ROLE_STYLES[normalizedRole as keyof typeof ROLE_STYLES] ||
    ROLE_STYLES.member;

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${style} ${sizeClasses[size]}`}
    >
      {t(`roles.${normalizedRole}`)}
    </span>
  );
}
