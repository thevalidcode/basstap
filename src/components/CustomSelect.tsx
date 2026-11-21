import { useEffect, useRef, useState } from "react";

type CustomSelectProps<T extends string> = {
  id: string;
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  formatOption?: (option: T) => string;
};

export default function CustomSelect<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
  formatOption = (option) => option,
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(Math.max(0, options.indexOf(value)));
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    setActiveIndex(Math.max(0, options.indexOf(value)));
  }, [options, value]);

  useEffect(() => {
    if (isOpen) {
      menuRef.current?.focus();
    }
  }, [isOpen]);

  const selectOption = (option: T) => {
    onChange(option);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) =>
        event.key === "ArrowDown"
          ? (index + 1) % options.length
          : (index - 1 + options.length) % options.length,
      );
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen((open) => !open);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleListKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) =>
        event.key === "ArrowDown"
          ? (index + 1) % options.length
          : (index - 1 + options.length) % options.length,
      );
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectOption(options[activeIndex]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (event.key === "Tab") {
      setIsOpen(false);
    }
  };

  return (
    <div className="key-control">
      <span id={`${id}-label`} className="key-selector-label">{label}</span>
      <div className="select-wrap" ref={rootRef}>
        <button
          ref={triggerRef}
          className="select-trigger"
          type="button"
          role="combobox"
          aria-controls={`${id}-list`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={`${id}-label ${id}-value`}
          onClick={() => setIsOpen((open) => !open)}
          onKeyDown={handleTriggerKeyDown}
        >
          <span id={`${id}-value`}>{formatOption(value)}</span>
          <svg
            className={`select-chevron${isOpen ? " is-open" : ""}`}
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            aria-hidden="true"
          >
            <path d="M1.5 1.5L6 6l4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {isOpen && (
          <div
            id={`${id}-list`}
            ref={menuRef}
            className="select-menu"
            role="listbox"
            aria-label={label}
            tabIndex={-1}
            onKeyDown={handleListKeyDown}
          >
            {options.map((option, index) => (
              <button
                className={`select-option${option === value ? " is-selected" : ""}${index === activeIndex ? " is-active" : ""}`}
                type="button"
                role="option"
                aria-selected={option === value}
                key={option}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(option)}
              >
                <span>{formatOption(option)}</span>
                {option === value && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3.25 8.25l3 3 6.5-6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
