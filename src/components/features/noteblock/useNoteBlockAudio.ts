'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import { Midi } from '@tonejs/midi';

export function useNoteBlockAudio() {
  const [sampleLoaded, setSampleLoaded] = useState(false);
  const [midiLoaded, setMidiLoaded] = useState(false);
  const [midiDuration, setMidiDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const samplerRef = useRef<Tone.Sampler | null>(null);
  const scheduledEventsRef = useRef<number[]>([]);
  const blobUrlRef = useRef<string | null>(null);
  const currentOggFileRef = useRef<File | null>(null);
  const animFrameRef = useRef<number>(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      const transport = Tone.getTransport();
      transport.stop();
      transport.cancel();
      samplerRef.current?.dispose();
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  // Track playback position via requestAnimationFrame
  const startTimeTracking = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    const tick = () => {
      const transport = Tone.getTransport();
      if (transport.state === 'started') {
        setCurrentTime(transport.seconds);
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

    await Tone.start();
    clearSchedule();

    const transport = Tone.getTransport();
    transport.bpm.value = midi.header.tempos[0]?.bpm ?? 120;

    for (const track of midi.tracks) {
      for (const note of track.notes) {
        const id = transport.schedule((time) => {
          samplerRef.current?.triggerAttackRelease(note.name, note.duration, time, note.velocity);
        }, note.time);
        scheduledEventsRef.current.push(id);
      }
    }

    setMidiDuration(midi.duration);
    setMidiLoaded(true);
    return midi.duration;
  }, [clearSchedule]);

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
    exportAudio,
  };
}
