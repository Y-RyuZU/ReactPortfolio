import type { InstrumentPreset } from './types';

export const INSTRUMENT_PRESETS: InstrumentPreset[] = [
  { id: 'harp',           name: 'Harp',           oggUrl: '/noteblock/instruments/harp.ogg',           baseNote: 'F#4' },
  { id: 'harp2',          name: 'Harp 2',         oggUrl: '/noteblock/instruments/harp2.ogg',          baseNote: 'F#4' },
  { id: 'bass',           name: 'Bass',           oggUrl: '/noteblock/instruments/bass.ogg',           baseNote: 'F#2' },
  { id: 'bell',           name: 'Bell',           oggUrl: '/noteblock/instruments/bell.ogg',           baseNote: 'F#6' },
  { id: 'icechime',       name: 'Chime',          oggUrl: '/noteblock/instruments/icechime.ogg',       baseNote: 'F#6' },
  { id: 'flute',          name: 'Flute',          oggUrl: '/noteblock/instruments/flute.ogg',          baseNote: 'F#5' },
  { id: 'guitar',         name: 'Guitar',         oggUrl: '/noteblock/instruments/guitar.ogg',         baseNote: 'F#3' },
  { id: 'xylobone',       name: 'Xylophone',      oggUrl: '/noteblock/instruments/xylobone.ogg',       baseNote: 'F#6' },
  { id: 'iron_xylophone', name: 'Iron Xylophone', oggUrl: '/noteblock/instruments/iron_xylophone.ogg', baseNote: 'F#4' },
  { id: 'cow_bell',       name: 'Cow Bell',       oggUrl: '/noteblock/instruments/cow_bell.ogg',       baseNote: 'F#5' },
  { id: 'didgeridoo',     name: 'Didgeridoo',     oggUrl: '/noteblock/instruments/didgeridoo.ogg',     baseNote: 'F#2' },
  { id: 'bit',            name: 'Bit',            oggUrl: '/noteblock/instruments/bit.ogg',            baseNote: 'F#4' },
  { id: 'banjo',          name: 'Banjo',          oggUrl: '/noteblock/instruments/banjo.ogg',          baseNote: 'F#4' },
  { id: 'pling',          name: 'Pling',          oggUrl: '/noteblock/instruments/pling.ogg',          baseNote: 'F#4' },
  { id: 'snare',          name: 'Snare',          oggUrl: '/noteblock/instruments/snare.ogg',          baseNote: 'D4' },
  { id: 'hat',            name: 'Hat',            oggUrl: '/noteblock/instruments/hat.ogg',            baseNote: 'D4' },
  { id: 'bd',             name: 'Bass Drum',      oggUrl: '/noteblock/instruments/bd.ogg',             baseNote: 'D4' },
  { id: 'bassattack',     name: 'Bass Attack',    oggUrl: '/noteblock/instruments/bassattack.ogg',     baseNote: 'D4' },
];

export function getPresetById(id: string): InstrumentPreset | undefined {
  return INSTRUMENT_PRESETS.find(p => p.id === id);
}
