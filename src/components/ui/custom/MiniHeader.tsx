import { clsx } from "clsx";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

const headerVariants = cva(
    "tracking-[0.5rem] font-black italic text-gray-700",
    {
        variants: {
            size: {
                sm: "text-2xl sm:text-4xl sm:tracking-[0.75rem]",
                default: "text-4xl sm:text-6xl sm:tracking-[1rem]",
                lg: "text-5xl sm:text-7xl sm:tracking-[1.25rem]",
            },
            color: {
                default: "text-gray-700",
                primary: "text-primary",
                secondary: "text-secondary",
                white: "text-white",
            },
            align: {
                left: "text-left",
                center: "text-center",
                right: "text-right",
            }
        },
        defaultVariants: {
            size: "default",
            color: "default",
            align: "left"
        }
    }
);

interface MiniHeaderProps
    extends Omit<HTMLAttributes<HTMLHeadingElement>, "color">, // HTMLのcolorと競合しないようにする
        VariantProps<typeof headerVariants> {
    title: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    containerClassName?: string;
}

export default function MiniHeader({
                                       title,
                                       as: Component = 'h1',
                                       size,
                                       color,
                                       align,
                                       className,
                                       containerClassName,
                                       ...props
                                   }: MiniHeaderProps) {
    return (
        <div className={clsx("flex w-full pb-4", containerClassName)}>
            <Component
                className={clsx(
                    headerVariants({ size, color, align }),
                    className
                )}
                {...props}
            >
                {title}
            </Component>
        </div>
    );
}