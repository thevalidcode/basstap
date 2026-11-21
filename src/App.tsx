import { useState } from "react";
import CustomSelect from "./components/CustomSelect";
import {
  CHROMATIC_KEYS,
  type ChromaticKey,
} from "./music";

const SCALE_DEGREES = [
  { degree: 1, solfege: "DO" },
  { degree: 2, solfege: "RE" },
  { degree: 3, solfege: "MI" },
  { degree: 4, solfege: "FA" },
  { degree: 5, solfege: "SOL" },
  { degree: 6, solfege: "LA" },
  { degree: 7, solfege: "TI" },
  { degree: 8, solfege: "DO" },
] as const;

function BassMark() {
  return (
    <span className="bass-mark" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

export default function App() {
  const [selectedKey, setSelectedKey] = useState<ChromaticKey>("C");

  return (
    <div className="app-shell">
      <header className="header">
        <div className="header-inner">
          <a className="wordmark" href="/" aria-label="BassTap home">
            <BassMark />
            <span>BassTap</span>
          </a>
        </div>
      </header>

      <main className="main-content">
        <section className="instrument" aria-label="Bass instrument">
          <div className="instrument-controls">
            <div className="control-selectors">
              <CustomSelect
                id="musical-key"
                label="Key"
                value={selectedKey}
                options={CHROMATIC_KEYS}
                onChange={setSelectedKey}
                formatOption={(key) => key}
              />
            </div>
          </div>
          <div className="keypad" role="group" aria-label={`${selectedKey} Major scale degrees`}>
            {SCALE_DEGREES.map(({ degree, solfege }) => (
              <button
                className="pad-button"
                type="button"
                key={degree}
                aria-label={`Scale degree ${degree}, ${solfege}`}
              >
                <span className="degree">{degree}</span>
                <span className="solfege">{solfege}</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          Made by{" "}
          <a href="https://thevalidcode.is-a.dev" target="_blank" rel="noreferrer">
            Valid
          </a>
        </p>
      </footer>
    </div>
  );
}
