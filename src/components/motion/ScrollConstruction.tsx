'use client';

import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { MinecraftHand, HeldBlock } from './MinecraftHand';
import { glassMaterial, writingMaterial, miningMaterial, materialForPart, type HeldMaterial } from './construction-material';
import './scroll-construction.css';
import { usePathname } from 'next/navigation';

const ConstructionContext = createContext<{ enabled: boolean } | null>(null);
export const useConstruction = () => useContext(ConstructionContext);
const clamp = (v: number) => Math.max(0, Math.min(1, v));
type Point = { x: number; y: number };
type Writing = {
  part: HTMLElement; offset: Point;
  lines: { x: number; y: number; width: number; height: number }[]; length: number;
};
type Job = { id: number; kind: 'frame' | 'part'; slot: number; action: 'place' | 'mine'; after?: number; state: 'pending' | 'working' | 'done' };

export function ScrollConstruction({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  return (
    <ConstructionContext.Provider value={{ enabled: !reduced && pathname === '/' }}>
      <div className="scroll-construction flex flex-1 flex-col">
        <noscript><style>{'.construction-piece > .construction-content { opacity: 1 !important; }'}</style></noscript>
        {children}
      </div>
    </ConstructionContext.Provider>
  );
}

export function BuildPiece({ children, className, as: Tag = 'div', kind = 'panel' }: {
  children: ReactNode; className?: string; as?: 'div' | 'li'; kind?: 'panel' | 'heading' | 'chrome';
}) {
  const context = useConstruction();
  const root = useRef<HTMLDivElement & HTMLLIElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const worksite = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, '');
  const seed = Array.from(id).reduce((hash, c) => Math.imul(hash ^ c.charCodeAt(0), 16777619), 2166136261) >>> 0;
  const [count, setCount] = useState(kind === 'heading' ? 1 : 2);

  useEffect(() => {
    const element = root.current;
    const body = content.current;
    const site = worksite.current;
    if (!context?.enabled || !element || !body || !site) return;
    const isHeader = kind === 'chrome' && !!element.closest('header');
    let randomState = seed;
    const random = () => { randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0; return randomState / 4294967296; };
    const candidates = Array.from(body.querySelectorAll<HTMLElement>('h2,h3,p,img,button,a,[data-build-detail]'));
    const parts = candidates.filter(node => !candidates.some(parent => parent !== node && parent.contains(node)));
    let pixels = Array.from(body.querySelectorAll<SVGElement>('[data-build-frame]'));
    const frameCount = kind !== 'panel' && !pixels.length ? 0 : 8;
    const installedFrames = Array.from({ length: 8 }, () => false);
    const animations: Animation[] = [];
    const materialCache = new Map<HTMLElement, HeldMaterial>();
    const anchors = [[.25, 1], [.75, 1], [0, .75], [0, .25], [.25, 0], [.75, 0], [1, .25], [1, .75]];
    let queue: Job[] = [];
    let frame = 0;
    let active = false;
    let built = false;
    let visible = false;
    let previousY = window.scrollY;
    let direction = 1;
    let repairAfter = 0;
    let impacts = 0;
    let mode: 'build' | 'repair' = 'build';

    const workers = Array.from(site.querySelectorAll<HTMLElement>('.component-builder')).map((node, index) => ({
      node, index,
      rig: node.querySelector<HTMLElement>('.mc-arm-rig')!,
      wrist: node.querySelector<HTMLElement>('.builder-wrist')!,
      sparks: node.querySelector<HTMLElement>('.builder-sparks')!,
      heldItem: node.querySelector<HTMLImageElement>('.builder-tool')!,
      heldBlock: node.querySelector<HTMLElement>('.builder-cube')!,
      roll: 155,
      job: null as Job | null, phase: 'waiting', spawnAt: 0, started: 0,
      travel: 500, hesitate: 100, strike: 190, rest: 120, hit: false,
      writing: null as Writing | null,
      position: { x: 0, y: 0 }, from: { x: 0, y: 0 }, to: { x: 0, y: 0 },
      bend1: { x: 0, y: 0 }, bend2: { x: 0, y: 0 },
    }));

    const paintFrames = () => pixels.forEach(pixel => {
      const opacity = installedFrames[Number(pixel.dataset.buildFrame)] ? '1' : '0';
      if (pixel.style.opacity !== opacity) pixel.style.opacity = opacity;
    });
    const install = (job: Job, value: boolean, pop = false) => {
      if (job.kind === 'frame') {
        installedFrames[job.slot] = value;
        paintFrames();
      } else {
        const part = parts[job.slot];
        if (part) {
          part.style.clipPath = '';
          part.style.opacity = value ? '1' : '0';
          if (value && pop) animations.push(part.animate(
            [{ scale: '.92' }, { scale: '1.025' }, { scale: '1' }],
            { duration: 160, easing: 'steps(3)' },
          ));
        }
      }
    };
    const complete = () => {
      if (built && !active) return;
      cancelAnimationFrame(frame);
      frame = 0;
      active = false;
      built = true;
      installedFrames.fill(true);
      paintFrames();
      parts.forEach(part => { part.style.opacity = '1'; part.style.clipPath = ''; });
      element.style.setProperty('--shell-opacity', '1');
      element.dataset.buildState = 'built';
      site.style.opacity = '0';
      workers.forEach(worker => { worker.node.style.opacity = '0'; worker.phase = 'gone'; });
      repairAfter = performance.now() + (mode === 'repair' ? 6000 : 250);
    };
    const pointFor = (job: Job): Point => {
      const parent = element.getBoundingClientRect();
      let x: number;
      let y: number;
      if (job.kind === 'frame') {
        const segments = pixels.filter(pixel => Number(pixel.dataset.buildFrame) === job.slot).map(pixel => pixel.getBoundingClientRect());
        if (segments.length) {
          x = (Math.min(...segments.map(r => r.left)) + Math.max(...segments.map(r => r.right))) / 2 - parent.left;
          y = (Math.min(...segments.map(r => r.top)) + Math.max(...segments.map(r => r.bottom))) / 2 - parent.top;
        } else {
          const point = anchors[job.slot];
          x = point[0] * element.offsetWidth;
          y = point[1] * element.offsetHeight;
        }
      } else {
        const part = parts[job.slot];
        const range = document.createRange();
        if (part) range.selectNodeContents(part);
        const ink = range.getBoundingClientRect();
        const rect = ink.width && ink.height ? ink : part?.getBoundingClientRect();
        x = rect ? rect.left - parent.left + rect.width * (.35 + random() * .3) : parent.width / 2;
        y = rect ? rect.top - parent.top + rect.height / 2 : parent.height / 2;
      }
      return { x, y };
    };
    const makePath = (worker: typeof workers[number], to: Point, now: number) => {
      worker.from = { ...worker.position };
      worker.to = to;
      const dx = to.x - worker.from.x;
      const dy = to.y - worker.from.y;
      const bend = (random() - .5) * 120;
      worker.bend1 = { x: worker.from.x + dx * .22 + bend, y: worker.from.y + dy * .45 - 35 - random() * 45 };
      worker.bend2 = { x: to.x - dx * .18 - bend * .45, y: to.y - dy * .12 + (random() - .5) * 65 };
      worker.started = now;
    };
    const move = (worker: typeof workers[number], t: number) => {
      const p = clamp(t);
      const q = 1 - p;
      const x = q ** 3 * worker.from.x + 3 * q * q * p * worker.bend1.x + 3 * q * p * p * worker.bend2.x + p ** 3 * worker.to.x;
      const y = q ** 3 * worker.from.y + 3 * q * q * p * worker.bend1.y + 3 * q * p * p * worker.bend2.y + p ** 3 * worker.to.y;
      worker.position = { x, y };
      worker.node.style.transform = `translate3d(${x}px,${y}px,0)`;
      worker.rig.style.transform = `rotateZ(${worker.roll}deg) rotateY(${26 + Math.sin(p * Math.PI) * (worker.index % 2 ? -32 : 24)}deg) rotateX(-12deg)`;
    };
    const readyJob = () => queue.find(job => job.state === 'pending'
      && (job.after === undefined || queue[job.after].state === 'done')
      && (mode === 'repair' || job.kind === 'frame' || queue.filter(j => j.kind === 'frame').every(j => j.state === 'done')));

    const equip = (worker: typeof workers[number], job: Job) => {
      let material = job.action === 'mine' ? miningMaterial : kind === 'heading' ? writingMaterial : glassMaterial;
      if (job.action === 'place' && job.kind === 'part') {
        const part = parts[job.slot];
        if (part) {
          material = materialCache.get(part) || materialForPart(part);
          materialCache.set(part, material);
        }
      }
      worker.node.dataset.held = material.kind;
      worker.node.dataset.unit = `${job.kind}:${job.slot}`;
      worker.node.dataset.hit = 'false';
      if (material.kind === 'block') worker.heldBlock.style.setProperty('--block-texture', `url("${material.src}")`);
      else if (worker.heldItem.getAttribute('src') !== material.src) worker.heldItem.src = material.src;
    };

    // Measure line boxes once per writing job. Text stays in its original DOM;
    // only its small clipping region and the existing hand transform change.
    const prepareWriting = (worker: typeof workers[number], job: Job): Writing | null => {
      if (job.action !== 'place' || job.kind !== 'part' || worker.node.dataset.held !== 'write') return null;
      const part = parts[job.slot];
      const box = part.getBoundingClientRect();
      const parent = element.getBoundingClientRect();
      const lines: Writing['lines'] = [];
      // Authored line bounds for outlined text images, normalized to image size.
      // Reuse the same pen/clip path without fetching or parsing SVG at runtime.
      if (part.dataset.buildWritingLines) {
        for (const row of part.dataset.buildWritingLines.split(';')) {
          const [x, y, width, height] = row.split(',').map(Number);
          lines.push({ x: x * box.width, y: y * box.height, width: width * box.width, height: height * box.height });
        }
      }
      const walker = document.createTreeWalker(part, NodeFilter.SHOW_TEXT);
      const range = document.createRange();
      while (walker.nextNode()) {
        if (!walker.currentNode.textContent?.trim()) continue;
        range.selectNodeContents(walker.currentNode);
        for (const rect of Array.from(range.getClientRects())) {
          if (!rect.width || !rect.height) continue;
          const line = lines.find(line => Math.abs(line.y - (rect.top - box.top)) < 4);
          if (line) {
            const right = Math.max(line.x + line.width, rect.right - box.left);
            line.x = Math.min(line.x, rect.left - box.left);
            line.width = right - line.x;
            line.height = Math.max(line.height, rect.height);
          } else lines.push({ x: rect.left - box.left, y: rect.top - box.top, width: rect.width, height: rect.height });
        }
      }
      if (!lines.length) return null;
      lines.sort((a, b) => a.y - b.y);
      return { part, offset: { x: box.left - parent.left, y: box.top - parent.top },
        lines, length: lines.reduce((sum, line) => sum + line.width, 0) + (lines.length - 1) * 70 };
    };
    const write = (worker: typeof workers[number], progress: number) => {
      const writing = worker.writing!;
      let distance = progress * writing.length;
      let line = writing.lines[0];
      let index = 0;
      for (; index < writing.lines.length - 1; index++) {
        line = writing.lines[index];
        if (distance <= line.width + 70) break;
        distance -= line.width + 70;
      }
      line = writing.lines[index];
      const x = line.x + Math.min(distance, line.width);
      // Completed lines remain visible; the current line ends at the pen nib.
      writing.part.style.clipPath = `polygon(0 0,100% 0,100% ${line.y}px,${x}px ${line.y}px,${x}px ${line.y + line.height + 1}px,0 ${line.y + line.height + 1}px)`;
      writing.part.style.opacity = '1';
      let penX = x;
      let penY = line.y + line.height * .82;
      if (distance > line.width && index + 1 < writing.lines.length) {
        const next = writing.lines[index + 1];
        const t = clamp((distance - line.width) / 70);
        penX += (next.x - x) * t;
        penY += (next.y + next.height * .82 - penY) * t - Math.sin(t * Math.PI) * 8;
      }
      worker.position = { x: writing.offset.x + penX, y: writing.offset.y + penY };
      worker.node.style.transform = `translate3d(${worker.position.x}px,${worker.position.y}px,0)`;
    };

    const tick = (now: number) => {
      frame = 0;
      if (!active) return;
      const allDone = queue.every(job => job.state === 'done');
      for (const worker of workers) {
        if (worker.phase === 'gone') continue;
        if (now < worker.spawnAt) {
          if (allDone) worker.phase = 'gone';
          continue;
        }
        if (!worker.job && worker.phase !== 'exit') {
          const job = readyJob();
          if (job) {
            job.state = 'working';
            worker.job = job;
            worker.hit = false;
            worker.phase = 'travel';
            worker.travel = 300 + random() * 420;
            worker.hesitate = 45 + random() * 180;
            worker.strike = 170 + random() * 75;
            worker.rest = 55 + random() * 170;
            worker.node.dataset.tool = job.action;
            equip(worker, job);
            worker.writing = prepareWriting(worker, job);
            const writing = worker.writing;
            const target = writing ? { x: writing.offset.x + writing.lines[0].x, y: writing.offset.y + writing.lines[0].y + writing.lines[0].height * .82 } : pointFor(job);
            if (writing) worker.strike = Math.max(700, Math.min(3200, writing.length * 2.4));
            makePath(worker, target, now);
            worker.roll = worker.to.x > element.offsetWidth * .8 ? 205 : worker.to.x < element.offsetWidth * .2 ? 150 : 140 + random() * 80;
            worker.node.dataset.job = String(job.id);
          } else if (allDone) {
            worker.phase = 'exit';
            worker.travel = 320 + random() * 350;
            makePath(worker, { x: worker.position.x + (worker.index % 2 ? 75 : -75), y: worker.position.y - 55 - random() * 45 }, now);
          } else {
            worker.node.style.opacity = '.6';
            worker.node.style.transform = `translate3d(${worker.position.x + Math.sin(now / 370 + worker.index) * 3}px,${worker.position.y + Math.cos(now / 430) * 3}px,0)`;
            worker.node.dataset.phase = 'waiting';
            continue;
          }
        }
        const elapsed = now - worker.started;
        move(worker, elapsed / worker.travel);
        worker.node.style.opacity = worker.phase === 'exit' ? String(1 - clamp(elapsed / worker.travel)) : String(clamp((now - worker.spawnAt) / 180));
        if (worker.phase === 'exit') {
          worker.node.dataset.phase = 'exit';
          if (elapsed >= worker.travel) { worker.phase = 'gone'; worker.node.style.opacity = '0'; }
          continue;
        }
        const strikeTime = elapsed - worker.travel - worker.hesitate;
        const strikeProgress = clamp(strikeTime / worker.strike);
        const phase = elapsed < worker.travel ? 'travel' : strikeTime < 0 ? 'aim' : 'strike';
        if (worker.node.dataset.phase !== phase) worker.node.dataset.phase = phase;
        const angle = worker.node.dataset.held === 'write' && worker.job?.action === 'place'
          ? Math.sin(strikeProgress * Math.PI * 4) * 10
          : Math.sin(strikeProgress * Math.PI) * (worker.job?.action === 'mine' ? -58 : -32);
        worker.wrist.style.rotate = `${angle}deg`;
        if (worker.writing && strikeTime >= 0 && !worker.hit) write(worker, strikeProgress);
        if (!worker.hit && strikeProgress >= (worker.writing ? 1 : .48) && worker.job) {
          worker.hit = true;
          install(worker.job, worker.job.action === 'place', !worker.writing);
          worker.job.state = 'done';
          element.style.setProperty('--shell-opacity', '1');
          impacts++;
          element.dataset.impacts = String(impacts);
          element.dataset.lastImpact = `${worker.job.kind}:${worker.job.slot}:${worker.job.action}`;
          worker.node.dataset.phase = 'impact';
          worker.node.dataset.hit = 'true';
          const sparks = worker.sparks;
          if (sparks) animations.push(sparks.animate(
            [{ opacity: 1, scale: '.3' }, { opacity: .85, scale: '1.1' }, { opacity: 0, scale: '1.8' }],
            { duration: 340, easing: 'steps(5)' },
          ));
        }
        if (worker.writing && worker.hit) {
          const writing = worker.writing;
          const last = writing.lines[writing.lines.length - 1];
          worker.position = { x: writing.offset.x + last.x + last.width, y: writing.offset.y + last.y + last.height * .82 };
          worker.node.style.transform = `translate3d(${worker.position.x}px,${worker.position.y}px,0)`;
        }
        if (elapsed >= worker.travel + worker.hesitate + worker.strike + worker.rest) {
          worker.job = null;
          worker.writing = null;
        }
      }
      if (queue.every(job => job.state === 'done') && workers.every(worker => worker.phase === 'gone')) complete();
      else frame = requestAnimationFrame(tick);
    };
    const begin = (nextMode: 'build' | 'repair') => {
      mode = nextMode;
      active = true;
      const base = [
        ...Array.from({ length: frameCount }, (_, slot) => ({ kind: 'frame' as const, slot })),
        ...parts.map((_, slot) => ({ kind: 'part' as const, slot })),
      ];
      for (let i = base.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [base[i], base[j]] = [base[j], base[i]];
      }
      queue = [];
      if (mode === 'build') {
        base.forEach(unit => queue.push({ ...unit, id: queue.length, action: 'place', state: 'pending' }));
      } else {
        base.slice(0, 2).forEach(unit => {
          const mineId = queue.length;
          queue.push({ ...unit, id: mineId, action: 'mine', state: 'pending' });
          queue.push({ ...unit, id: queue.length, action: 'place', after: mineId, state: 'pending' });
        });
      }
      element.dataset.buildState = 'building';
      if (!frameCount) element.style.setProperty('--shell-opacity', '1');
      site.style.opacity = '1';
      const now = performance.now();
      const componentDelay = 180 + random() * 1850;
      workers.forEach(worker => {
        worker.job = null;
        worker.writing = null;
        worker.phase = 'waiting';
        worker.spawnAt = now + componentDelay + worker.index * (420 + random() * 550);
        const edge = Math.floor(random() * 3);
        worker.position = {
          x: edge === 0 ? -40 : edge === 1 ? element.offsetWidth + 40 : element.offsetWidth * random(),
          y: edge === 2 ? -65 : element.offsetHeight * (.2 + random() * .6),
        };
        worker.node.style.opacity = '0';
        worker.node.dataset.hit = 'false';
        worker.roll = worker.index % 2 ? 203 + random() * 18 : 138 + random() * 24;
      });
      frame = requestAnimationFrame(tick);
    };
    const schedule = () => {
      const rect = element.getBoundingClientRect();
      visible = rect.bottom > (isHeader ? 0 : 80) && rect.top < window.innerHeight - 20;
      const delta = window.scrollY - previousY;
      if (Math.abs(delta) > 1) direction = delta < 0 ? -1 : 1;
      previousY = window.scrollY;
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
      const center = rect.top + Math.min(rect.height, window.innerHeight * .6) / 2;
      const central = visible && (isHeader || atBottom || (center <= window.innerHeight * .63
        && (center >= window.innerHeight * .25 || (kind === 'heading' && rect.top >= 80))));
      if (!active && central && (!built || (!isHeader && direction < 0 && performance.now() > repairAfter))) begin(built ? 'repair' : 'build');
    };
    const reveal = () => complete();
    const resize = new ResizeObserver(() => {
      // A reflow invalidates the cached writing lines. Finish this component
      // instead of repeatedly measuring moving text during the stroke.
      if (active && workers.some(worker => worker.writing)) complete();
      else schedule();
    });
    resize.observe(element);
    const updates = new MutationObserver(records => {
      if (records.some(record => record.target instanceof SVGElement)) {
        pixels = Array.from(body.querySelectorAll<SVGElement>('[data-build-frame]'));
        paintFrames();
      }
    });
    updates.observe(body, { childList: true, subtree: true });
    installedFrames.fill(false);
    paintFrames();
    parts.forEach(part => { part.style.opacity = '0'; });
    element.style.setProperty('--shell-opacity', '0');
    element.dataset.buildReady = 'true';
    element.dataset.buildState = 'waiting';
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    element.addEventListener('focusin', reveal);
    schedule();
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      animations.forEach(animation => animation.cancel());
      resize.disconnect();
      updates.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      element.removeEventListener('focusin', reveal);
      delete element.dataset.buildReady;
      delete element.dataset.buildState;
      element.style.removeProperty('--shell-opacity');
      parts.forEach(part => { part.style.opacity = ''; part.style.clipPath = ''; });
      pixels.forEach(pixel => { pixel.style.opacity = ''; });
      site.style.opacity = '0';
      workers.forEach(worker => { worker.node.style.opacity = '0'; });
    };
  }, [context?.enabled, count, kind, seed]);

  useEffect(() => {
    if (kind === 'heading') {
      setCount((root.current?.querySelectorAll('h2,h3,p,[data-build-writing-lines]').length || 0) > 1 ? 2 : 1);
    } else setCount(kind === 'chrome' || (root.current?.offsetWidth || 0) < 450 ? 2 : 3);
  }, [kind]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      element.toggleAttribute('data-build-offscreen', !entry.isIntersecting);
    }, { rootMargin: '80px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={root} className={`construction-piece ${className || ''}`} data-build-kind={kind} data-build-enabled={context?.enabled || undefined}>
      <div ref={content} className="construction-content">{children}</div>
      <div ref={worksite} className="construction-worksite" aria-hidden="true">
        <div className="construction-blueprint"><i /><i /><i /><i /></div>
        {Array.from({ length: count }, (_, i) => (
          <div className={`component-builder worker-${i}`} key={i}>
            <div className="builder-wrist">
              <MinecraftHand left={i % 2 === 1} />
              <HeldBlock />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="builder-tool" src="/images/minecraft/item/feather.png" alt="" width="34" height="34" />
            </div>
            <span className="builder-sparks"><i /><i /><i /><i /><i /></span>
            <span className="builder-nametag">RyuZU <span>#{String((seed + i) % 99).padStart(2, '0')}</span></span>
          </div>
        ))}
      </div>
    </Tag>
  );
}
