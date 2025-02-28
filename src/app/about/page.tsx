import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Image from "next/image";
import AvatarAndSkin from "@/components/ui/custom/AvatarAndSkin";

const header1 = "所属"
const content1 = `
慶應義塾大学 環境情報学部 B1
アジ鯖 統括開発者
`

const header2 = "趣味"
const content2 = `
ゲーム / マインクラフト / プログラミング
`


export default function Page() {
    return (
        <div className="w-full h-[80vh] grid grid-rows-[auto,1fr] items-center py-8 px-8">
            <div className="flex w-full max-w-6xl">
                <h1 className="text-6xl font-black italic text-gray-700 text-6rem tracking-[1rem]">
                    About
                </h1>
            </div>


            <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 items-center justify-items-center gap-4 mx-auto">
                <div className="w-full max-w-xs mx-auto justify-self-end col-span-1">
                    <AvatarAndSkin
                        avatarUrl="https://github.com/Y-RyuZU.png"
                        skinUrl="/images/ryuzu.png"
                    />
                </div>

                <div className="grid grid-rows-[auto_1fr] gap-4 content-start w-full h-full col-span-1">
                    <div className="h-8 w-full">

                    </div>
                    <div className="relative w-full max-w-xl">
                        <Image
                            src="/images/nameplate.svg"
                            alt="Name Plate"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div>
                        <h3>
                            {header1}
                        </h3>
                        <div>
                            {content1}
                        </div>
                        <h3>
                            {header2}
                        </h3>
                        <div>
                            {content2}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}