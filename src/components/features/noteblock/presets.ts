import type { Options } from 'audiomotion-analyzer';

export interface Preset {
  name: string;
  options: Options;
}

export const presets: Preset[] = [
  {
    name: 'Radial Rainbow',
    options: {
      radial: true, radialInvert: false, mode: 3, gradient: 'rainbow',
      ledBars: false, lumiBars: false, outlineBars: false, roundBars: false,
      lineWidth: 0, mirror: 0, spinSpeed: 1, radius: 0.3, showPeaks: true,
    },
  },
  {
    name: 'LED Radial',
    options: {
      radial: true, radialInvert: false, mode: 3, gradient: 'classic',
      ledBars: true, lumiBars: false, outlineBars: false, roundBars: false,
      lineWidth: 0, mirror: 0, spinSpeed: 2, radius: 0.3, showPeaks: true,
    },
  },
  {
    name: 'Neon Area',
    options: {
      radial: false, radialInvert: false, mode: 10, gradient: 'prism',
      ledBars: false, lumiBars: false, outlineBars: false, roundBars: false,
      lineWidth: 2, mirror: 0, spinSpeed: 0, radius: 0.3, showPeaks: false,
    },
  },
  {
    name: 'Lumi Bars',
    options: {
      radial: false, radialInvert: false, mode: 5, gradient: 'rainbow',
      ledBars: false, lumiBars: true, outlineBars: false, roundBars: true,
      lineWidth: 0, mirror: 0, spinSpeed: 0, radius: 0.3, showPeaks: false,
    },
  },
  {
    name: 'Mirror Bars',
    options: {
      radial: false, radialInvert: false, mode: 6, gradient: 'orangered',
      ledBars: false, lumiBars: false, outlineBars: false, roundBars: true,
      lineWidth: 0, mirror: 1, spinSpeed: 0, radius: 0.3, showPeaks: true,
    },
  },
  {
    name: 'Radial Invert',
    options: {
      radial: true, radialInvert: true, mode: 4, gradient: 'steelblue',
      ledBars: false, lumiBars: false, outlineBars: false, roundBars: false,
      lineWidth: 0, mirror: 0, spinSpeed: -1, radius: 0.3, showPeaks: true,
    },
  },
  {
    name: 'Outline Radial',
    options: {
      radial: true, radialInvert: false, mode: 5, gradient: 'prism',
      ledBars: false, lumiBars: false, outlineBars: true, roundBars: false,
      lineWidth: 0, mirror: 0, spinSpeed: 1, radius: 0.25, showPeaks: false,
    },
  },
  {
    name: 'Area Radial',
    options: {
      radial: true, radialInvert: false, mode: 10, gradient: 'rainbow',
      ledBars: false, lumiBars: false, outlineBars: false, roundBars: false,
      lineWidth: 2.5, mirror: 0, spinSpeed: 1, radius: 0.2, showPeaks: false,
    },
  },
];
