import Link from "next/link";
import {Button} from "@/components/ui/button";

const items = [
    {text: "Home", link: "/"},
    {text: "About", link: "/about"},
    {text: "Works", link: "/works"},
    {text: "Contact", link: "/contact"},
]

export default function Header() {
    return (
        <header className="w-full py-4 px-8 bg-gray-100 dark:bg-gray-800 flex items-center shadow-md">
            <div className="flex justify-between mx-auto w-full max-w-screen-xl">
                <Button asChild>
                    <Link href="/public">
                        Portfolio
                    </Link>
                </Button>

                <nav className="flex gap-6 text-sm sm:text-base">
                    {items.map((item, index) => (
                        <Button asChild key={index}>
                            <Link href={item.text.toLowerCase()} className="hover:underline">
                                {item.text}
                            </Link>
                        </Button>
                    ))}
                </nav>
            </div>
        </header>
    );
}