import * as Tone from "tone";

export const CHROMATIC_PITCH_CLASSES = [
  { sharp: "C", flat: "C" },
  { sharp: "C♯", flat: "D♭" },
  { sharp: "D", flat: "D" },
  { sharp: "D♯", flat: "E♭" },
  { sharp: "E", flat: "E" },
  { sharp: "F", flat: "F" },
  { sharp: "F♯", flat: "G♭" },
  { sharp: "G", flat: "G" },
  { sharp: "G♯", flat: "A♭" },
  { sharp: "A", flat: "A" },
  { sharp: "A♯", flat: "B♭" },
  { sharp: "B", flat: "B" },
] as const;

export const CHROMATIC_KEYS = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

export type ChromaticKey = (typeof CHROMATIC_KEYS)[number];
export type ScaleMode = "Major" | "Minor" | "Chromatic";

export const SCALE_MODES: ScaleMode[] = ["Major", "Minor", "Chromatic"];

const SCALE_INTERVALS: Record<ScaleMode, readonly number[]> = {
  Major: [0, 2, 4, 5, 7, 9, 11],
  Minor: [0, 2, 3, 5, 7, 8, 10],
  Chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

const NORMALIZED_KEY: Record<ChromaticKey, number> = {
  C: 0,
  "C#": 1,
  D: 2,
  "D#": 3,
  E: 4,
  F: 5,
  "F#": 6,
  G: 7,
  "G#": 8,
  A: 9,
  "A#": 10,
  B: 11,
};

export function getScalePitchClasses(key: ChromaticKey, scale: ScaleMode): Set<number> {
  if (scale === "Chromatic") {
    return new Set(Array.from({ length: 12 }, (_, index) => index));
  }

  const root = NORMALIZED_KEY[key];
  return new Set(
    SCALE_INTERVALS[scale].map((interval) => (root + interval) % 12),
  );
}

export function getPitchClass(openPitchClass: number, fret: number): number {
  return (openPitchClass + fret) % 12;
}

export type SoundStyle = "finger" | "pick";

export type BassKeypadNote = {
  id: string;
  solfege: string;
  degree: number;
  interval: number;
  chromatic: boolean;
  fret: number;
  stringRow: number;
};

const PITCH_NAMES = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
] as const;

export const BASS_KEYPAD_NOTES: readonly BassKeypadNote[] = [
  { id: "ti", solfege: "Ti", degree: 7, interval: -1, chromatic: true, fret: -1, stringRow: 2 },
  { id: "do", solfege: "Do", degree: 1, interval: 0, chromatic: false, fret: 0, stringRow: 2 },
  { id: "di", solfege: "Di", degree: 1, interval: 1, chromatic: true, fret: 1, stringRow: 2 },
  { id: "re", solfege: "Re", degree: 2, interval: 2, chromatic: false, fret: 2, stringRow: 2 },
  { id: "mi", solfege: "Mi", degree: 3, interval: 4, chromatic: false, fret: 4, stringRow: 2 },
  { id: "fa", solfege: "Fa", degree: 4, interval: 5, chromatic: false, fret: 5, stringRow: 1 },
  { id: "fi", solfege: "Fi", degree: 4, interval: 6, chromatic: true, fret: 6, stringRow: 1 },
  { id: "sol", solfege: "Sol", degree: 5, interval: 7, chromatic: false, fret: 7, stringRow: 1 },
  { id: "la", solfege: "La", degree: 6, interval: 9, chromatic: false, fret: 9, stringRow: 0 },
  { id: "li", solfege: "Li", degree: 6, interval: 10, chromatic: true, fret: 10, stringRow: 0 },
  { id: "ti-upper", solfege: "Ti", degree: 7, interval: 11, chromatic: false, fret: 11, stringRow: 0 },
  { id: "do-upper", solfege: "Upper Do", degree: 8, interval: 12, chromatic: false, fret: 12, stringRow: 0 },
] as const;

export function getRootPitchClass(key: ChromaticKey): number {
  return NORMALIZED_KEY[key];
}

export function getNotePitchName(key: ChromaticKey, note: BassKeypadNote): string {
  const pitchClass = (getRootPitchClass(key) + note.interval + 12) % 12;
  return PITCH_NAMES[pitchClass];
}

export type BassPlaybackSample = {
  pitchName: string;
  playbackSemitones: number;
};

export function getBassPlaybackSample(
  key: ChromaticKey,
  note: BassKeypadNote,
  _style: SoundStyle,
): BassPlaybackSample {
  const cMidi = Tone.Frequency("C2").toMidi();
  const rootMidi = Tone.Frequency(`${PITCH_NAMES[getRootPitchClass(key)]}2`).toMidi();
  const targetMidi = Tone.Frequency("C2")
    .transpose(rootMidi - cMidi + note.interval)
    .toMidi();

  return {
    pitchName: "C",
    playbackSemitones: targetMidi - cMidi,
  };
}
