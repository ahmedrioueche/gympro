import { BaseView } from "./BaseView";

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
        className="p-5 rounded-2xl border border-border/50 bg-surface/50 hover:bg-surface hover:border-primary/30 transition-all duration-300 font-bold text-text-secondary hover:text-text-primary hover:-translate-y-1 hover:shadow-lg focus:ring-2 focus:ring-primary/20 outline-none"
      >
        {noLabel}
      </button>
      <button
        onClick={onYes}
        className="relative overflow-hidden p-5 rounded-2xl bg-primary text-white font-bold transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 focus:ring-2 focus:ring-primary outline-none group"
      >
        <span className="relative z-10">{yesLabel}</span>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
      </button>
    </div>
  </BaseView>
);
