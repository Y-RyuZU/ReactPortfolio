import SkillCard from "./SkillCard"

export interface Skill {
    title: string
    description: string
    iconUrl: string
    category: string
}

interface SkillsGridProps {
    skills: Skill[]
    selectedCategories: string[]
}

export default function SkillsGrid({skills, selectedCategories}: SkillsGridProps) {
    const filteredSkills = selectedCategories.length > 0
        ? skills.filter(skill => selectedCategories.includes(skill.category))
        : skills

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
                <SkillCard
                    key={skill.title}
                    title={skill.title}
                    description={skill.description}
                    iconUrl={skill.iconUrl}
                    size="md"
                />
            ))}
        </div>
    )
}