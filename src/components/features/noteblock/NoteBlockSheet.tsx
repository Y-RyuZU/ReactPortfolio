'use client';

import { useState } from 'react';
import Image from 'next/image';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import NoteBlockPlayer from './NoteBlockPlayer';

export default function NoteBlockSheet() {
  const [open, setOpen] = useState(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      {/* Trigger button — same style as MinecraftClock */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'relative',
          'w-9 h-9 p-1',
          'rounded-md',
          'transition-all duration-200',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
        )}
        title="NoteBlock Studio"
      >
        <Image
          src="/images/minecraft/block/note_block.png"
          alt="NoteBlock Studio"
          width={24}
          height={24}
          className="mc-pixel mx-auto"
        />
      </button>

      <DialogPrimitive.Portal>
        {/* Transparent overlay — minimal dimming */}
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out"
        />

        {/* Fullscreen transparent dialog — square based on shorter dimension */}
        <DialogPrimitive.Content
          className={cn(
            'fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
            'bg-black/10 backdrop-blur-md backdrop-saturate-125',
            'border border-white/10 rounded-xl',
            'text-gray-200',
            'flex flex-col',
            'data-[state=open]:animate-dialog-in data-[state=closed]:animate-dialog-out',
            'overflow-hidden',
          )}
          style={{
            width: 'min(95vw, 95vh)',
            height: 'min(95vw, 95vh)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 shrink-0">
            <DialogPrimitive.Title className="text-white text-sm font-semibold flex items-center gap-2">
              <Image
                src="/images/minecraft/block/note_block.png"
                alt=""
                width={16}
                height={16}
                className="mc-pixel"
              />
              NoteBlock Studio
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className="rounded-sm opacity-70 transition-opacity hover:opacity-100 text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>

          {/* Content — no scroll */}
          <div className="flex-1 min-h-0 p-3">
            <NoteBlockPlayer />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
