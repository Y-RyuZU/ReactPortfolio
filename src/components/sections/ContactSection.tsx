import { styles } from '@/lib/styles';
import { CONTACT_LINKS } from '@/lib/constants/contacts';
import type { ContactLink } from '@/lib/types/common';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Mail, Github, Twitter } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

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
                <div className="text-center mb-16">
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
                </div>

                <div className="max-w-2xl mx-auto">
                    {/* Contact Links Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {CONTACT_LINKS.map((contact: ContactLink) => {
                            const Icon = iconMap[contact.type as keyof typeof iconMap] || iconMap.default;

                            return (
                                <GlassCard key={contact.id} className="hover:scale-[1.02] transition-all overflow-hidden" showHighlight={false} breakable={true}>
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
                            );
                        })}
                    </div>

                    {/* Quick Message */}
                    <GlassCard className="text-center p-8" breakable={true}>
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
                        <Link
                            href="mailto:contact@ryuzu.dev"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Mail className="w-4 h-4" />
                            Send Email
                        </Link>
                    </GlassCard>
                </div>
            </div>
        </section>
    );
}