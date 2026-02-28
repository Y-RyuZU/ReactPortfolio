'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import { Midi } from '@tonejs/midi';
import type { TrackInfo, TrackAssignment } from './types';
import { getPresetById } from './instrumentPresets';
import { Frequency } from 'tone';

function transposeName(noteName: string, semitones: number): string {
  if (semitones === 0) return noteName;
  const midi = Frequency(noteName).toMidi();
  return Frequency(midi + semitones, 'midi').toNote();
}

export function useNoteBlockAudio() {
  const [sampleLoaded, setSampleLoaded] = useState(false);
  const [midiLoaded, setMidiLoaded] = useState(false);
  const [midiDuration, setMidiDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const midiDurationRef = useRef(0);
  const isLoopingRef = useRef(false);

  // Multi-track state
  const [trackInfos, setTrackInfos] = useState<TrackInfo[]>([]);
  const [trackAssignments, setTrackAssignments] = useState<TrackAssignment[]>([]);
  const [isLoadingInstruments, setIsLoadingInstruments] = useState(false);

  // Global sampler (backward compat)
  const samplerRef = useRef<Tone.Sampler | null>(null);
  const scheduledEventsRef = useRef<number[]>([]);
  const blobUrlRef = useRef<string | null>(null);
  const currentOggFileRef = useRef<File | null>(null);
  const animFrameRef = useRef<number>(0);

  // Multi-track refs
  const trackSamplersRef = useRef<Map<number, Tone.Sampler>>(new Map());
  const midiRef = useRef<Midi | null>(null);
  const customBlobUrlsRef = useRef<Set<string>>(new Set());

  const disposeTrackSamplers = useCallback(() => {
    const uniqueSamplers = new Set(trackSamplersRef.current.values());
    for (const sampler of uniqueSamplers) {
      sampler.dispose();
    }
    trackSamplersRef.current.clear();
    for (const url of customBlobUrlsRef.current) {
      URL.revokeObjectURL(url);
    }
    customBlobUrlsRef.current.clear();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      const transport = Tone.getTransport();
      transport.stop();
      transport.cancel();
      samplerRef.current?.dispose();
      disposeTrackSamplers();
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startTimeTracking = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    const tick = () => {
      const transport = Tone.getTransport();
      if (transport.state === 'started') {
        const seconds = transport.seconds;
        const duration = midiDurationRef.current;

        if (duration > 0 && seconds >= duration) {
          if (isLoopingRef.current) {
            transport.stop();
            transport.seconds = 0;
            transport.start();
            setCurrentTime(0);
          } else {
            transport.stop();
            transport.seconds = 0;
            setCurrentTime(0);
            setIsPlaying(false);
            cancelAnimationFrame(animFrameRef.current);
            return;
          }
        } else {
          setCurrentTime(seconds);
        }
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, []);

  const stopTimeTracking = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
  }, []);

  const loadSample = useCallback(async (oggFile: File, baseNote = 'F#4') => {
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    blobUrlRef.current = URL.createObjectURL(oggFile);
    currentOggFileRef.current = oggFile;

    await Tone.start();

    return new Promise<void>((resolve, reject) => {
      samplerRef.current?.dispose();
      samplerRef.current = new Tone.Sampler({
        urls: { [baseNote]: blobUrlRef.current! },
        onload: () => {
          setSampleLoaded(true);
          resolve();
        },
        onerror: (err) => reject(err),
      }).toDestination();
    });
  }, []);

  const reloadSample = useCallback(async (baseNote: string) => {
    if (!currentOggFileRef.current) return;
    await loadSample(currentOggFileRef.current, baseNote);
  }, [loadSample]);

  const clearSchedule = useCallback(() => {
    const transport = Tone.getTransport();
    for (const id of scheduledEventsRef.current) {
      transport.clear(id);
    }
    scheduledEventsRef.current = [];
  }, []);

  const loadMidi = useCallback(async (midiFile: File) => {
    const buffer = await midiFile.arrayBuffer();
    const midi = new Midi(buffer);
    midiRef.current = midi;

    await Tone.start();
    clearSchedule();
    disposeTrackSamplers();

    const transport = Tone.getTransport();
    transport.bpm.value = midi.header.tempos[0]?.bpm ?? 120;

    // Extract track info (only tracks with notes)
    const infos: TrackInfo[] = midi.tracks
      .map((track, index) => ({
        index,
        name: track.name || `Track ${index + 1}`,
        channel: track.channel,
        noteCount: track.notes.length,
        instrumentName: track.instrument.name,
      }))
      .filter(t => t.noteCount > 0);

    setTrackInfos(infos);

    // Default assignments: all tracks use 'pling'
    const defaultAssignments: TrackAssignment[] = infos.map(t => ({
      trackIndex: t.index,
      instrumentId: 'pling',
      pitchOffset: 0,
      volume: 100,
      muted: false,
    }));
    setTrackAssignments(defaultAssignments);
    setMidiDuration(midi.duration);
    midiDurationRef.current = midi.duration;
    setMidiLoaded(true);

    // Auto-apply default assignments (loads pling sampler for all tracks)
    await applyTrackAssignmentsInternal(defaultAssignments);

    return midi.duration;
  }, [clearSchedule, disposeTrackSamplers]);

  const applyTrackAssignmentsInternal = useCallback(async (assignments: TrackAssignment[]) => {
    if (!midiRef.current) return;

    setIsLoadingInstruments(true);
    const transport = Tone.getTransport();
    const wasPlaying = transport.state === 'started';
    if (wasPlaying) transport.pause();
    const savedPosition = transport.seconds;

    try {
      clearSchedule();
      disposeTrackSamplers();

      const midi = midiRef.current;

      // Cache samplers by key to avoid duplicates
      const samplerCache = new Map<string, Tone.Sampler>();

      for (const assignment of assignments) {
        if (assignment.muted) continue;

        const track = midi.tracks[assignment.trackIndex];
        if (!track || track.notes.length === 0) continue;

        let cacheKey: string;
        let url: string;
        let baseNote: string;

        if (assignment.instrumentId === 'custom' && assignment.customOggFile) {
          cacheKey = `custom-${assignment.trackIndex}`;
          url = URL.createObjectURL(assignment.customOggFile);
          customBlobUrlsRef.current.add(url);
          baseNote = assignment.baseNote ?? 'F#4';
        } else {
          const preset = getPresetById(assignment.instrumentId);
          if (!preset) continue;
          cacheKey = `${assignment.instrumentId}-${assignment.baseNote ?? preset.baseNote}`;
          url = preset.oggUrl;
          baseNote = assignment.baseNote ?? preset.baseNote;
        }

        let sampler = samplerCache.get(cacheKey);
        if (!sampler) {
          sampler = await new Promise<Tone.Sampler>((resolve, reject) => {
            const s = new Tone.Sampler({
              urls: { [baseNote]: url },
              onload: () => resolve(s),
              onerror: (err) => reject(err),
            }).toDestination();
          });
          samplerCache.set(cacheKey, sampler);
        }
        trackSamplersRef.current.set(assignment.trackIndex, sampler);

        // Schedule this track's notes to its sampler (with pitch offset + volume)
        const offset = assignment.pitchOffset ?? 0;
        const vol = (assignment.volume ?? 100) / 100;
        for (const note of track.notes) {
          const s = sampler;
          const transposed = transposeName(note.name, offset);
          const id = transport.schedule((time) => {
            s.triggerAttackRelease(transposed, note.duration, time, note.velocity * vol);
          }, note.time);
          scheduledEventsRef.current.push(id);
        }
      }

      setTrackAssignments(assignments);
      transport.seconds = savedPosition;
      if (wasPlaying) transport.start();
    } finally {
      setIsLoadingInstruments(false);
    }
  }, [clearSchedule, disposeTrackSamplers]);

  const applyTrackAssignments = useCallback(async (assignments: TrackAssignment[]) => {
    await applyTrackAssignmentsInternal(assignments);
  }, [applyTrackAssignmentsInternal]);

  const loadMidiFromUrl = useCallback(async (url: string) => {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const file = new File([buffer], url.split('/').pop() || 'preset.mid', { type: 'audio/midi' });
    return loadMidi(file);
  }, [loadMidi]);

  const play = useCallback(async () => {
    await Tone.start();
    Tone.getTransport().start();
    setIsPlaying(true);
    startTimeTracking();
  }, [startTimeTracking]);

  const pause = useCallback(() => {
    Tone.getTransport().pause();
    setIsPlaying(false);
    stopTimeTracking();
    setCurrentTime(Tone.getTransport().seconds);
  }, [stopTimeTracking]);

  const toggleLoop = useCallback(() => {
    setIsLooping(prev => {
      const next = !prev;
      isLoopingRef.current = next;
      return next;
    });
  }, []);

  const seekTo = useCallback((seconds: number) => {
    const transport = Tone.getTransport();
    const wasPlaying = transport.state === 'started';
    if (wasPlaying) transport.pause();
    transport.seconds = seconds;
    setCurrentTime(seconds);
    if (wasPlaying) transport.start();
  }, []);

  const exportAudio = useCallback(async () => {
    setIsExporting(true);
    try {
      const recorder = new Tone.Recorder();
      Tone.getDestination().connect(recorder);

      const transport = Tone.getTransport();
      transport.stop();
      transport.position = 0;

      recorder.start();
      transport.start();

      await new Promise((resolve) => setTimeout(resolve, (midiDuration + 1) * 1000));

      transport.stop();
      transport.position = 0;

      const blob = await recorder.stop();
      recorder.dispose();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'noteblock-export.webm';
      a.click();
      URL.revokeObjectURL(url);

      setIsPlaying(false);
      setCurrentTime(0);
    } finally {
      setIsExporting(false);
    }
  }, [midiDuration]);

  return {
    sampleLoaded,
    midiLoaded,
    midiDuration,
    currentTime,
    isPlaying,
    isExporting,
    loadSample,
    reloadSample,
    loadMidi,
    loadMidiFromUrl,
    play,
    pause,
    seekTo,
    toggleLoop,
    isLooping,
    exportAudio,
    // Multi-track
    trackInfos,
    trackAssignments,
    isLoadingInstruments,
    applyTrackAssignments,
  };
}
