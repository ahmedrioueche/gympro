import { Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  collapsed?: boolean;
  onClick?: () => void;
};

export default function SidebarAnimatedLogo({
  collapsed = false,
  onClick,
}: Props) {
  const { t } = useTranslation();
  const prevCollapsed = useRef<boolean>(collapsed);
  const [animating, setAnimating] = useState(false);
  const [animDirection, setAnimDirection] = useState<"open" | "close">("open");

  // Play the animation once when collapsed changes
  useEffect(() => {
    if (prevCollapsed.current !== collapsed) {
      setAnimDirection(collapsed ? "close" : "open");
      setAnimating(true);
      const id = setTimeout(() => setAnimating(false), 450);
      prevCollapsed.current = collapsed;
      return () => clearTimeout(id);
    }
  }, [collapsed]);

  const iconExtra = animating
    ? animDirection === "open"
      ? "scale-110 rotate-12"
      : "scale-95 -rotate-6"
    : "scale-100 rotate-0";

  return (
    <div
      onClick={() => onClick?.()}
      className="flex items-center gap-3 w-full px-4 py-6 cursor-pointer group"
      role="button"
      title={t("app.name")}
    >
      {/* Icon Container - Always left aligned */}
      <div className="relative flex-shrink-0">
        <div
          className={`flex items-center justify-center rounded-xl shadow-lg bg-gradient-to-br from-primary via-primary to-secondary w-10 h-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl group-hover:shadow-primary/40`}
        >
          <Zap
            className={`text-white w-6 h-6 transition-transform duration-500 ${iconExtra}`}
          />
        </div>
        {!collapsed && (
          <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        )}
      </div>

      {/* Text Container - Absolute positioned to prevent layout shift */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className={`font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary whitespace-nowrap transition-all duration-500 ${
            collapsed
              ? "opacity-0 translate-x-[-20px]"
              : "opacity-100 translate-x-0"
          } group-hover:from-secondary group-hover:to-primary`}
        >
          {t("app.name")}
        </div>
      </div>
    </div>
  );
}
