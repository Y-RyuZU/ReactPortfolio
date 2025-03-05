import { HTMLAttributes } from "react"
import Image from "next/image"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

// Define variants for icon sizes with pixel values
const ICON_SIZES = {
    sm: 32,  // w-8 = 32px
    md: 48,  // w-12 = 48px
    lg: 64,  // w-16 = 64px
} as const

// Define variants for icon sizes
export const iconVariants = cva("", {
    variants: {
        size: {
            sm: "w-8 h-8",
            md: "w-12 h-12",
            lg: "w-16 h-16",
        },
    },
    defaultVariants: {
        size: "md",
    },
})

// SkillCard component interface
export interface SkillCardProps
    extends HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof iconVariants> {
    title: string
    description: string
    iconUrl: string
    size?: VariantProps<typeof iconVariants>["size"]
    highlighted?: boolean
}

export default function SkillCard({
                                      className,
                                      title,
                                      description,
                                      iconUrl,
                                      size = "md",
                                      highlighted = false,
                                      ...props
                                  }: SkillCardProps) {
    const iconSize = ICON_SIZES[size || "md"]

    return (
        <Card
            className={cn(
                "transition-all duration-200 hover:shadow-lg",
                highlighted && "border-primary border-2",
                className
            )}
            {...props}
        >
            <CardContent className="flex items-start p-6">
                <Image
                    src={iconUrl}
                    alt={`${title} icon`}
                    width={iconSize}
                    height={iconSize}
                    className="mr-3"
                />
                <div>
                    <h3 className="text-xl font-bold mb-2">{title}</h3>
                    <p className="text-gray-600 text-sm">{description}</p>
                </div>
            </CardContent>
        </Card>
    )
}