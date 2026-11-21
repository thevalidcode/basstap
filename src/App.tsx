import { useEffect, useRef, useState } from "react";
import CustomSelect from "./components/CustomSelect";
import {
  BASS_KEYPAD_NOTES,
  CHROMATIC_KEYS,
  type ChromaticKey,
  type SoundStyle,
  getBassPlaybackSample,
} from "./music";
import { BassAudioEngine } from "./audio/BassAudioEngine";

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
  const [soundStyle, setSoundStyle] = useState<SoundStyle>("finger");
  const [showChromatic, setShowChromatic] = useState(false);
  const [sustainEnabled, setSustainEnabled] = useState(true);
  const [pressedNotes, setPressedNotes] = useState<Set<string>>(new Set());
  const engineRef = useRef<BassAudioEngine | null>(null);
  const soundStyleRef = useRef(soundStyle);
  const selectedKeyRef = useRef(selectedKey);
  const sustainEnabledRef = useRef(sustainEnabled);

  if (!engineRef.current) engineRef.current = new BassAudioEngine();

  useEffect(() => {
    soundStyleRef.current = soundStyle;
  }, [soundStyle]);

  useEffect(() => {
    selectedKeyRef.current = selectedKey;
  }, [selectedKey]);

  useEffect(() => {
    sustainEnabledRef.current = sustainEnabled;
  }, [sustainEnabled]);

  useEffect(() => {
    const engine = engineRef.current!;
    engine.setNoteEndListener((noteId) => {
      setPressedNotes((current) => {
        if (!current.has(noteId)) return current;
        const next = new Set(current);
        next.delete(noteId);
        return next;
      });
    });
    return () => engine.setNoteEndListener(null);
  }, []);

  useEffect(() => {
    const engine = engineRef.current!;
    engine.stopAll();
    setPressedNotes(new Set());

    void engine.preload(soundStyle, ["C"]).catch((error) => {
      console.error(error);
    });
  }, [selectedKey, soundStyle]);

  useEffect(() => {
    const stopEverything = () => {
      engineRef.current?.stopAll();
      setPressedNotes(new Set());
    };
    window.addEventListener("blur", stopEverything);
    window.addEventListener("pointercancel", stopEverything);
    return () => {
      window.removeEventListener("blur", stopEverything);
      window.removeEventListener("pointercancel", stopEverything);
      engineRef.current?.dispose();
    };
  }, []);

  const visibleNotes = BASS_KEYPAD_NOTES.filter(
    (note) => !note.chromatic || showChromatic,
  );

  const startNote = (noteId: string) => {
    const note = BASS_KEYPAD_NOTES.find((item) => item.id === noteId);
    if (!note) return;
    setPressedNotes((current) => new Set(current).add(noteId));
    const sample = getBassPlaybackSample(
      selectedKeyRef.current,
      note,
      soundStyleRef.current,
    );
    void engineRef.current?.play(
      noteId,
      soundStyleRef.current,
      sample.pitchName,
      sample.playbackSemitones,
      sustainEnabledRef.current,
    ).catch((error) => {
      console.error(error);
    });
  };

  const stopNote = (noteId: string, allowNatural = false) => {
    engineRef.current?.stop(noteId, true, allowNatural);
    setPressedNotes((current) => {
      const next = new Set(current);
      next.delete(noteId);
      return next;
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>, noteId: string) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    startNote(noteId);
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLButtonElement>, noteId: string) => {
    if (!sustainEnabledRef.current) stopNote(noteId);
  };

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
              <CustomSelect
                id="sound-style"
                label="Sound"
                value={soundStyle}
                options={["finger", "pick"]}
                onChange={setSoundStyle}
                formatOption={(style) => style === "finger" ? "Fingerstyle" : "Pick"}
              />
            </div>
            <label className="chromatic-toggle">
              <span>Show Chromatic Notes</span>
              <input
                type="checkbox"
                checked={showChromatic}
                onChange={(event) => setShowChromatic(event.target.checked)}
              />
              <span className="toggle-track" aria-hidden="true">
                <span className="toggle-thumb" />
              </span>
            </label>
            <label className="chromatic-toggle">
              <span>Sustain</span>
              <input
                type="checkbox"
                checked={sustainEnabled}
                onChange={(event) => {
                  const enabled = event.target.checked;
                  setSustainEnabled(enabled);
                  sustainEnabledRef.current = enabled;
                  engineRef.current?.setSustain(enabled);
                }}
              />
              <span className="toggle-track" aria-hidden="true">
                <span className="toggle-thumb" />
              </span>
            </label>
          </div>
          <div className="scale-heading" aria-live="polite">
            <strong>{selectedKey} Major</strong>
            <span>{sustainEnabled ? "Sustain on — tap once to continue" : "Do through Upper Do"}</span>
          </div>
          <div className="keypad" role="group" aria-label={`${selectedKey} Major bass solfege keypad`}>
            {visibleNotes.map((note) => (
              <button
                className={`pad-button${pressedNotes.has(note.id) ? " is-pressed" : ""}`}
                type="button"
                key={note.id}
                aria-label={`${note.solfege}, scale degree ${note.degree}`}
                aria-pressed={pressedNotes.has(note.id)}
                onPointerDown={(event) => handlePointerDown(event, note.id)}
                onPointerUp={() => {
                  if (!sustainEnabledRef.current) stopNote(note.id);
                }}
                onPointerCancel={() => stopNote(note.id)}
                onPointerLeave={(event) => handlePointerLeave(event, note.id)}
                onLostPointerCapture={() => undefined}
                onKeyDown={(event) => {
                  if ((event.key === "Enter" || event.key === " ") && !event.repeat) {
                    event.preventDefault();
                    startNote(note.id);
                  }
                }}
                onKeyUp={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    stopNote(note.id, sustainEnabledRef.current);
                  }
                }}
                onBlur={() => stopNote(note.id)}
              >
                <span className="degree">{note.degree}</span>
                <span className="solfege">{note.solfege}</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          Made by{" "}
          <a href="https://thevalidcreative.com" target="_blank" rel="noreferrer">
            Valid
          </a>
        </p>
      </footer>
    </div>
  );
}
