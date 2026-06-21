import { useEffect, useRef, useState } from "react";

interface SetWeightInputProps {
  value: number;
  onChange: (value: number) => void;
  onCommit: (value: number) => void;
  className?: string;
  placeholder?: string;
}

const DECIMAL_INPUT = /^\d*[.,]?\d*$/;
const PROPAGATE_DEBOUNCE_MS = 600;

const isDraftComplete = (raw: string) => {
  const trimmed = raw.trim();
  if (!trimmed) return true;
  return !trimmed.endsWith(".") && !trimmed.endsWith(",");
};

export const SetWeightInput = ({
  value,
  onChange,
  onCommit,
  className,
  placeholder = "0",
}: SetWeightInputProps) => {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCommittedRef = useRef<number | null>(null);

  const parseDraft = (raw: string) => parseFloat(raw.replace(",", ".")) || 0;

  const commitValue = (parsed: number) => {
    if (lastCommittedRef.current === parsed) return;
    lastCommittedRef.current = parsed;
    onCommit(parsed);
  };

  const scheduleCommit = (raw: string) => {
    if (!isDraftComplete(raw)) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      return;
    }

    const parsed = raw.trim() === "" ? 0 : parseDraft(raw);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      commitValue(parsed);
      debounceRef.current = null;
    }, PROPAGATE_DEBOUNCE_MS);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const displayValue = focused
    ? draft
    : value || value === 0
      ? String(value)
      : "";

  return (
    <input
      type="text"
      inputMode="decimal"
      value={displayValue}
      onFocus={() => {
        setFocused(true);
        setDraft(value || value === 0 ? String(value) : "");
        lastCommittedRef.current = value || 0;
      }}
      onBlur={() => {
        setFocused(false);
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
          debounceRef.current = null;
        }
        commitValue(parseDraft(draft));
      }}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw !== "" && !DECIMAL_INPUT.test(raw)) return;

        setDraft(raw);
        if (raw === "" || raw === "." || raw === ",") {
          onChange(0);
          scheduleCommit(raw);
          return;
        }

        const parsed = parseFloat(raw.replace(",", "."));
        if (!isNaN(parsed)) {
          onChange(parsed);
          scheduleCommit(raw);
        }
      }}
      className={className}
      placeholder={placeholder}
    />
  );
};
