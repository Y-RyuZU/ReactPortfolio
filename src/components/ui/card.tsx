'use client';

import * as React from "react"
import { useConstruction } from '@/components/motion/ScrollConstruction';
import { MinecraftGlassBorder } from './minecraft-glass-border';

import {cn} from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass';
}

const Card = React.forwardRef<
    HTMLDivElement,
    CardProps
>(({className, variant = 'default', children, ...props}, ref) => {
    const construction = useConstruction();
    const buildingGlass = variant === 'glass' && construction?.enabled;
    return (
    <div
        ref={ref}
        data-build-glass={buildingGlass || undefined}
        className={cn(
            variant === 'default' && "rounded-xl border bg-card text-card-foreground shadow",
            variant === 'glass' && "minecraft-glass",
            className
        )}
        {...props}
    >
        {buildingGlass && <MinecraftGlassBorder pixelSize={2} showHighlight={false} />}
        {children}
    </div>
    );
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
    <div
        ref={ref}
        className={cn("font-semibold leading-none tracking-tight", className)}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
    <div
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export {Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent}
