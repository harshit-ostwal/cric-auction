import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("", {
    variants: {
        size: {
            h1: "text-5xl font-bold lg:text-6xl xl:text-7xl",
            h2: "text-4xl font-bold lg:text-5xl",
            h3: "text-3xl font-semibold lg:text-4xl",
            h4: "text-2xl font-medium lg:text-3xl",
            h5: "text-lg md:text-xl lg:text-2xl",
            h6: "max-w-2xl text-base md:text-lg lg:text-xl",
            p: "max-w-2xl text-base md:text-lg",
            span: "text-base",
            small: "text-sm",
        },
    },
    defaultVariants: {
        size: "h1",
    },
});

export const Heading = ({ className, size = "h1", id, children, ...props }) => {
    const Tag = size === "p" ? "p" : size;
    return (
        <Tag
            className={cn(
                headingVariants({ size }),
                className,
                "inline-flex items-center gap-2"
            )}
            id={id}
            {...props}
        >
            {children}
        </Tag>
    );
};
