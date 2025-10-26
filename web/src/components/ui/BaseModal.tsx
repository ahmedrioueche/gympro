import React, { type ReactNode, type ElementType } from "react";
import { X } from "lucide-react";
import useScreen from "../../hooks/useScreen";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: ElementType;
  children: ReactNode;
  buttons?: ReactNode;
  width?: string;
  height?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  icon: Icon,
  children,
  buttons,
  width,
  height,
}) => {
  const { isMobile } = useScreen();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`bg-light-background dark:bg-dark-background rounded-lg ${
          !width ? "w-full max-w-md" : "min-w-[300px]"
        }`}
        style={{
          width: isMobile ? "93vw" : width,
          height: height,
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {Icon && (
              <Icon className="w-5 h-5 text-light-primary dark:text-dark-primary" />
            )}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">{children}</div>

        {/* Footer */}
        {buttons && (
          <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
            {buttons}
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseModal;
