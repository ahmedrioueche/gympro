import { Check } from "lucide-react";
import { BaseView } from "./BaseView";

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
    <div className="grid grid-cols-1 gap-4">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group transform hover:-translate-y-1 hover:shadow-xl ${
            selectedValue === option.value
              ? "border-primary/50 bg-primary/10 text-primary shadow-lg shadow-primary/10"
              : "border-border/50 bg-surface/50 text-text-secondary hover:border-primary/30 hover:text-text-primary"
          }`}
        >
          <span className="font-bold text-lg relative z-10">
            {option.label}
          </span>
          <div
            className={`relative z-10 transition-transform duration-300 ${selectedValue === option.value ? "scale-100 opacity-100" : "scale-50 opacity-0 group-hover:scale-75 group-hover:opacity-50"}`}
          >
            <Check className="w-6 h-6" strokeWidth={3} />
          </div>
          {selectedValue === option.value && (
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent object-cover" />
          )}
        </button>
      ))}
    </div>
  </BaseView>
);
