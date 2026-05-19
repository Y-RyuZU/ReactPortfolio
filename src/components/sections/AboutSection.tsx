'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { styles } from "@/lib/styles";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { MotionCard } from "@/components/motion/MotionCard";
import { MotionNumber } from "@/components/motion/MotionNumber";
import { IdleCharacter } from "@/components/decorative/IdleCharacter";
import { PettableSkin } from "@/components/decorative/PettableSkin";

const header1 = "所属"
const content1 = `
慶應義塾大学 環境情報学部 B1
アジ鯖 統括開発者
`

const header2 = "趣味"
const content2 = `
ゲーム / マインクラフト / プログラミング
`

interface AboutSectionProps {
    id?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AboutSection({ id = "about" }: AboutSectionProps) {
    return (
        <section id={id} className={styles.section.primary}>
            <div className={styles.container}>
                <SectionReveal className="mb-16 text-center">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 -m-3 bg-white/10 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg" />
                        <h2 className={`${styles.heading.section} mb-2 relative`}>
                            <span className="inline-flex items-center gap-3">
                                <Image
                                    src="/images/minecraft/item/writable_book.png"
                                    alt="About"
                                    width={32}
                                    height={32}
                                    className="mc-pixel"
                                />
                                About Me
                            </span>
                        </h2>
                    </div>
                </SectionReveal>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
                    {/* Minecraft Avatar Section */}
                    <StaggerGroup className="flex flex-col items-center space-y-6" stagger={0.15} delayChildren={0.05}>
                        {/* GitHub Avatar with Minecraft glass frame */}
                        <StaggerItem>
                            <GlassCard className="p-6" showHighlight={false} breakable={true}>
                                <Image
                                    src="https://github.com/Y-RyuZU.png"
                                    alt="RyuZU"
                                    width={200}
                                    height={200}
                                    className="rounded-lg"
                                />
                            </GlassCard>
                        </StaggerItem>

                        {/* Minecraft Skin — pettable on hover */}
                        <StaggerItem>
                            <PettableSkin
                                src="/images/ryuzu.png"
                                alt="Minecraft Skin"
                                width={128}
                                height={262}
                                sizeClass="w-32"
                            />
                        </StaggerItem>
                    </StaggerGroup>

                    {/* Profile Content */}
                    <div className="relative space-y-8">
                        {/* Name and Title */}
                        <div className="space-y-4">
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-10% 0px' }}
                                transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                            >
                                <Image
                                    src="/images/nameplate.svg"
                                    alt="Name Plate"
                                    width={400}
                                    height={100}
                                    className="w-full max-w-md"
                                    priority
                                />
                            </motion.div>
                            <SectionReveal delay={0.4} y={16}>
                                <div className="relative">
                                    <div className="absolute inset-0 -m-2 bg-white/10 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg" />
                                    <div className="relative space-y-2 p-2">
                                        <p className="text-lg text-gray-800 dark:text-gray-400">
                                            Full-Stack Developer & Minecraft Plugin Developer
                                        </p>
                                        <p className="text-base text-gray-900 dark:text-gray-300">
                                            株式会社AstarWorks 代表
                                        </p>
                                    </div>
                                </div>
                            </SectionReveal>
                        </div>

                        {/* Info Cards */}
                        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4" stagger={0.1}>
                            {/* Affiliation Card */}
                            <StaggerItem>
                                <MotionCard>
                                    <GlassCard className="overflow-hidden" showHighlight={false} breakable={true}>
                                        <GlassCardContent className="p-4 space-y-2">
                                            <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                                <Image
                                                    src="/images/minecraft/item/book.png"
                                                    alt="Education"
                                                    width={20}
                                                    height={20}
                                                    className="mc-pixel"
                                                />
                                                {header1}
                                            </h3>
                                            <p className="text-sm text-gray-800 dark:text-gray-400 whitespace-pre-line">
                                                {content1}
                                            </p>
                                        </GlassCardContent>
                                    </GlassCard>
                                </MotionCard>
                            </StaggerItem>

                            {/* Hobbies Card */}
                            <StaggerItem>
                                <MotionCard>
                                    <GlassCard className="overflow-hidden" showHighlight={false} breakable={true}>
                                        <GlassCardContent className="p-4 space-y-2">
                                            <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                                <Image
                                                    src="/images/minecraft/item/golden_apple.png"
                                                    alt="Hobbies"
                                                    width={20}
                                                    height={20}
                                                    className="mc-pixel"
                                                />
                                                {header2}
                                            </h3>
                                            <p className="text-sm text-gray-800 dark:text-gray-400">
                                                {content2}
                                            </p>
                                        </GlassCardContent>
                                    </GlassCard>
                                </MotionCard>
                            </StaggerItem>
                        </StaggerGroup>

                        {/* Experience Timeline */}
                        <div className="space-y-4">
                            <SectionReveal y={12}>
                                <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                    <Image
                                        src="/images/minecraft/item/clock_00.png"
                                        alt="Experience"
                                        width={20}
                                        height={20}
                                        className="mc-pixel"
                                    />
                                    Experience Timeline
                                </h3>
                            </SectionReveal>
                            <div className="relative pl-6">
                                <motion.div
                                    className="absolute left-0 top-0 bottom-0 w-[2px] bg-gray-200 dark:bg-gray-700 origin-top"
                                    initial={{ scaleY: 0 }}
                                    whileInView={{ scaleY: 1 }}
                                    viewport={{ once: true, margin: '-10% 0px' }}
                                    transition={{ duration: 0.8, ease: EASE }}
                                />
                                <StaggerGroup className="space-y-3" stagger={0.2} delayChildren={0.3}>
                                    <TimelineEntry color="bg-green-500" year={2015} title="Started Programming" sub="Minecraft at age 10" />
                                    <TimelineEntry color="bg-purple-500" year={2025} monthSuffix=".04" title="Keio University" sub="SFC Environment and Information Studies" />
                                    <TimelineEntry color="bg-blue-500" year={2025} monthSuffix=".08" title="Astar Works" sub="Founded Legal DX Company" />
                                </StaggerGroup>
                            </div>
                        </div>

                        {/* Waving character — peeks in at the bottom-right of the right column on lg+ */}
                        <div className="hidden lg:block absolute -right-2 -bottom-10 pointer-events-none" aria-hidden="true">
                            <IdleCharacter pose="waving" width={150} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

interface TimelineEntryProps {
    color: string;
    year: number;
    monthSuffix?: string;
    title: string;
    sub: string;
}

function TimelineEntry({ color, year, monthSuffix = '', title, sub }: TimelineEntryProps) {
    return (
        <StaggerItem>
            <div className="relative -left-[15px]">
                <motion.div
                    className={`w-4 h-4 rounded-full ${color} border-2 border-white dark:border-gray-900`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: [0, 1.3, 1] }}
                    viewport={{ once: true, margin: '-10% 0px' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
                <div className="ml-6 -mt-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        <MotionNumber value={year} suffix={monthSuffix} duration={1.0} /> - {title}
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-400">{sub}</p>
                </div>
            </div>
        </StaggerItem>
    );
}
