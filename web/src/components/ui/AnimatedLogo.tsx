import { Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../styles/animatedLogo.css";

const AnimatedLogo = ({
  height = "h-16",
  width = "w-[400px]",
  logoSize = "w-16 h-16",
  textSize = "md:text-3xl text-2xl",
  leftPosition = "50%",
  paddingTop = "pt-0",
  onClick,
  compact = false,
}: {
  height?: string;
  width?: string;
  logoSize?: string;
  textSize?: string;
  leftPosition?: string;
  paddingTop?: string;
  onClick?: () => void;
  compact?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <div
      onClick={() => {
        onClick();
      }}
      className={`flex items-center justify-center mb-3 ${height} relative ${width} ${paddingTop} ${
        onClick ? "cursor-pointer" : " "
      }`}
    >
      {/* Zap Icon with smooth horizontal shift */}
      <div
        className="zap-container animate-zap-move"
        style={{ left: leftPosition }}
      >
        <div
          className={`${logoSize} bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg zap-shine`}
        >
          <Zap className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* App Name with slide-in and shiny effect */}
      {!compact && (
        <span
          className={`${textSize} app-name animate-app-slide font-bold whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary`}
          style={{ left: leftPosition }}
        >
          {t("app.name")}
        </span>
      )}
    </div>
  );
};

export default AnimatedLogo;
