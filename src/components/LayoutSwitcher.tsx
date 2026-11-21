export type InstrumentLayout = "Keypad" | "Fretboard";

export default function LayoutSwitcher({
  layout,
  onChange,
}: {
  layout: InstrumentLayout;
  onChange: (layout: InstrumentLayout) => void;
}) {
  return (
    <div className="layout-switcher" role="group" aria-label="Instrument layout">
      {(["Keypad", "Fretboard"] as const).map((option) => (
        <button
          type="button"
          key={option}
          className={`layout-option${layout === option ? " is-active" : ""}`}
          aria-pressed={layout === option}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
