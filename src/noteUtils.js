// HELPER FUNCTIONS FOR NOTES

const SEMI_MAP = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

// Turn notes like 'C#/4' or 'Eb/5' into { step, alter, octave }
export function parseNote(token) {
  const m = token.match(/^([A-G])([#b]?)[/](\d)$/);
  if (!m) return null;
  const [, step, acc, oct] = m;
  return {
    step,
    alter: acc === '#' ? 1 : acc === 'b' ? -1 : 0,
    octave: parseInt(oct, 10),
  };
}

// Turn { step, alter, octave } into MIDI numbers like C4 => 60
export function toMidi({ step, alter, octave }) {
  return (octave + 1) * 12 + SEMI_MAP[step] + alter;
}

// Turn MIDI numbers back into { step, alter, octave }
export function fromMidi(midi) {
  const octave = Math.floor(midi / 12) - 1;
  const pc = midi % 12;
  for (const [step, val] of Object.entries(SEMI_MAP)) {
    if (val === pc) return { step, alter: 0, octave };
  }
  for (const [step, val] of Object.entries(SEMI_MAP)) {
    if ((val + 1) % 12 === pc) {
      return { step, alter: 1, octave };
    }
  }
  return { step: 'C', alter: 0, octave };
}


// Turn { step, alter, octave } back into VexTab tokens like 'D#/5'
export function formatNote({ step, alter, octave }) {
  const acc = alter === 1 ? '#' : alter === -1 ? 'b' : '';
  return `${step}${acc}/${octave}`;
}
