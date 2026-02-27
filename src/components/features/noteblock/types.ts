export interface InstrumentPreset {
  id: string;
  name: string;
  oggUrl: string;
  baseNote: string;
}

export interface TrackInfo {
  index: number;
  name: string;
  channel: number;
  noteCount: number;
  instrumentName: string;
}

export interface TrackAssignment {
  trackIndex: number;
  instrumentId: string;
  customOggFile?: File;
  baseNote?: string;
  pitchOffset: number;
  muted: boolean;
}
