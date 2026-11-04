'use client';

import { siteConfig } from "@/config/site";
import { styles } from "@/lib/styles";
import { useSmoothScroll } from "@/hooks";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { BuildPiece } from '@/components/motion/ScrollConstruction';

const MinecraftClock = dynamic(() => import('@/components/ui/minecraft-clock'), {
    ssr: false
});

const NoteBlockSheet = dynamic(() => import('@/components/features/noteblock/NoteBlockSheet'), {
    ssr: false
});

const navigationItems = [
    { href: '#about', text: 'About' },
    { href: '#skills', text: 'Skills' },
    { href: '#projects', text: 'Projects' },
    { href: '#contact', text: 'Contact' },
];

export default function Header() {
    const { scrollToSection, scrollToTop } = useSmoothScroll();

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        if (href === '/') {
            scrollToTop();
        } else {
            const sectionId = href.replace('#', '');
            scrollToSection(sectionId);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-sm border-b border-gray-200/20 dark:border-gray-800/20">
            <div className={`${styles.container} py-4`}>
                <BuildPiece kind="chrome">
                <div className="grid grid-cols-[auto_1fr] items-center gap-y-2 sm:flex sm:justify-between">
                    <Link
                        href="/"
                        onClick={(e) => handleNavClick(e, '/')}
                        className="text-lg font-medium text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
                    >
                        {siteConfig.author.penName}
                    </Link>

                    <div className="contents sm:flex sm:items-center sm:gap-6">
                        <nav className="col-span-2 row-start-2 flex justify-between gap-4 sm:gap-6">
                            {navigationItems.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={(e) => handleNavClick(e, item.href)}
                                    className="text-sm text-gray-800 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                                >
                                    {item.text}
                                </a>
                            ))}
                        </nav>
                        <div className="col-start-2 row-start-1 justify-self-end border-l border-gray-200 dark:border-gray-700 pl-6 flex items-center gap-2">
                            <div data-build-detail className="h-9 w-9"><MinecraftClock /></div>
                            <div data-build-detail className="h-9 w-9"><NoteBlockSheet /></div>
                        </div>
                    </div>
                </div>
                </BuildPiece>
            </div>
        </header>
    );
}
