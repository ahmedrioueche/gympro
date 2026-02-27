import { ChevronRight } from "lucide-react";
import { BaseView } from "./BaseView";

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
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="relative w-full p-5 text-text-primary font-medium rounded-2xl bg-surface/80 border border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none text-lg transition-all duration-300 placeholder:text-text-secondary/50"
          onKeyDown={(e) => e.key === "Enter" && value && onNext()}
          autoFocus
        />
      </div>
      <button
        onClick={onNext}
        disabled={!value}
        className="relative overflow-hidden w-full p-5 rounded-2xl bg-gradient-to-r from-primary to-primary-focus text-white font-bold transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 focus:ring-2 focus:ring-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:-translate-y-0 group flex items-center justify-center gap-2"
      >
        <span className="relative z-10 flex items-center gap-2">
          {buttonLabel}
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </span>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
      </button>
    </div>
  </BaseView>
);
