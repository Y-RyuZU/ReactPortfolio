import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Image from "next/image";


export default function Page() {
    return (
        <div className="w-full flex flex-col items-center py-4 px-8 gap-16">
            <div className="flex w-full max-w-6xl">
                <h1 className="text-6xl  font-black italic text-gray-700 text-6rem tracking-[1rem]">
                    About
                </h1>
            </div>

            <div className="w-full flex justify-center max-w-2xl">
                <div className="flex relative">
                    <Image src="/images/ryuzu.png" alt="avatar" width={16} height={128} className="absolute left-0"/>
                    <Avatar className="absolute right-0 w-128 h-128">
                        <AvatarImage src="https://github.com/Y-RyuZU.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    );
}