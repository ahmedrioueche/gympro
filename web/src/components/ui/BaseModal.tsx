import { X } from "lucide-react";
import React, { type ElementType, type ReactNode } from "react";
import { createPortal } from "react-dom";
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

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`bg-black/90 rounded-lg ${
          !width ? "w-full max-w-md" : "min-w-[300px]"
        }`}
        style={{
          width: isMobile ? "93vw" : width,
          height,
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-primary" />}
            <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          </div>

          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">{children}</div>

        {/* Footer */}
        {buttons && (
          <div className="flex justify-end gap-2 p-4 border-t border-border">
            {buttons}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default BaseModal;
