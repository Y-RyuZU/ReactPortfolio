import Image from "next/image";
import { styles } from "@/lib/styles";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";

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

export default function AboutSection({ id = "about" }: AboutSectionProps) {
    return (
        <section id={id} className={styles.section.primary}>
            <div className={styles.container}>
                <div className="mb-16 text-center">
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
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
                    {/* Minecraft Avatar Section */}
                    <div className="flex flex-col items-center space-y-6">
                        {/* GitHub Avatar with Minecraft glass frame */}
                        <GlassCard className="p-6" showHighlight={false} breakable={true}>
                            <Image
                                src="https://github.com/Y-RyuZU.png"
                                alt="RyuZU"
                                width={200}
                                height={200}
                                className="rounded-lg"
                            />
                        </GlassCard>

                        {/* Minecraft Skin */}
                        <GlassCard className="p-4" showHighlight={false} breakable={true}>
                            <Image
                                src="/images/ryuzu.png"
                                alt="Minecraft Skin"
                                width={128}
                                height={128}
                                className="mc-pixel"
                            />
                        </GlassCard>
                    </div>

                    {/* Profile Content */}
                    <div className="space-y-8">
                        {/* Name and Title */}
                        <div className="space-y-4">
                            <div className="relative">
                                <Image
                                    src="/images/nameplate.svg"
                                    alt="Name Plate"
                                    width={400}
                                    height={100}
                                    className="w-full max-w-md"
                                    priority
                                />
                            </div>
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
                        </div>

                        {/* Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Affiliation Card */}
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

                            {/* Hobbies Card */}
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
                        </div>

                        {/* Experience Timeline */}
                        <div className="space-y-4">
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
                            <div className="space-y-3 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
                                <div className="relative -left-[9px]">
                                    <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-900" />
                                    <div className="ml-6 -mt-4">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">2015 - Started Programming</p>
                                        <p className="text-sm text-gray-800 dark:text-gray-400">Minecraft at age 10</p>
                                    </div>
                                </div>
                                <div className="relative -left-[9px]">
                                    <div className="w-4 h-4 rounded-full bg-purple-500 border-2 border-white dark:border-gray-900" />
                                    <div className="ml-6 -mt-4">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">2025.04 - Keio University</p>
                                        <p className="text-sm text-gray-800 dark:text-gray-400">SFC Environment and Information Studies</p>
                                    </div>
                                </div>
                                <div className="relative -left-[9px]">
                                    <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white dark:border-gray-900" />
                                    <div className="ml-6 -mt-4">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">2025.08 - Astar Works</p>
                                        <p className="text-sm text-gray-800 dark:text-gray-400">Founded Legal DX Company</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}