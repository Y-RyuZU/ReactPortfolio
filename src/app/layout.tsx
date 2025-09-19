import type {Metadata} from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/app/providers";
import { MinecraftTimeProvider } from '@/contexts/MinecraftTimeContext';
import MinecraftBackground from '@/components/features/background/MinecraftBackground';
import { ThemeAutoSyncProvider } from '@/components/providers/ThemeAutoSyncProvider';

export const metadata: Metadata = {
    title: siteConfig.name,
    description: siteConfig.description,
};

export default function RootLayout({children,}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja" suppressHydrationWarning>
        <body className="antialiased min-h-screen flex flex-col font-sans">
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
        >
            <MinecraftTimeProvider>
                <ThemeAutoSyncProvider>
                    <MinecraftBackground opacity={0.6} blur={0} />
                    <Header />
                    <main className="flex-1">
                        {children}
                    </main>
                    <Footer />
                </ThemeAutoSyncProvider>
            </MinecraftTimeProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
