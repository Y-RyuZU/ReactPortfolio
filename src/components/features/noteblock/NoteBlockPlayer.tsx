'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Play, Pause, Download, Settings, Music } from 'lucide-react';
import { useNoteBlockAudio } from './useNoteBlockAudio';
import { useVisualizer } from './useVisualizer';
import { presets } from './presets';
import TrackInstrumentPanel from './TrackInstrumentPanel';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function NoteBlockPlayer() {
  const audio = useNoteBlockAudio();
  const visualizer = useVisualizer();

  const vizContainerRef = useRef<HTMLDivElement>(null);
  const vizInitializedRef = useRef(false);
  const midiInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const [presetIndex, setPresetIndex] = useState('0');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tracksOpen, setTracksOpen] = useState(false);
  const [bgUrl, setBgUrl] = useState<string | null>(null);

  // Detail panel state
  const [vizMode, setVizMode] = useState('3');
  const [vizGradient, setVizGradient] = useState('rainbow');
  const [vizRadial, setVizRadial] = useState(true);
  const [vizRadialInvert, setVizRadialInvert] = useState(false);
  const [vizLedBars, setVizLedBars] = useState(false);
  const [vizLumiBars, setVizLumiBars] = useState(false);
  const [vizOutlineBars, setVizOutlineBars] = useState(false);
  const [vizRoundBars, setVizRoundBars] = useState(false);
  const [vizShowPeaks, setVizShowPeaks] = useState(true);
  const [vizSpinSpeed, setVizSpinSpeed] = useState(1);
  const [vizRadius, setVizRadius] = useState(0.3);
  const [vizLineWidth, setVizLineWidth] = useState(0);
  const [vizMirror, setVizMirror] = useState('0');

  const ensureVisualizer = useCallback(async () => {
    if (!vizInitializedRef.current && vizContainerRef.current) {
      await visualizer.initVisualizer(vizContainerRef.current);
      vizInitializedRef.current = true;
    }
  }, [visualizer]);

  const syncFromPreset = useCallback((opts: Record<string, unknown>) => {
    if (opts.mode !== undefined) setVizMode(String(opts.mode));
    if (opts.gradient !== undefined) setVizGradient(String(opts.gradient));
    if (opts.radial !== undefined) setVizRadial(!!opts.radial);
    if (opts.radialInvert !== undefined) setVizRadialInvert(!!opts.radialInvert);
    if (opts.ledBars !== undefined) setVizLedBars(!!opts.ledBars);
    if (opts.lumiBars !== undefined) setVizLumiBars(!!opts.lumiBars);
    if (opts.outlineBars !== undefined) setVizOutlineBars(!!opts.outlineBars);
    if (opts.roundBars !== undefined) setVizRoundBars(!!opts.roundBars);
    if (opts.showPeaks !== undefined) setVizShowPeaks(!!opts.showPeaks);
    if (opts.spinSpeed !== undefined) setVizSpinSpeed(Number(opts.spinSpeed));
    if (opts.radius !== undefined) setVizRadius(Number(opts.radius));
    if (opts.lineWidth !== undefined) setVizLineWidth(Number(opts.lineWidth));
    if (opts.mirror !== undefined) setVizMirror(String(opts.mirror));
  }, []);

  const applyDetailOptions = useCallback(() => {
    visualizer.applyOptions({
      mode: Number(vizMode),
      gradient: vizGradient,
      radial: vizRadial,
      radialInvert: vizRadialInvert,
      ledBars: vizLedBars,
      lumiBars: vizLumiBars,
      outlineBars: vizOutlineBars,
      roundBars: vizRoundBars,
      showPeaks: vizShowPeaks,
      spinSpeed: vizSpinSpeed,
      radius: vizRadius,
      lineWidth: vizLineWidth,
      mirror: Number(vizMirror),
    });
  }, [visualizer, vizMode, vizGradient, vizRadial, vizRadialInvert, vizLedBars, vizLumiBars, vizOutlineBars, vizRoundBars, vizShowPeaks, vizSpinSpeed, vizRadius, vizLineWidth, vizMirror]);

  useEffect(() => {
    if (vizInitializedRef.current) {
      applyDetailOptions();
    }
  }, [applyDetailOptions]);

  // Auto-open tracks panel when MIDI is loaded
  useEffect(() => {
    if (audio.trackInfos.length > 0) {
      setTracksOpen(true);
    }
  }, [audio.trackInfos]);

  const handleMidiChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await ensureVisualizer();
    await audio.loadMidi(file);
  };

  const handleBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBgUrl(url);
  };

  const handlePresetChange = (value: string) => {
    setPresetIndex(value);
    const preset = presets[Number(value)];
    visualizer.applyPreset(preset);
    syncFromPreset(preset.options as unknown as Record<string, unknown>);
  };

  const handlePlayPause = async () => {
    await ensureVisualizer();
    if (audio.isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleSeek = (value: number[]) => {
    audio.seekTo(value[0]);
  };

  const ready = audio.midiLoaded;

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Hidden file inputs */}
      <input ref={midiInputRef} type="file" accept=".mid,.midi" onChange={handleMidiChange} className="hidden" />
      <input ref={bgInputRef} type="file" accept="image/*" onChange={handleBgChange} className="hidden" />

      {/* Visualizer — fills available space */}
      <div className="flex-1 min-h-0">
        <div
          ref={vizContainerRef}
          className="w-full h-full rounded-lg overflow-hidden"
          style={{
            backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>

      {/* Bottom controls — compact, no scroll */}
      <div className="shrink-0 space-y-1.5">
        {/* Seek bar */}
        {audio.midiLoaded && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-200 font-mono w-8 text-right">
              {formatTime(audio.currentTime)}
            </span>
            <Slider
              value={[audio.currentTime]}
              onValueChange={handleSeek}
              min={0}
              max={audio.midiDuration || 1}
              step={0.1}
              className="flex-1"
            />
            <span className="text-[11px] text-gray-200 font-mono w-8">
              {formatTime(audio.midiDuration)}
            </span>
          </div>
        )}

        {/* Control bar */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-white hover:bg-white/15"
            disabled={!ready || audio.isExporting}
            onClick={handlePlayPause}
          >
            {audio.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-gray-200 hover:text-white hover:bg-white/15 text-[11px]"
            disabled={!ready || audio.isExporting}
            onClick={audio.exportAudio}
          >
            <Download className="w-3 h-3" />
          </Button>

          <div className="w-px h-4 bg-white/20" />

          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-[11px] text-gray-200 hover:text-white hover:bg-white/15"
            onClick={() => midiInputRef.current?.click()}
          >
            MIDI {audio.midiLoaded && <span className="w-1.5 h-1.5 rounded-full bg-green-400 ml-1" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-[11px] text-gray-200 hover:text-white hover:bg-white/15"
            onClick={() => bgInputRef.current?.click()}
          >
            BG
          </Button>

          {audio.midiLoaded && (
            <>
              <div className="w-px h-4 bg-white/20" />
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-[11px] text-gray-200 hover:text-white hover:bg-white/15"
                onClick={() => setTracksOpen(!tracksOpen)}
              >
                <Music className="w-3 h-3 mr-1" />
                Tracks ({audio.trackInfos.length})
                {tracksOpen && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 ml-1" />}
              </Button>
            </>
          )}

          <div className="flex-1" />

          {/* Visualizer preset */}
          <Select value={presetIndex} onValueChange={handlePresetChange}>
            <SelectTrigger className="h-7 w-28 text-[11px] bg-transparent border-white/20 text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {presets.map((p, i) => (
                <SelectItem key={i} value={String(i)} className="text-xs">{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-gray-200 hover:text-white hover:bg-white/15"
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            <Settings className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Track instrument panel */}
        {tracksOpen && audio.midiLoaded && (
          <div className="p-2 rounded border border-white/20 bg-black/40 backdrop-blur-sm">
            <TrackInstrumentPanel
              trackInfos={audio.trackInfos}
              trackAssignments={audio.trackAssignments}
              isLoading={audio.isLoadingInstruments}
              onApply={audio.applyTrackAssignments}
            />
          </div>
        )}

        {/* Settings panel */}
        {settingsOpen && (
          <div className="p-2 rounded border border-white/20 bg-black/40 backdrop-blur-sm space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[11px] text-gray-300">Mode</Label>
                <Select value={vizMode} onValueChange={setVizMode}>
                  <SelectTrigger className="h-6 text-[11px] bg-transparent border-white/20 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0,1,2,3,4,5,6,7,8,10].map(m => (
                      <SelectItem key={m} value={String(m)} className="text-xs">Mode {m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[11px] text-gray-300">Gradient</Label>
                <Select value={vizGradient} onValueChange={setVizGradient}>
                  <SelectTrigger className="h-6 text-[11px] bg-transparent border-white/20 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['classic','orangered','prism','rainbow','steelblue'].map(g => (
                      <SelectItem key={g} value={g} className="text-xs">{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {[
                { label: 'Radial', checked: vizRadial, onChange: setVizRadial },
                { label: 'Invert', checked: vizRadialInvert, onChange: setVizRadialInvert },
                { label: 'LED', checked: vizLedBars, onChange: setVizLedBars },
                { label: 'Lumi', checked: vizLumiBars, onChange: setVizLumiBars },
                { label: 'Outline', checked: vizOutlineBars, onChange: setVizOutlineBars },
                { label: 'Round', checked: vizRoundBars, onChange: setVizRoundBars },
                { label: 'Peaks', checked: vizShowPeaks, onChange: setVizShowPeaks },
              ].map(({ label, checked, onChange }) => (
                <div key={label} className="flex items-center gap-1">
                  <Checkbox
                    id={`viz-${label}`}
                    checked={checked}
                    onCheckedChange={(v) => onChange(!!v)}
                    className="h-3 w-3"
                  />
                  <Label htmlFor={`viz-${label}`} className="text-[11px] text-gray-200 cursor-pointer">{label}</Label>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div>
                <Label className="text-[11px] text-gray-300">Spin: {vizSpinSpeed}</Label>
                <Slider value={[vizSpinSpeed]} onValueChange={([v]) => setVizSpinSpeed(v)} min={-5} max={5} step={0.5} />
              </div>
              <div>
                <Label className="text-[11px] text-gray-300">Radius: {vizRadius}</Label>
                <Slider value={[vizRadius]} onValueChange={([v]) => setVizRadius(v)} min={0.1} max={1} step={0.05} />
              </div>
              <div>
                <Label className="text-[11px] text-gray-300">Line: {vizLineWidth}</Label>
                <Slider value={[vizLineWidth]} onValueChange={([v]) => setVizLineWidth(v)} min={0} max={5} step={0.5} />
              </div>
              <div>
                <Label className="text-[11px] text-gray-300">Mirror</Label>
                <Select value={vizMirror} onValueChange={setVizMirror}>
                  <SelectTrigger className="h-6 text-[11px] bg-transparent border-white/20 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0" className="text-xs">Off</SelectItem>
                    <SelectItem value="1" className="text-xs">Mirror</SelectItem>
                    <SelectItem value="-1" className="text-xs">Reverse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
