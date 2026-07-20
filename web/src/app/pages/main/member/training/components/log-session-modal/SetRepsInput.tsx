import { useEffect, useRef, useState } from "react";

interface SetRepsInputProps {
  value: number;
  onChange: (value: number) => void;
  onCommit: (value: number) => void;
  className?: string;
  placeholder?: string;
}

const INTEGER_INPUT = /^\d*$/;
const COMMIT_DEBOUNCE_MS = 600;

export const SetRepsInput = ({
  value,
  onChange,
  onCommit,
  className,
  placeholder = "0",
}: SetRepsInputProps) => {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCommittedRef = useRef<number | null>(null);

  const parseDraft = (raw: string) => parseInt(raw, 10) || 0;

  const commitValue = (parsed: number) => {
    if (lastCommittedRef.current === parsed) return;
    lastCommittedRef.current = parsed;
    onCommit(parsed);
  };

  const scheduleCommit = (raw: string) => {
    const parsed = raw.trim() === "" ? 0 : parseDraft(raw);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      commitValue(parsed);
      debounceRef.current = null;
    }, COMMIT_DEBOUNCE_MS);
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
      inputMode="numeric"
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
        if (raw !== "" && !INTEGER_INPUT.test(raw)) return;

        setDraft(raw);
        if (raw === "") {
          onChange(0);
          scheduleCommit(raw);
          return;
        }

        const parsed = parseInt(raw, 10);
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
