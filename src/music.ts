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
