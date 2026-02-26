'use client';

import { useRef, useCallback, useEffect } from 'react';
import AudioMotionAnalyzer, { type Options } from 'audiomotion-analyzer';
import * as Tone from 'tone';
import { presets, type Preset } from './presets';

export function useVisualizer() {
  const analyzerRef = useRef<AudioMotionAnalyzer | null>(null);
  const bridgeRef = useRef<GainNode | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      analyzerRef.current?.destroy();
      analyzerRef.current = null;
      bridgeRef.current = null;
    };
  }, []);

  const initVisualizer = useCallback(async (container: HTMLElement) => {
    if (analyzerRef.current) {
      analyzerRef.current.destroy();
    }

    await Tone.start();

    analyzerRef.current = new AudioMotionAnalyzer(container, {
      audioCtx: Tone.getContext().rawContext as AudioContext,
      connectSpeakers: false,
      ...presets[0].options,
      smoothing: 0.7,
      showScaleX: false,
      showScaleY: false,
      showBgColor: false,
      bgAlpha: 0,
      overlay: true,
    });

    // Bridge Tone.js output to the visualizer via a native GainNode
    const ctx = Tone.getContext().rawContext as AudioContext;
    bridgeRef.current = ctx.createGain();
    Tone.getDestination().connect(bridgeRef.current);
    analyzerRef.current.connectInput(bridgeRef.current);

    return analyzerRef.current;
  }, []);

  const applyPreset = useCallback((preset: Preset) => {
    analyzerRef.current?.setOptions(preset.options);
  }, []);

  const applyOptions = useCallback((options: Options) => {
    analyzerRef.current?.setOptions(options);
  }, []);

  return {
    initVisualizer,
    applyPreset,
    applyOptions,
    analyzerRef,
  };
}
