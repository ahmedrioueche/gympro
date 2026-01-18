import { Edit3, X } from "lucide-react";
import React, { type ElementType, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import useScreen from "../../hooks/useScreen";

interface FooterButton {
  label?: string;
  onClick?: (e?: React.MouseEvent) => void;
  icon?: ElementType;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  form?: string;
}

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ElementType;
  children: ReactNode;

  // Edit mode support
  isEditMode?: boolean;
  editTitle?: string;
  onTitleChange?: (title: string) => void;
  onEditClick?: () => void;
  showEditButton?: boolean;

  // Footer configuration
  footer?: ReactNode; // Custom footer (overrides button props)
  showFooter?: boolean;

  // Secondary button (left)
  showSecondaryButton?: boolean;
  secondaryButton?: FooterButton;

  // Primary button (right) - only renders if primaryButton is provided
  primaryButton?: FooterButton;

  // Sizing
  maxWidth?: string;
  // Display options
  hideCloseButton?: boolean;
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  isEditMode = false,
  editTitle,
  onTitleChange,
  onEditClick,
  showEditButton = false,
  footer,
  showFooter = true,
  showSecondaryButton = true,
  secondaryButton,
  primaryButton,
  maxWidth = "max-w-3xl",
  hideCloseButton = false,
}) => {
  const { isMobile } = useScreen();
  const { t } = useTranslation();

  if (!isOpen) return null;

  const displayTitle =
    isEditMode && editTitle !== undefined ? editTitle : title;

  // Default button configurations
  const secondaryConfig: FooterButton = {
    label: t("common.cancel"),
    onClick: onClose,
    type: "button",
    ...secondaryButton,
  };

  const primaryConfig: FooterButton | undefined = primaryButton
    ? {
        label: t("common.confirm"),
        type: "button",
        disabled: primaryButton.disabled,
        ...primaryButton,
      }
    : undefined;

  const PrimaryIcon = primaryConfig?.icon;

  // Footer shows if: custom footer provided, or secondary button shown, or primary button provided
  const hasFooter =
    showFooter && (footer || showSecondaryButton || primaryButton);

  return createPortal(
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={hideCloseButton ? undefined : onClose}
    >
      <div
        className={`bg-surface rounded-2xl shadow-2xl ${maxWidth} max-h-[99vh] w-full border-2 border-primary/30 overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col`}
        style={{
          width: isMobile ? "93vw" : undefined,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {Icon && (
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-white" />
                </div>
              )}
              <div>
                {isEditMode && onTitleChange ? (
                  <input
                    type="text"
                    value={displayTitle}
                    onChange={(e) => onTitleChange(e.target.value)}
                    className="text-2xl font-bold text-white bg-white/20 rounded-lg px-3 py-1 border border-white/30 outline-none focus:border-white/50 mb-1"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {displayTitle}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-white/90 text-sm">{subtitle}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {showEditButton && !isEditMode && onEditClick && (
                <button
                  onClick={onEditClick}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  title={t("common.edit")}
                >
                  <Edit3 className="w-5 h-5 text-white" />
                </button>
              )}
              {!hideCloseButton && (
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="p-6">{children}</div>
        </div>

        {/* Footer */}
        {hasFooter && (
          <div className="p-6 bg-surface-secondary border-t-2 border-border flex-shrink-0">
            {footer ? (
              footer
            ) : (
              <div
                className={`flex gap-3 ${!primaryConfig ? "justify-end" : ""}`}
              >
                {showSecondaryButton && (
                  <button
                    type={secondaryConfig.type}
                    form={secondaryConfig.form}
                    onClick={secondaryConfig.onClick}
                    className={`${
                      primaryConfig ? "flex-1" : ""
                    } px-6 py-3 rounded-xl font-semibold text-text-secondary bg-surface hover:bg-surface-secondary border-2 border-border hover:border-primary/30 transition-all`}
                  >
                    {secondaryConfig.label}
                  </button>
                )}
                {primaryConfig && (
                  <button
                    type={primaryConfig.type}
                    form={primaryConfig.form}
                    onClick={primaryConfig.onClick}
                    disabled={primaryConfig.disabled || primaryConfig.loading}
                    className={`flex-1 px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 shadow-sm flex items-center justify-center gap-2 ${
                      primaryConfig.disabled || primaryConfig.loading
                        ? "bg-gray-400 cursor-auto opacity-50 shadow-none ring-0"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 hover:shadow-xl"
                    }`}
                  >
                    {primaryConfig.loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t("common.loading")}
                      </>
                    ) : (
                      <>
                        {PrimaryIcon && <PrimaryIcon className="w-5 h-5" />}
                        {primaryConfig.label}
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default BaseModal;
