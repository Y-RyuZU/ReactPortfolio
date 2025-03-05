import MiniHeader from "@/components/ui/custom/MiniHeader";
import AvatarAndSkin from "@/components/ui/custom/AvatarAndSkin";
import Image from "next/image";

const header1 = "所属"
const content1 = `
慶應義塾大学 環境情報学部 B1
アジ鯖 統括開発者
`

const header2 = "趣味"
const content2 = `
ゲーム / マインクラフト / プログラミング
`

export default function Profile() {
    return (
        <div className="w-full h-[80vh] md:h-[70vh] grid grid-rows-[auto,1fr] items-center py-8 px-8">
            <MiniHeader title="About" />

            <div className="w-full h-full grid grid-cols-1 md:grid-cols-[1fr,2fr] items-center justify-items-center gap-2 md:gap-8 mx-auto">
                <div className="md:w-full max-md:h-full self-start md:mt-4 md:px-8">
                    <AvatarAndSkin
                        avatarUrl="https://github.com/Y-RyuZU.png"
                        skinUrl="/images/ryuzu.png"
                    />
                </div>

                <div className="gap-4 content-start w-full h-full">
                    <div className="sm:h-8 h-4 w-full">

                    </div>
                    <div className="relative w-full h-[50%]">
                        <Image
                            src="/images/nameplate.svg"
                            alt="Name Plate"
                            fill
                            className="object-contain md:object-left"
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