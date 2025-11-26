import { Check, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface BaseViewProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export const BaseView = ({ children, title, subtitle }: BaseViewProps) => (
  <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 text-center space-y-8 animate-fade-in-up">
    {(title || subtitle) && (
      <div className="space-y-2">
        {title && (
          <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
        )}
        {subtitle && <p className="text-text-secondary text-lg">{subtitle}</p>}
      </div>
    )}
    <div className="w-full space-y-6">{children}</div>
  </div>
);

interface QuestionViewProps {
  question: string;
  onYes: () => void;
  onNo: () => void;
  yesLabel?: string;
  noLabel?: string;
}

export const QuestionView = ({
  question,
  onYes,
  onNo,
  yesLabel = "Yes",
  noLabel = "No",
}: QuestionViewProps) => (
  <BaseView title={question}>
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={onNo}
        className="p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-surface transition-all duration-300 font-medium text-text-secondary hover:text-text-primary"
      >
        {noLabel}
      </button>
      <button
        onClick={onYes}
        className="p-4 rounded-xl bg-primary text-text-primary font-medium hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25"
      >
        {yesLabel}
      </button>
    </div>
  </BaseView>
);

interface InputViewProps {
  title: string;
  subtitle?: string;
  value: string | number;
  onChange: (val: string) => void;
  onNext: () => void;
  placeholder?: string;
  type?: "text" | "number";
  buttonLabel?: string;
}

export const InputView = ({
  title,
  subtitle,
  value,
  onChange,
  onNext,
  placeholder,
  type = "text",
  buttonLabel = "Next",
}: InputViewProps) => (
  <BaseView title={title} subtitle={subtitle}>
    <div className="space-y-6">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-4 text-text-primary rounded-xl bg-surface border-2 border-border focus:border-primary outline-none text-lg transition-all duration-300"
        onKeyDown={(e) => e.key === "Enter" && value && onNext()}
        autoFocus
      />
      <button
        onClick={onNext}
        disabled={!value}
        className="w-full p-4 rounded-xl bg-primary text-text-primary font-medium hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {buttonLabel}
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  </BaseView>
);

interface SelectionViewProps {
  title: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  selectedValue?: string;
}

export const SelectionView = ({
  title,
  options,
  onSelect,
  selectedValue,
}: SelectionViewProps) => (
  <BaseView title={title}>
    <div className="grid grid-cols-1 gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`p-4 rounded-xl border-2 transition-all text-text-secondary hover:text-text-primary duration-300 flex items-center justify-between group ${
            selectedValue === option.value
              ? "border-primary bg-primary/5 text-white"
              : "border-border hover:border-primary/50 hover:bg-surface"
          }`}
        >
          <span className="font-medium text-lg">{option.label}</span>
          {selectedValue === option.value && <Check className="w-5 h-5" />}
        </button>
      ))}
    </div>
  </BaseView>
);
