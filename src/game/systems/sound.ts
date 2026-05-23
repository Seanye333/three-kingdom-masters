/**
 * Tiny synthesized sound effects via Web Audio API. No external audio files —
 * just oscillator-based stings for atmosphere.
 *
 * Call `playSfx(name)` from UI events; it's a no-op if disabled or unsupported.
 */

let ctx: AudioContext | null = null;
let enabled = true;
let unlockAttempted = false;
let ambienceNode: { oscillators: OscillatorNode[]; gain: GainNode } | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (ctx) return ctx;
  try {
    const Ctor = (window.AudioContext ?? (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
    if (!Ctor) return null;
    ctx = new Ctor();
    return ctx;
  } catch {
    return null;
  }
}

/**
 * Browsers require user interaction before audio can play. Call this from
 * any click handler to unlock the context.
 */
export function unlockAudio(): void {
  if (unlockAttempted) return;
  unlockAttempted = true;
  const c = getCtx();
  if (!c) return;
  if (c.state === 'suspended') {
    c.resume().catch(() => undefined);
  }
}

export function setSoundEnabled(on: boolean): void {
  enabled = on;
  if (!on && ambienceNode) {
    stopAmbience();
  }
}

export type SfxName =
  | 'click'         // UI click
  | 'open-modal'    // panel pops up
  | 'sword'         // attack
  | 'horn'          // end-of-turn / season
  | 'gong'          // historical event
  | 'arrow'         // ranged attack
  | 'fire'          // fire stratagem
  | 'coin'          // gold transaction
  | 'defeat'        // bad news
  | 'victory'       // good news
  | 'march'         // march issued
  | 'bell'          // recruit success / officer joins
  | 'dirge'         // officer death
  | 'crash'         // stratagem succeeds / city falls
  | 'whoosh'        // modal close
  | 'pluck'         // hover / subtle tick
  | 'quake';        // critical event

interface Tone {
  freq: number;
  duration: number;
  type?: OscillatorType;
  attack?: number;
  decay?: number;
  gain?: number;
  detune?: number;
  /** Cents/sec frequency sweep. */
  sweep?: number;
}

const SFX_PATTERNS: Record<SfxName, Tone[]> = {
  click: [{ freq: 700, duration: 0.04, type: 'square', gain: 0.06 }],
  'open-modal': [
    { freq: 440, duration: 0.07, type: 'sine', gain: 0.1 },
    { freq: 660, duration: 0.07, type: 'sine', gain: 0.1 },
  ],
  sword: [
    { freq: 220, duration: 0.08, type: 'sawtooth', gain: 0.16, sweep: -800 },
    { freq: 110, duration: 0.1, type: 'sawtooth', gain: 0.12 },
  ],
  horn: [
    { freq: 196, duration: 0.5, type: 'square', gain: 0.12 },
    { freq: 261, duration: 0.6, type: 'square', gain: 0.12 },
  ],
  gong: [
    { freq: 110, duration: 1.2, type: 'sine', gain: 0.22, sweep: -40 },
    { freq: 165, duration: 1.2, type: 'sine', gain: 0.18 },
  ],
  arrow: [{ freq: 1500, duration: 0.12, type: 'sawtooth', gain: 0.08, sweep: -3000 }],
  fire: [
    { freq: 80, duration: 0.5, type: 'sawtooth', gain: 0.1 },
    { freq: 60, duration: 0.5, type: 'sawtooth', gain: 0.1 },
  ],
  coin: [
    { freq: 1200, duration: 0.05, type: 'triangle', gain: 0.1 },
    { freq: 1600, duration: 0.05, type: 'triangle', gain: 0.1 },
  ],
  defeat: [
    { freq: 300, duration: 0.3, type: 'sawtooth', gain: 0.18, sweep: -200 },
    { freq: 150, duration: 0.5, type: 'sawtooth', gain: 0.18, sweep: -100 },
  ],
  victory: [
    { freq: 523, duration: 0.15, type: 'triangle', gain: 0.18 },
    { freq: 659, duration: 0.15, type: 'triangle', gain: 0.18 },
    { freq: 784, duration: 0.25, type: 'triangle', gain: 0.18 },
  ],
  march: [
    { freq: 110, duration: 0.12, type: 'square', gain: 0.14 },
    { freq: 165, duration: 0.12, type: 'square', gain: 0.14 },
    { freq: 220, duration: 0.2, type: 'square', gain: 0.14 },
  ],
  bell: [
    { freq: 880, duration: 0.6, type: 'sine', gain: 0.18, sweep: -300 },
    { freq: 660, duration: 0.4, type: 'sine', gain: 0.12 },
  ],
  dirge: [
    { freq: 196, duration: 0.5, type: 'sine', gain: 0.12 },
    { freq: 165, duration: 0.5, type: 'sine', gain: 0.12 },
    { freq: 130, duration: 0.8, type: 'sine', gain: 0.14 },
  ],
  crash: [
    { freq: 200, duration: 0.08, type: 'sawtooth', gain: 0.2, sweep: -2000 },
    { freq: 80, duration: 0.25, type: 'square', gain: 0.16 },
  ],
  whoosh: [
    { freq: 600, duration: 0.15, type: 'sine', gain: 0.08, sweep: -1200 },
  ],
  pluck: [
    { freq: 1100, duration: 0.03, type: 'triangle', gain: 0.05 },
  ],
  quake: [
    { freq: 50, duration: 0.6, type: 'sawtooth', gain: 0.22 },
    { freq: 70, duration: 0.4, type: 'sawtooth', gain: 0.18 },
  ],
};

export function playSfx(name: SfxName): void {
  if (!enabled) return;
  const c = getCtx();
  if (!c) return;
  unlockAudio();
  const pattern = SFX_PATTERNS[name];
  if (!pattern) return;
  let t = c.currentTime;
  for (const tone of pattern) {
    playTone(c, tone, t);
    t += tone.duration;
  }
}

function playTone(c: AudioContext, t: Tone, when: number): void {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = t.type ?? 'sine';
  osc.frequency.setValueAtTime(t.freq, when);
  if (t.sweep) {
    osc.frequency.linearRampToValueAtTime(
      Math.max(20, t.freq + t.sweep * t.duration),
      when + t.duration,
    );
  }
  if (t.detune) osc.detune.setValueAtTime(t.detune, when);
  const peak = t.gain ?? 0.1;
  const attack = t.attack ?? 0.005;
  const decay = t.decay ?? 0.02;
  gain.gain.setValueAtTime(0, when);
  gain.gain.linearRampToValueAtTime(peak, when + attack);
  gain.gain.linearRampToValueAtTime(0, when + t.duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(when);
  osc.stop(when + t.duration + decay);
}

/**
 * Layered drone ambience — three slow detuned oscillators evoking distant
 * windborne flutes. Loops until stopAmbience() is called.
 */
export function startAmbience(): void {
  if (!enabled) return;
  if (ambienceNode) return;
  const c = getCtx();
  if (!c) return;
  unlockAudio();

  const gain = c.createGain();
  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(0.04, c.currentTime + 4);
  gain.connect(c.destination);

  // Bordun: A2, E3, A3 — slightly detuned for a shimmer.
  const freqs = [110, 165, 220];
  const oscs: OscillatorNode[] = [];
  for (const f of freqs) {
    const osc = c.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = f;
    osc.detune.value = (Math.random() - 0.5) * 12;
    osc.connect(gain);
    osc.start();
    oscs.push(osc);
  }
  ambienceNode = { oscillators: oscs, gain };
}

export function stopAmbience(): void {
  if (!ambienceNode) return;
  const c = getCtx();
  if (!c) {
    ambienceNode = null;
    return;
  }
  ambienceNode.gain.gain.cancelScheduledValues(c.currentTime);
  ambienceNode.gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.5);
  setTimeout(() => {
    if (!ambienceNode) return;
    for (const o of ambienceNode.oscillators) {
      try {
        o.stop();
      } catch {
        // ignore
      }
    }
    ambienceNode = null;
  }, 600);
}

// ─── Music tracks ────────────────────────────────────────────────────

let musicTimer: ReturnType<typeof setInterval> | null = null;
let musicGainNode: GainNode | null = null;

export type MusicTrack = 'peace' | 'tension' | 'battle' | 'victory' | 'defeat' | null;

/**
 * Simple pentatonic melodies — looping note sequences that play through a
 * shared oscillator. Each track maps to a stylized mood.
 */
const TRACK_MELODIES: Record<Exclude<MusicTrack, null>, { notes: number[]; tempo: number; gain: number; type: OscillatorType }> = {
  peace: {
    notes: [220, 247, 294, 330, 392, 330, 294, 247],
    tempo: 700,
    gain: 0.05,
    type: 'sine',
  },
  tension: {
    notes: [196, 233, 277, 233, 196, 165, 196, 165],
    tempo: 480,
    gain: 0.06,
    type: 'triangle',
  },
  battle: {
    notes: [110, 165, 196, 247, 196, 165, 220, 165],
    tempo: 280,
    gain: 0.07,
    type: 'sawtooth',
  },
  victory: {
    notes: [330, 392, 440, 494, 587, 494, 440, 587],
    tempo: 380,
    gain: 0.08,
    type: 'triangle',
  },
  defeat: {
    notes: [220, 196, 174, 155, 138, 130, 138, 155],
    tempo: 900,
    gain: 0.06,
    type: 'sine',
  },
};

export function playMusic(track: MusicTrack): void {
  stopMusic();
  if (!track || !enabled) return;
  const c = getCtx();
  if (!c) return;
  unlockAudio();
  const def = TRACK_MELODIES[track];
  if (!def) return;
  // Master gain for music — separate from SFX.
  musicGainNode = c.createGain();
  musicGainNode.gain.setValueAtTime(0, c.currentTime);
  musicGainNode.gain.linearRampToValueAtTime(def.gain, c.currentTime + 2);
  musicGainNode.connect(c.destination);

  let i = 0;
  musicTimer = setInterval(() => {
    if (!enabled || !c || !musicGainNode) {
      stopMusic();
      return;
    }
    const freq = def.notes[i % def.notes.length];
    const osc = c.createOscillator();
    osc.type = def.type;
    osc.frequency.value = freq;
    const noteGain = c.createGain();
    noteGain.gain.setValueAtTime(0, c.currentTime);
    noteGain.gain.linearRampToValueAtTime(1, c.currentTime + 0.05);
    noteGain.gain.linearRampToValueAtTime(0, c.currentTime + def.tempo / 1000);
    osc.connect(noteGain);
    noteGain.connect(musicGainNode);
    osc.start();
    osc.stop(c.currentTime + def.tempo / 1000 + 0.05);
    i++;
  }, def.tempo);
}

export function stopMusic(): void {
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
  const c = getCtx();
  if (c && musicGainNode) {
    musicGainNode.gain.cancelScheduledValues(c.currentTime);
    musicGainNode.gain.linearRampToValueAtTime(0, c.currentTime + 0.5);
    const old = musicGainNode;
    setTimeout(() => {
      try { old.disconnect(); } catch { /* ignore */ }
    }, 600);
    musicGainNode = null;
  }
}
