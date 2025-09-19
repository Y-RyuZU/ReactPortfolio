'use client';

import {useState, useMemo, useEffect} from 'react';
import {useMinecraftTime} from '@/contexts/MinecraftTimeContext';
import Image from 'next/image';
import {cn} from '@/lib/utils';
import {X, Sun, Moon} from 'lucide-react';

/**
 * Minecraft clock UI component for time control
 * Displays a Minecraft clock that shows current time and allows manual control
 */
export default function MinecraftClock() {
    const {
        currentTimeOfDay,
        currentHour,
        currentMinute,
        isManualMode,
        setManualTime,
        toggleManualMode
    } = useMinecraftTime();

    const [isOpen, setIsOpen] = useState(false);
    const [tempHour, setTempHour] = useState(currentHour);

    // Update tempHour when currentHour changes (e.g., when toggling modes)
    useEffect(() => {
        setTempHour(currentHour);
    }, [currentHour]);

    // Calculate which clock frame to show (0-63)
    // Minecraft clock frames: 0=noon(12:00), 16=sunset(18:00), 32=midnight(0:00), 48=sunrise(6:00)
    const clockFrame = useMemo(() => {
        // 正午(12:00)を起点(フレーム0)として計算
        const adjustedHour = (currentHour - 12 + 24) % 24;
        const frame = Math.floor((adjustedHour / 24) * 64);
        return Math.min(63, Math.max(0, frame));
    }, [currentHour]);

    // Get the appropriate clock image
    const clockImage = `/images/minecraft/item/clock_${clockFrame.toString().padStart(2, '0')}.png`;



    return (
        <div className="relative">
            {/* Clock button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'relative',
                    'w-9 h-9 p-1',
                    'rounded-md',
                    'transition-all duration-200',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    'group',
                    isManualMode && 'ring-2 ring-yellow-500 ring-offset-1'
                )}
                title={`Time: ${tempHour.toString().padStart(2, '0')}:00 (${currentTimeOfDay})`}
            >
                <Image
                    src={clockImage}
                    alt="Minecraft Clock"
                    width={24}
                    height={24}
                    className="mc-pixel mx-auto"
                />

                {/* Manual mode indicator */}
                {isManualMode && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"/>
                )}
            </button>

            {/* Time control panel */}
            {isOpen && (
                <div
                    className="absolute top-12 right-0 z-50 w-80 p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md backdrop-saturate-150 border border-gray-200/30 dark:border-gray-700/30 rounded-lg shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
                            Time Control
                        </h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4"/>
                        </button>
                    </div>

                    {/* Current time display */}
                    <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded">
                        <div className="flex items-center justify-center gap-3">
                            <Image
                                src={clockImage}
                                alt="Clock"
                                width={32}
                                height={32}
                                className="mc-pixel"
                            />
                            <div>
                                <div className="text-2xl font-mono text-gray-900 dark:text-white">
                                    {tempHour.toString().padStart(2, '0')}:{currentMinute.toString().padStart(2, '0')}
                                </div>
                                <div className="text-xs text-gray-800 dark:text-gray-400 capitalize">
                                    {currentTimeOfDay}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Time slider with visual indicators */}
                    <div className="mb-4">
                        <label className="text-xs text-gray-800 dark:text-gray-400 block mb-2">
                            Time: {tempHour.toString().padStart(2, '0')}:00
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="23"
                            value={tempHour}
                            onChange={(e) => {
                                const hour = parseInt(e.target.value);
                                setTempHour(hour);
                                setManualTime(hour, 0);  // Update time in real-time while sliding
                            }}
                            className="w-full accent-yellow-500"
                        />
                        <div className="flex justify-between text-[10px] text-gray-700 dark:text-gray-400 mt-1">
                            <span>00:00</span>
                            <span>06:00</span>
                            <span>12:00</span>
                            <span>18:00</span>
                            <span>23:00</span>
                        </div>
                    </div>

                    {/* Control buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={toggleManualMode}
                            className={cn(
                                'flex-1 px-3 py-2 text-sm font-medium rounded transition-colors flex items-center justify-center gap-2',
                                isManualMode
                                    ? 'bg-gray-500 hover:bg-gray-400 text-white'
                                    : 'bg-blue-500 hover:bg-blue-400 text-white'
                            )}
                        >
                            {isManualMode ? (
                                <><Moon className="w-4 h-4"/> Manual Mode</>
                            ) : (
                                <><Sun className="w-4 h-4"/> System Time</>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}