import type { SoundStyle } from "../music";

type ActiveNote = {
  source: AudioBufferSourceNode;
  gain: GainNode;
  holdTimer: number | null;
};

export class BassAudioEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private readonly buffers = new Map<string, AudioBuffer>();
  private readonly active = new Map<string, ActiveNote>();
  private readonly requests = new Map<string, number>();
  private nextRequest = 0;

  private getContext(): AudioContext {
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = 0.9;
      this.master.connect(this.context.destination);
    }
    return this.context;
  }

  private async load(style: SoundStyle, pitchName: string): Promise<AudioBuffer> {
    const key = `${style}:${pitchName}`;
    const cached = this.buffers.get(key);
    if (cached) return cached;

    const response = await fetch(`/${style}/${encodeURIComponent(pitchName)}.wav`);
    if (!response.ok) throw new Error(`Unable to load ${style} sample ${pitchName}`);
    const data = await response.arrayBuffer();
    const buffer = await this.getContext().decodeAudioData(data);
    this.buffers.set(key, buffer);
    return buffer;
  }

  async preload(style: SoundStyle, pitchNames: readonly string[]): Promise<void> {
    await Promise.all(pitchNames.map((pitchName) => this.load(style, pitchName)));
  }

  async play(
    noteId: string,
    style: SoundStyle,
    pitchName: string,
    playbackSemitones = 0,
  ): Promise<void> {
    this.stop(noteId);
    const request = ++this.nextRequest;
    this.requests.set(noteId, request);
    const context = this.getContext();
    await context.resume();
    const buffer = await this.load(style, pitchName);
    if (this.requests.get(noteId) !== request) return;
    if (this.active.has(noteId)) return;

    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    source.detune.value = playbackSemitones * 100;
    source.loop = false;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.9, context.currentTime + 0.012);
    source.connect(gain);
    gain.connect(this.master!);
    source.start();

    const holdTimer = window.setTimeout(() => {
      const active = this.active.get(noteId);
      if (!active) return;
      active.source.loop = true;
      if (buffer.duration > 0.3) {
        active.source.loopStart = buffer.duration * 0.12;
        active.source.loopEnd = buffer.duration * 0.88;
      }
    }, 180);

    this.active.set(noteId, { source, gain, holdTimer });
  }

  stop(noteId: string, quick = true): void {
    this.requests.delete(noteId);
    const active = this.active.get(noteId);
    if (!active || !this.context) return;
    this.active.delete(noteId);
    if (active.holdTimer !== null) window.clearTimeout(active.holdTimer);

    const now = this.context.currentTime;
    active.source.loop = false;
    active.gain.gain.cancelScheduledValues(now);
    active.gain.gain.setValueAtTime(Math.max(active.gain.gain.value, 0.0001), now);
    active.gain.gain.exponentialRampToValueAtTime(0.0001, now + (quick ? 0.08 : 0.18));
    active.source.stop(now + (quick ? 0.09 : 0.19));
  }

  stopAll(): void {
    for (const noteId of Array.from(this.requests.keys())) this.stop(noteId);
    for (const noteId of Array.from(this.active.keys())) this.stop(noteId);
  }

  dispose(): void {
    this.stopAll();
    void this.context?.close();
    this.context = null;
    this.master = null;
    this.buffers.clear();
  }
}
