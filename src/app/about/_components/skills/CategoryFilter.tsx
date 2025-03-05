"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp } from "lucide-react"

interface CategoryFilterProps {
    categories: string[]
    defaultSelected?: string[]
}

export default function CategoryFilter({
                                   categories,
                                   defaultSelected = []
                               }: CategoryFilterProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isOpen, setIsOpen] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState<string[]>(defaultSelected)

    // Update URL when selection changes
    useEffect(() => {
        const params = new URLSearchParams(searchParams)

        if (selectedCategories.length === 0) {
            params.delete("categories")
        } else {
            params.set("categories", selectedCategories.join(","))
        }

        router.push(`?${params.toString()}`, { scroll: false })
    }, [selectedCategories, router, searchParams])

    const handleCategoryChange = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Mobile dropdown */}
            <div className="lg:hidden relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-4 border rounded-md text-left"
                >
                    <span>Your favorite hobbies</span>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 p-4 border rounded-md bg-white z-10">
                        {categories.map((category) => (
                            <div key={category} className="flex items-center space-x-2 mb-2">
                                <Checkbox
                                    id={`mobile-${category}`}
                                    checked={selectedCategories.includes(category)}
                                    onCheckedChange={() => handleCategoryChange(category)}
                                />
                                <Label
                                    htmlFor={`mobile-${category}`}
                                    className="text-sm"
                                >
                                    {category}
                                </Label>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Desktop dropdown */}
            <div className="hidden lg:block">
                <DropdownMenu>
                    <DropdownMenuTrigger className="w-full flex items-center justify-between p-4 border rounded-md focus:outline-none">
                        <span>Your favorite hobbies</span>
                        <ChevronDown size={20} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56"></DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Desktop checkboxes */}
            <div className="hidden lg:block border rounded-md p-4 relative">
                <div className="absolute right-4 top-4">
                    <ChevronUp size={20} />
                </div>
                <div className="space-y-4">
                    {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                                id={`desktop-${category}`}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={() => handleCategoryChange(category)}
                            />
                            <Label
                                htmlFor={`desktop-${category}`}
                                className="text-sm"
                            >
                                {category}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}