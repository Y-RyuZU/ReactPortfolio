'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {SkillCard} from '@/components/features/skills/SkillCard';
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs';
import {useSkillCategories} from '@/hooks';
import {styles} from '@/lib/styles';
import Image from 'next/image';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';

interface SkillsSectionProps {
    id?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function SkillsSection({id = "skills"}: SkillsSectionProps) {
    const {
        categories,
        activeCategory,
        setActiveCategory
    } = useSkillCategories();

    return (
        <section id={id} className={styles.section.secondary}>
            <div className={styles.container}>
                {/* Header with Minecraft style */}
                <SectionReveal className="flex flex-col items-center justify-center mb-16">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 -m-3 bg-white/10 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg" />
                        <div className="relative">
                            <h2 className={styles.heading.section}>
                                <span className="inline-flex items-center gap-3">
                                    <Image
                                        src="/images/minecraft/item/spyglass.png"
                                        alt="Skills"
                                        width={32}
                                        height={32}
                                        className="mc-pixel"
                                    />
                                    Technical Skills
                                </span>
                            </h2>
                            <p className={styles.text.secondary}>
                                My full inventory of technical expertise
                            </p>
                        </div>
                    </div>
                </SectionReveal>

                {/* Category tabs using shadcn/ui */}
                <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}
                      className="w-full max-w-7xl mx-auto">
                    <StaggerGroup className="flex flex-wrap" stagger={0.04} delayChildren={0.05}>
                        <TabsList className="flex flex-wrap h-auto p-1 mb-8">
                            {categories.map(category => (
                                <StaggerItem key={category.id} y={8}>
                                    <TabsTrigger
                                        value={category.id}
                                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 flex items-center gap-2"
                                    >
                                        <Image
                                            src={category.icon || '/images/minecraft/item/iron_ingot.png'}
                                            alt={category.title}
                                            width={16}
                                            height={16}
                                            className="mc-pixel"
                                        />
                                        {category.title}
                                    </TabsTrigger>
                                </StaggerItem>
                            ))}
                        </TabsList>
                    </StaggerGroup>

                    {/* Dynamic content based on selected category */}
                    {categories.map(category => (
                        <TabsContent key={category.id} value={category.id} className="mt-0">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${category.id}-${activeCategory}`}
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    transition={{ duration: 0.25, ease: EASE }}
                                >
                                    {category.id === 'all' ? (
                                        // All skills view - show by categories
                                        categories.slice(1).map((cat, index) => (
                                            <div key={cat.id}>
                                                {index > 0 && (
                                                    <div className="my-8 border-t border-gray-200 dark:border-gray-700"/>
                                                )}
                                                <div className="mb-12">
                                                    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
                                                        <Image
                                                            src={cat.icon || '/images/minecraft/item/iron_ingot.png'}
                                                            alt={cat.title}
                                                            width={24}
                                                            height={24}
                                                            className="mc-pixel"
                                                        />
                                                        {cat.title}
                                                        <span className="text-sm text-gray-700 dark:text-gray-400">
                                                            ({cat.skills.length})
                                                        </span>
                                                    </h3>
                                                    <StaggerGroup
                                                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5"
                                                        stagger={0.03}
                                                        delayChildren={0.05}
                                                    >
                                                        {cat.skills.map(skill => (
                                                            <StaggerItem key={skill.name} y={16}>
                                                                <SkillCard
                                                                    skill={skill}
                                                                    showDetails={true}
                                                                    size="md"
                                                                />
                                                            </StaggerItem>
                                                        ))}
                                                    </StaggerGroup>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        // Single category view
                                        <div className="mb-12">
                                            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
                                                <Image
                                                    src={category.icon || '/images/minecraft/item/iron_ingot.png'}
                                                    alt={category.title}
                                                    width={24}
                                                    height={24}
                                                    className="mc-pixel"
                                                />
                                                {category.title}
                                                <span className="text-sm text-gray-700 dark:text-gray-400">
                                                    ({category.skills.length})
                                                </span>
                                            </h3>
                                            <StaggerGroup
                                                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5"
                                                stagger={0.03}
                                                delayChildren={0.05}
                                            >
                                                {category.skills.map(skill => (
                                                    <StaggerItem key={skill.name} y={16}>
                                                        <SkillCard
                                                            skill={skill}
                                                            showDetails={true}
                                                            size="md"
                                                        />
                                                    </StaggerItem>
                                                ))}
                                            </StaggerGroup>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    );
}
