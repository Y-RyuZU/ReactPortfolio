'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Minus, Plus } from 'lucide-react';
import * as Tone from 'tone';
import type { TrackInfo, TrackAssignment } from './types';
import { INSTRUMENT_PRESETS, getPresetById } from './instrumentPresets';

function pitchLabel(instrumentId: string, offset: number): string {
  const preset = getPresetById(instrumentId);
  const base = preset?.baseNote ?? 'F#4';
  const sign = offset >= 0 ? '+' : '';
  if (offset === 0) return `${base}(${sign}${offset})`;
  const midi = Tone.Frequency(base).toMidi();
  const note = Tone.Frequency(midi + offset, 'midi').toNote();
  return `${note}(${sign}${offset})`;
}

interface TrackInstrumentPanelProps {
  trackInfos: TrackInfo[];
  trackAssignments: TrackAssignment[];
  isLoading: boolean;
  onApply: (assignments: TrackAssignment[]) => Promise<void>;
}

export default function TrackInstrumentPanel({
  trackInfos, trackAssignments, isLoading, onApply,
}: TrackInstrumentPanelProps) {
  const [draft, setDraft] = useState<TrackAssignment[]>(trackAssignments);
  const customOggRefs = useRef<Map<number, HTMLInputElement>>(new Map());

  useEffect(() => {
    setDraft(trackAssignments);
  }, [trackAssignments]);

  const handleChange = useCallback((trackIndex: number, patch: Partial<TrackAssignment>) => {
    setDraft(prev => {
      const next = prev.map(a =>
        a.trackIndex === trackIndex ? { ...a, ...patch } : a
      );
      queueMicrotask(() => onApply(next));
      return next;
    });
  }, [onApply]);

  return (
    <div className="space-y-1.5">
      {trackInfos.map(track => {
        const assignment = draft.find(a => a.trackIndex === track.index);
        if (!assignment) return null;

        return (
          <div key={track.index} className="flex items-center gap-1.5">
            <Checkbox
              checked={!assignment.muted}
              onCheckedChange={(v) => handleChange(track.index, { muted: !v })}
              className="h-3 w-3"
            />

            <span className="text-[11px] text-gray-200 w-20 truncate" title={track.name}>
              {track.name}
            </span>
            <span className="text-[10px] text-gray-400 w-8 tabular-nums">
              {track.noteCount}n
            </span>

            {/* Instrument selector */}
            <Select
              value={assignment.instrumentId}
              onValueChange={(v) => handleChange(track.index, {
                instrumentId: v,
                customOggFile: v === 'custom' ? assignment.customOggFile : undefined,
              })}
            >
              <SelectTrigger className="h-6 w-32 text-[11px] bg-transparent border-white/20 text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INSTRUMENT_PRESETS.map(p => (
                  <SelectItem key={p.id} value={p.id} className="text-xs">{p.name}</SelectItem>
                ))}
                <SelectItem value="custom" className="text-xs">Custom OGG...</SelectItem>
              </SelectContent>
            </Select>

            {/* Custom OGG upload */}
            {assignment.instrumentId === 'custom' && (
              <>
                <input
                  type="file"
                  accept=".ogg,audio/*"
                  className="hidden"
                  ref={(el) => { if (el) customOggRefs.current.set(track.index, el); }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleChange(track.index, { customOggFile: file });
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 px-1.5 text-[10px] text-gray-200 hover:text-white hover:bg-white/15"
                  onClick={() => customOggRefs.current.get(track.index)?.click()}
                >
                  {assignment.customOggFile ? assignment.customOggFile.name.slice(0, 10) : 'Upload'}
                </Button>
              </>
            )}

            {/* Pitch offset: - [value] + */}
            <div className="flex items-center gap-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 text-gray-300 hover:text-white hover:bg-white/15"
                onClick={() => handleChange(track.index, { pitchOffset: (assignment.pitchOffset ?? 0) - 1 })}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="text-[10px] text-gray-100 w-16 text-center tabular-nums font-mono">
                {pitchLabel(assignment.instrumentId, assignment.pitchOffset ?? 0)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 text-gray-300 hover:text-white hover:bg-white/15"
                onClick={() => handleChange(track.index, { pitchOffset: (assignment.pitchOffset ?? 0) + 1 })}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        );
      })}

    </div>
  );
}
