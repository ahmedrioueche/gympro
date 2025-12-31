import { useEffect, useRef, useState } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  debounceMs = 500,
  className = "",
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<number | undefined>(undefined);

  // Sync local value with prop when it changes externally
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Handle clearing search
  const handleClear = () => {
    onChange("");
    setLocalValue("");
  };

  // Debounced search handler
  const handleInput = (newValue: string) => {
    setLocalValue(newValue);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounced update
    debounceTimerRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => handleInput(e.target.value)}
        className="w-full px-4 py-2.5 pl-11 pr-10 focus:ring-1 focus:ring-primary bg-background border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-border focus:ring-0 transition-all"
      />
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">
        🔍
      </span>
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-danger w-6 h-6 flex items-center justify-center rounded-full hover:bg-danger/10 transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );
}
