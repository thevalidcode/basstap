import { useState } from "react";
import {
  CHROMATIC_PITCH_CLASSES,
  getPitchClass,
  type ChromaticKey,
  type ScaleMode,
  getScalePitchClasses,
} from "../music";

const STRINGS = [
  { name: "G", openPitchClass: 7 },
  { name: "D", openPitchClass: 2 },
  { name: "A", openPitchClass: 9 },
  { name: "E", openPitchClass: 4 },
] as const;

const FRET_COUNT = 12;

export default function Fretboard({
  selectedKey,
  scale,
}: {
  selectedKey: ChromaticKey;
  scale: ScaleMode;
}) {
  const [activePositions, setActivePositions] = useState<Set<string>>(new Set());
  const scalePitchClasses = getScalePitchClasses(selectedKey, scale);

  const setPositionActive = (position: string, active: boolean) => {
    setActivePositions((current) => {
      const next = new Set(current);
      if (active) {
        next.add(position);
      } else {
        next.delete(position);
      }
      return next;
    });
  };

  return (
    <div className="fretboard" role="group" aria-label="Four string bass fretboard">
      <div className="fretboard-grid" aria-hidden="true">
        <div className="open-label">Open</div>
        {Array.from({ length: FRET_COUNT }, (_, index) => (
          <div className="fret-number" key={index}>
            {index + 1}
          </div>
        ))}
      </div>

      {STRINGS.map((string) => (
        <div className="fretboard-row" key={string.name}>
          <span className="string-label" aria-hidden="true">{string.name}</span>
          <div className="string-positions">
            {Array.from({ length: FRET_COUNT + 1 }, (_, fret) => {
              const pitchClass = getPitchClass(string.openPitchClass, fret);
              const pitch = CHROMATIC_PITCH_CLASSES[pitchClass];
              const position = `${string.name}-${fret}`;
              const isScaleNote = scalePitchClasses.has(pitchClass);
              const isActive = activePositions.has(position);

              return (
                <button
                  type="button"
                  className={[
                    "fret-position",
                    fret === 0 ? "is-open" : "",
                    isScaleNote ? "is-scale" : "is-outside",
                    isActive ? "is-active" : "",
                  ].filter(Boolean).join(" ")}
                  key={position}
                  aria-label={`${string.name} string, ${fret === 0 ? "open" : `fret ${fret}`}, ${pitch.sharp} or ${pitch.flat}`}
                  aria-pressed={isActive}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    setPositionActive(position, true);
                  }}
                  onPointerUp={() => setPositionActive(position, false)}
                  onPointerCancel={() => setPositionActive(position, false)}
                  onPointerLeave={(event) => {
                    if (event.buttons === 0) {
                      setPositionActive(position, false);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setPositionActive(position, true);
                    }
                  }}
                  onKeyUp={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setPositionActive(position, false);
                    }
                  }}
                  onContextMenu={(event) => event.preventDefault()}
                  onBlur={() => setPositionActive(position, false)}
                >
                  <span className="note-name">
                    <span>{pitch.sharp}</span>
                    {pitch.sharp !== pitch.flat && <span className="flat-name">{pitch.flat}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
