'use client';

import { siteConfig } from "@/config/site";
import { styles } from "@/lib/styles";
import { useSmoothScroll } from "@/hooks";
import Link from "next/link";
import dynamic from 'next/dynamic';

const MinecraftClock = dynamic(() => import('@/components/ui/minecraft-clock'), {
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
                <div className="flex justify-between items-center">
                    <Link
                        href="/"
                        onClick={(e) => handleNavClick(e, '/')}
                        className="text-lg font-medium text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
                    >
                        {siteConfig.author.penName}
                    </Link>

                    <div className="flex items-center gap-6">
                        <nav className="flex gap-6">
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
                        <div className="border-l border-gray-200 dark:border-gray-700 pl-6">
                            <MinecraftClock />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}