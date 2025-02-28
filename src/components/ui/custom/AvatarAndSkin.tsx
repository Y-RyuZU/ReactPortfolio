import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Image from "next/image";
import {clsx} from "clsx";

interface AvatarAndSkinProps {
    avatarUrl: string
    skinUrl: string
    className?: string
}

export default function AvatarAndSkin({ avatarUrl, skinUrl, className }: AvatarAndSkinProps) {
    return (
        <div className={clsx("relative h-full w-auto aspect-[5/4]", className)}>
            <div className="
                        absolute
                        right-0
                        h-full
                        z-0
                        grid place-items-center
                    ">
                <Avatar className="h-full w-auto">
                    <AvatarImage
                        src={avatarUrl}
                        alt="Avatar Image"
                        loading="eager"
                    />
                    <AvatarFallback>RZ</AvatarFallback>
                </Avatar>
            </div>

            <div className="absolute bottom-0 h-[80%] aspect-[173/359] z-10">
                <Image
                    src={skinUrl}
                    alt="Skin Image"
                    className="object-contain w-full h-full"
                    fill
                    priority
                />
            </div>
        </div>
    )
}