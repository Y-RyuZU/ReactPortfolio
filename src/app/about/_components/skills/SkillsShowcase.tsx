import { Suspense } from "react"
import Image from "next/image"
import SkillsGrid, { type Skill } from "./SkillsGrid"
import CategoryFilter from "./CategoryFilter"

interface SkillsShowcaseProps {
    skills: Skill[]
    categories: string[]
    selectedCategories: string[]
}

export default function SkillsShowcase({
                                           skills,
                                           categories,
                                           selectedCategories
                                       }: SkillsShowcaseProps) {
    return (
        <div className="container mx-auto py-12 px-4">
            <div className="flex items-center mb-6">
                <Image
                    src="/images/minecraft/item/spyglass.png"
                    alt="Skills icon"
                    width={24}
                    height={24}
                    className="mr-2"
                />
                <h2 className="text-2xl font-bold">VIEW SKILLS</h2>
            </div>

            <CategoryFilter
                categories={categories}
                defaultSelected={selectedCategories}
            />

            <Suspense fallback={<div className="py-8 text-center">Loading skills...</div>}>
                <SkillsGrid
                    skills={skills}
                    selectedCategories={selectedCategories}
                />
            </Suspense>
        </div>
    )
}