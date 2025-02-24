import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface SkillCardProps {
    title: string
    description: string
    iconUrl: string
}

export default function SkillCard({ title, description, iconUrl }: SkillCardProps) {
    return (
        <Card className="w-full max-w-md overflow-hidden transition-shadow hover:shadow-lg">
            <CardContent className="p-6">
                <div className="flex items-start gap-2">
                    <div className="relative h-8 w-8">
                        <Image
                            src={iconUrl || "/placeholder.svg"}
                            alt={`${title} icon`}
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{title}</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}

