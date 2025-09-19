'use client';

import { useSmoothScroll, useScrollSpy } from '@/hooks';
import { cn } from '@/lib/utils';

const sections = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export default function ScrollNav() {
  const { scrollToSection } = useSmoothScroll();
  const activeSection = useScrollSpy(sections.map(s => s.id));

  return (
    <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
      <ul className="space-y-3">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "group flex items-center justify-end gap-2 transition-all",
                activeSection === section.id && "scale-110"
              )}
              aria-label={`Navigate to ${section.label}`}
            >
              <span className={cn(
                "text-xs font-medium opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0",
                activeSection === section.id && "opacity-100 translate-x-0 text-blue-600 dark:text-blue-400"
              )}>
                {section.label}
              </span>
              <span
                className={cn(
                  "block w-2 h-2 rounded-full transition-all",
                  activeSection === section.id
                    ? "w-8 bg-blue-600 dark:bg-blue-400"
                    : "bg-gray-400 dark:bg-gray-600 group-hover:bg-gray-600 dark:group-hover:bg-gray-400"
                )}
              />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}