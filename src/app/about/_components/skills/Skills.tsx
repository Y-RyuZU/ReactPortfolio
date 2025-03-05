import SkillsShowcase from "./SkillsShowcase"

// Skills data
const skills = [
    {
        title: "HTML",
        description: "命令規則を用いたコーディングを行えます。このポートフォリオはBEMを......スキルの説明スキルの説明スキルの説明",
        iconUrl: "/images/minecraft/item/diamond.png",
        category: "Frontend",
    },
    {
        title: "CSS",
        description: "命令規則を用いたコーディングを行えます。このポートフォリオはBEMを......スキルの説明スキルの説明スキルの説明",
        iconUrl: "/images/minecraft/item/iron_ingot.png",
        category: "Frontend",
    },
    {
        title: "TypeScript",
        description: "命令規則を用いたコーディングを行えます。このポートフォリオはBEMを......スキルの説明スキルの説明スキルの説明",
        iconUrl: "/images/minecraft/item/copper_ingot.png",
        category: "Frontend",
    },
    {
        title: "Java",
        description: "命令規則を用いたコーディングを行えます。このポートフォリオはBEMを......スキルの説明スキルの説明スキルの説明",
        iconUrl: "/images/minecraft/item/netherite_ingot.png",
        category: "Backend",
    },
    {
        title: "JavaScript",
        description: "命令規則を用いたコーディングを行えます。このポートフォリオはBEMを......スキルの説明スキルの説明スキルの説明",
        iconUrl: "/images/minecraft/item/copper_ingot.png",
        category: "Frontend",
    },
    {
        title: "Python",
        description: "命令規則を用いたコーディングを行えます。このポートフォリオはBEMを......スキルの説明スキルの説明スキルの説明",
        iconUrl: "/images/minecraft/item/gold_ingot.png",
        category: "Backend",
    },
    {
        title: "C",
        description: "命令規則を用いたコーディングを行えます。このポートフォリオはBEMを......スキルの説明スキルの説明スキルの説明",
        iconUrl: "/images/minecraft/item/diamond.png",
        category: "Desktop",
    },
    {
        title: "C++",
        description: "命令規則を用いたコーディングを行えます。このポートフォリオはBEMを......スキルの説明スキルの説明スキルの説明",
        iconUrl: "/images/minecraft/item/diamond.png",
        category: "Desktop",
    },
]

// Available categories
const categories = [
    "Backend",
    "Frontend",
    "Mobile",
    "Desktop",
    "On-premises",
    "Cloud",
]

interface SkillsComponentProps {
    initialSelectedCategories?: string[]
}

export default function Skills({ initialSelectedCategories = [] }: SkillsComponentProps) {
    return (
        <SkillsShowcase
            skills={skills}
            categories={categories}
            selectedCategories={initialSelectedCategories}
        />
    )
}

// データを外部からも使用できるようにエクスポート
export { skills, categories }