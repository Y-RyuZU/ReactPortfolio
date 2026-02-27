'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type { TrackInfo, TrackAssignment } from './types';
import { INSTRUMENT_PRESETS } from './instrumentPresets';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const BASE_NOTES: string[] = [];
for (let octave = 2; octave <= 6; octave++) {
  for (const name of NOTE_NAMES) {
    BASE_NOTES.push(`${name}${octave}`);
  }
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
      onApply(next);
      return next;
    });
  }, [onApply]);

  return (
    <div className="space-y-1">
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
                <SelectItem value="global" className="text-xs">Global Sample</SelectItem>
                <SelectItem value="custom" className="text-xs">Custom OGG...</SelectItem>
                {INSTRUMENT_PRESETS.map(p => (
                  <SelectItem key={p.id} value={p.id} className="text-xs">{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

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

            {(assignment.instrumentId === 'custom' || assignment.instrumentId === 'global') && (
              <Select
                value={assignment.baseNote ?? 'F#4'}
                onValueChange={(v) => handleChange(track.index, { baseNote: v })}
              >
                <SelectTrigger className="h-6 w-16 text-[11px] bg-transparent border-white/20 text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BASE_NOTES.map(note => (
                    <SelectItem key={note} value={note} className="text-xs">{note}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        );
      })}

      {isLoading && (
        <div className="text-[11px] text-gray-300 text-center py-1">Loading instruments...</div>
      )}
    </div>
  );
}
