import { useEffect, useRef, useState } from "react";

interface CustomSelectProps<T> {
  title?: string;
  options: {
    value: T;
    label: string;
    flag?: string;
    name?: string;
  }[];
  selectedOption: T;
  label?: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
  bgColor?: string;
  error?: string;
  marginTop?: string;
  placeholder?: string;
}

const CustomSelect = <T extends string>({
  title,
  options,
  selectedOption,
  label,
  onChange,
  disabled,
  className,
  bgColor,
  error,
  marginTop = "mt-2",
  placeholder,
  searchable = false,
}: CustomSelectProps<T> & { searchable?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectRef]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    } else if (searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || disabled) return;

      const focusedElement = document.activeElement;
      // If search input is focused, don't interfere with typing unless it's navigation
      const isSearchFocused = focusedElement === searchInputRef.current;

      const items = Array.from(selectRef.current?.querySelectorAll("li") || []);

      if (event.key === "Escape") {
        setIsOpen(false);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        const currentIndex = items.indexOf(focusedElement as HTMLLIElement);
        if (isSearchFocused && items.length > 0) {
          items[0].focus();
        } else {
          const nextIndex = (currentIndex + 1) % items.length;
          items[nextIndex]?.focus();
        }
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        const currentIndex = items.indexOf(focusedElement as HTMLLIElement);
        if (currentIndex <= 0 && isSearchFocused) {
          // Already at top or search focused, do nothing or loop to bottom
          const prevIndex = items.length - 1;
          items[prevIndex]?.focus();
        } else if (currentIndex === 0 && searchable) {
          searchInputRef.current?.focus();
        } else {
          const prevIndex = (currentIndex - 1 + items.length) % items.length;
          items[prevIndex]?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, disabled, searchable]);

  const handleListScroll = () => {
    if (listRef.current) {
      scrollPositionRef.current = listRef.current.scrollTop;
    }
  };

  useEffect(() => {
    if (isOpen && listRef.current) {
      listRef.current.scrollTop = scrollPositionRef.current;
    }
  }, [isOpen]);

  const selectedOptionData = options.find((o) => o.value === selectedOption);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={selectRef}>
      {title && (
        <label className="font-normal text-sm text-text-primary">{title}</label>
      )}

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={title}
        aria-disabled={disabled}
        className={`
          ${marginTop}
          p-3 px-4 rounded-lg 
          border 
          bg-surface
          focus:border-2
          focus:border-primary
          text-text-primary
          
          ${disabled ? "" : "cursor-pointer  hover:bg-surface/60"}
          ${bgColor ?? ""}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${error ? "border-danger" : "border-border"}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            setIsOpen(!isOpen);
          }
        }}
      >
        <div className="flex items-center gap-2">
          {selectedOptionData?.flag && (
            <img
              src={selectedOptionData.flag}
              alt=""
              className="w-5 h-3.5 object-cover flex-shrink-0"
            />
          )}
          <span>
            {selectedOptionData?.label || label || selectedOption || (
              <span className="text-text-secondary">
                {placeholder || "Select..."}
              </span>
            )}
          </span>
        </div>
      </div>

      {isOpen && !disabled && (
        <ul
          ref={listRef}
          role="listbox"
          className={`
            absolute z-10 mt-1 w-full rounded-md shadow-lg 
            bg-background
            max-h-60 overflow-auto backdrop-blur-xl 
            border border-border
            ${className ?? ""}
          `}
          onScroll={handleListScroll}
        >
          {searchable && (
            <div className="sticky top-0 p-2 bg-background border-b border-border z-20">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-1.5 text-sm bg-surface rounded-md border border-border focus:outline-none focus:border-primary text-text-primary placeholder:text-text-tertiary"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()} // Stop propagation to prevent selecting parent
              />
            </div>
          )}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === selectedOption}
                tabIndex={0}
                className={`
                  px-4 py-2 
                  text-text-primary
                  hover:bg-primary/30
                  hover:cursor-pointer
                  focus:bg-primary/30
                  focus:outline-none
                `}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onChange(option.value);
                    setIsOpen(false);
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  {option.flag && (
                    <img
                      src={option.flag}
                      alt=""
                      className="w-5 h-3.5 object-cover flex-shrink-0"
                    />
                  )}
                  <span>{option.label}</span>
                  {option.name && (
                    <span className="text-xs text-text-secondary ml-auto">
                      {option.name}
                    </span>
                  )}
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-sm text-text-tertiary text-center">
              No results found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
