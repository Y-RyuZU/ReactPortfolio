import type {Config} from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import type { PluginAPI } from 'tailwindcss/types/config';


export default {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {

            },
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            keyframes: {
                'dialog-in': {
                    '0%': { opacity: '0', transform: 'translate(-50%, -50%) scale(0.8)', filter: 'blur(4px)' },
                    '100%': { opacity: '1', transform: 'translate(-50%, -50%) scale(1)', filter: 'blur(0px)' },
                },
                'dialog-out': {
                    '0%': { opacity: '1', transform: 'translate(-50%, -50%) scale(1)', filter: 'blur(0px)' },
                    '100%': { opacity: '0', transform: 'translate(-50%, -50%) scale(0.85)', filter: 'blur(4px)' },
                },
                'overlay-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'overlay-out': {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
            },
            animation: {
                'dialog-in': 'dialog-in 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                'dialog-out': 'dialog-out 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                'overlay-in': 'overlay-in 0.3s ease-out',
                'overlay-out': 'overlay-out 0.2s ease-in',
            },
        }
    },
    plugins: [
        tailwindcssAnimate,
        function({ addUtilities }: PluginAPI) {
            addUtilities({
                '.pixelated': {
                    'image-rendering': 'pixelated',
                },
            })
        },

    ],
} satisfies Config;
