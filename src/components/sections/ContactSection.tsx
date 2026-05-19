'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { styles } from '@/lib/styles';
import { CONTACT_LINKS } from '@/lib/constants/contacts';
import type { ContactLink } from '@/lib/types/common';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Mail, Github, Twitter } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { MotionCard } from '@/components/motion/MotionCard';
import { IdleCharacter } from '@/components/decorative/IdleCharacter';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ContactSectionProps {
    id?: string;
}

// Icon mapping for contact types
const iconMap = {
    github: Github,
    twitter: Twitter,
    email: Mail,
    default: ExternalLink,
};

export default function ContactSection({ id = "contact" }: ContactSectionProps) {
    return (
        <section id={id} className={styles.section.secondary}>
            <div className={styles.container}>
                <SectionReveal className="text-center mb-16">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 -m-3 bg-white/10 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg" />
                        <div className="relative">
                            <h2 className={styles.heading.section}>
                                <span className="inline-flex items-center gap-3">
                                    <Image
                                        src="/images/minecraft/item/ender_pearl.png"
                                        alt="Contact"
                                        width={32}
                                        height={32}
                                        className="mc-pixel"
                                    />
                                    Get in Touch
                                </span>
                            </h2>
                            <p className={styles.text.secondary}>
                                Feel free to reach out for collaborations or just a friendly hello
                            </p>
                        </div>
                    </div>
                </SectionReveal>

                <div className="max-w-2xl mx-auto">
                    {/* Contact Links Grid */}
                    <StaggerGroup
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
                        stagger={0.1}
                        delayChildren={0.05}
                    >
                        {CONTACT_LINKS.map((contact: ContactLink) => {
                            const Icon = iconMap[contact.type as keyof typeof iconMap] || iconMap.default;

                            return (
                                <StaggerItem key={contact.id}>
                                    <MotionCard>
                                        <GlassCard className="overflow-hidden" showHighlight={false} breakable={true}>
                                            <Link
                                                href={contact.href}
                                                target={contact.external ? '_blank' : undefined}
                                                rel={contact.external ? 'noopener noreferrer' : undefined}
                                                className="group block p-4"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded bg-gray-100/50 dark:bg-gray-700/50 group-hover:bg-gray-200/50 dark:group-hover:bg-gray-600/50 transition-colors backdrop-blur-sm">
                                                        <Icon className="w-5 h-5 text-gray-800 dark:text-gray-300" />
                                                    </div>
                                                    <div className="flex-1">
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {contact.label}
                                                    </p>
                                                    {contact.available ? (
                                                        <p className="text-sm text-gray-800 dark:text-gray-400">
                                                            Available
                                                        </p>
                                                    ) : (
                                                        <p className="text-sm text-gray-600 dark:text-gray-500">
                                                            Not Available
                                                        </p>
                                                    )}
                                                    </div>
                                                    <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors" />
                                                </div>
                                            </Link>
                                        </GlassCard>
                                    </MotionCard>
                                </StaggerItem>
                            );
                        })}
                    </StaggerGroup>

                    {/* Quick Message */}
                    <SectionReveal delay={0.2} y={32}>
                        <div className="relative">
                            {/* Sitting character — perched on the top-right edge of the CTA card (lg+) */}
                            <div
                                className="hidden lg:block absolute -top-24 right-2 z-20 pointer-events-none"
                                aria-hidden="true"
                            >
                                <IdleCharacter pose="sitting" width={110} />
                            </div>

                            <GlassCard className="text-center p-8 relative" breakable={true}>
                                <Image
                                    src="/images/minecraft/item/writable_book.png"
                                    alt="Message"
                                    width={48}
                                    height={48}
                                    className="mc-pixel mx-auto mb-4"
                                />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    Open for Opportunities
                                </h3>
                                <p className="text-sm text-gray-800 dark:text-gray-400 mb-4 max-w-md mx-auto">
                                    I&apos;m currently looking for new opportunities and interesting projects.
                                    Whether you have a question or just want to say hi, my inbox is always open!
                                </p>
                                <SendEmailButton />
                            </GlassCard>
                        </div>
                    </SectionReveal>
                </div>
            </div>
        </section>
    );
}

/** "Ender pearl" sparkle burst on hover around the Send Email CTA. */
function SendEmailButton() {
    const reduced = useReducedMotion();
    // Deterministic sparkle positions so SSR matches CSR (no Math.random).
    const sparkles = useMemo(
        () =>
            Array.from({ length: 6 }, (_, i) => {
                const angle = (i / 6) * Math.PI * 2;
                return {
                    x: Math.cos(angle) * 60,
                    y: Math.sin(angle) * 40,
                    delay: i * 0.04,
                };
            }),
        []
    );

    return (
        <motion.div className="relative inline-block" initial="rest" whileHover="hover" animate="rest">
            <Link
                href="mailto:contact@ryuzu.dev"
                className="relative z-10 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                <Mail className="w-4 h-4" />
                Send Email
            </Link>
            {!reduced &&
                sparkles.map((s, i) => (
                    <motion.span
                        key={i}
                        aria-hidden="true"
                        className="pointer-events-none absolute left-1/2 top-1/2 -ml-1 -mt-1 h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.85)]"
                        variants={{
                            rest: { x: 0, y: 0, opacity: 0, scale: 0.5 },
                            hover: {
                                x: s.x,
                                y: s.y,
                                opacity: [0, 1, 0],
                                scale: [0.5, 1.4, 0.6],
                                transition: { duration: 0.7, delay: s.delay, ease: 'easeOut' },
                            },
                        }}
                    />
                ))}
        </motion.div>
    );
}
