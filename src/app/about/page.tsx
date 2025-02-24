import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Image from "next/image";


export default function Page() {
    return (
        <div className="w-full h-[70vh] flex flex-col items-center py-4 px-4 gap-16">
            <div className="flex w-full max-w-6xl">
                <h1 className="text-6xl font-black italic text-gray-700 text-6rem tracking-[1rem]">
                    About
                </h1>
            </div>

            <div className="relative w-full h-full flex justify-center items-center gap-16 py-8 sm:py-16">
                <div className="relative w-[60vw] h-[50vw] max-w-[38rem] max-h-[32rem]">
                    <div className="
                        absolute
                        right-0
                        h-full
                        z-0
                        flex items-center justify-center
                    ">
                        <Avatar className="w-full h-full">
                            <AvatarImage
                                src="https://github.com/Y-RyuZU.png"
                                alt="@shadcn"
                                className="object-contain"
                                loading="eager"
                            />
                            <AvatarFallback>RZ</AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="absolute bottom-0 h-[80%] aspect-[173/359] z-10">
                        <Image
                            src="/images/ryuzu.png"
                            alt="Self Image"
                            className="object-contain w-full h-full"
                            fill
                            sizes="(max-width: 640px) 60vw, (max-width: 1024px) 60vw, 48rem"
                            priority
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4 h-full w-[40vw] justify-start">
                    <div className="h-[2rem] w-full">

                    </div>
                    <div className="relative w-full h-[70%]">
                        <Image
                            src="/images/nameplate.svg"
                            alt="Name Plate"
                            fill
                            className="object-contain w-full h-[70%]"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}