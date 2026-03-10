import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ReactNode } from "react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import { useLanguageStore } from "../../../../store/language";
import type { WelcomeTourModalProps as StoreProps } from "../../../../types/modals";

export interface TourStep {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  content: ReactNode;
  icon?: React.ElementType;
}

export interface WelcomeTourModalProps extends StoreProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  steps: TourStep[];
  isSubmitting?: boolean;
}

const WelcomeTourModal: React.FC<WelcomeTourModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  steps,
  isSubmitting = false,
}) => {
  const { t } = useTranslation();
  const { isRtl } = useLanguageStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen || steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const StepIcon = currentStep.icon;

  const customHeader = (
    <div className="bg-gradient-to-r from-primary to-secondary p-3 md:p-4 flex-shrink-0 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl pointer-events-none" />
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 shadow-inner border border-white/20 transition-all duration-500 ease-in-out">
            {StepIcon ? (
              <StepIcon className="w-5 h-5 md:w-6 md:h-6 text-white animate-in zoom-in duration-500" />
            ) : (
              <div className="w-6 h-6 md:w-8 md:h-8 text-white font-bold text-xl flex items-center justify-center animate-in zoom-in duration-500">
                {currentStepIndex + 1}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h2
              key={`title-${currentStep.id}`}
              className="text-lg md:text-xl font-extrabold text-white mb-0.5 truncate animate-in slide-in-from-bottom-2 fade-in duration-500"
            >
              {currentStep.title}
            </h2>
            {currentStep.subtitle && (
              <p
                key={`subtitle-${currentStep.id}`}
                className="text-white/90 text-xs md:text-sm font-medium animate-in slide-in-from-bottom-3 fade-in duration-500 max-w-lg"
              >
                {currentStep.subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10"
            title={t("common.skip")}
          >
            <X className="w-4 h-4 md:w-5 md:h-5 text-white/80" />
          </button>
        </div>
      </div>
    </div>
  );

  const customFooter = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2 px-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === currentStepIndex
                ? "w-8 bg-primary"
                : "w-2 bg-text-secondary/30"
            }`}
          />
        ))}
      </div>
      <div className="flex items-center gap-3">
        {!isLastStep && (
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors bg-transparent border-0"
            type="button"
          >
            {t("common.skip")}
          </button>
        )}
        {!isFirstStep && (
          <button
            onClick={handlePrev}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-surface hover:bg-surface-hover border border-border text-text-secondary transition-all"
            type="button"
            disabled={isSubmitting}
          >
            {isRtl ? (
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-4 py-2 md:py-2.5 rounded-xl font-semibold text-xs md:text-sm transition-all duration-300 ${
            isLastStep
              ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30"
              : "bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary text-white shadow-lg shadow-primary/30"
          }`}
          type="button"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : isLastStep ? (
            <>
              {t("common.finish")}
              <Check className="w-4 h-4 md:w-5 md:h-5" />
            </>
          ) : (
            <>
              {t("common.next")}
              {isRtl ? (
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("welcomeTour.title")}
      maxWidth="max-w-5xl"
      hideCloseButton={true}
      customHeader={customHeader}
      footer={customFooter}
    >
      <div className="relative w-full overflow-hidden flex items-center justify-center h-[85vh] md:h-[580px]">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isPast = index < currentStepIndex;
          let transformClass = "translate-x-0";
          if (!isActive) {
            const multiplier = isRtl ? 1 : -1;
            transformClass = isPast
              ? `${multiplier > 0 ? "" : "-"}translate-x-8 md:${multiplier > 0 ? "" : "-"}translate-x-16`
              : `${multiplier < 0 ? "" : "-"}translate-x-8 md:${multiplier < 0 ? "" : "-"}translate-x-16`;
          }

          return (
            <div
              key={step.id}
              className={`absolute inset-0 p-1 md:p-4 flex items-start md:items-center justify-center transition-all duration-700 ease-in-out ${
                isActive
                  ? "opacity-100 z-10 pointer-events-auto"
                  : `opacity-0 -z-10 pointer-events-none scale-95 ${transformClass}`
              }`}
            >
              <div className="w-full h-full flex flex-col max-w-5xl mx-auto">
                <div className="w-full px-4 md:px-12 text-center mb-2 md:mb-4 mt-1 md:mt-2 flex-shrink-0">
                  <p className="text-text-primary text-sm md:text-base leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-2 duration-700">
                    {step.description}
                  </p>
                </div>
                <div className="w-full flex-1 min-h-0 overflow-y-auto hide-scrollbar rounded-[2rem] border border-border/40 bg-surface/50 backdrop-blur-sm p-3 md:p-4 flex flex-col items-center justify-start shadow-xl shadow-black/5 ring-1 ring-black/5">
                  {step.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </BaseModal>
  );
};

export default WelcomeTourModal;
