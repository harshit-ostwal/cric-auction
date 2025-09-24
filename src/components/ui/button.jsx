import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Icons } from "@/shared/icons";

const buttonVariants = cva(
    "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 md:text-base [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs",
                destructive:
                    "bg-destructive hover:bg-destructive/85 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white shadow-xs",
                success:
                    "bg-green-500 text-white shadow-xs hover:bg-green-500/85 focus-visible:ring-green-500/20 dark:bg-green-500/60 dark:focus-visible:ring-green-500/40",
                outline:
                    "bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border shadow-xs",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs",
                ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
                link: "text-primary underline-offset-4 hover:underline",
                none: "",
            },
            size: {
                default: "h-10 px-6 py-2 has-[>svg]:px-2",
                sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
                md: "h-14 rounded-md px-2 has-[>svg]:px-3",
                lg: "h-16 rounded-md px-6 has-[>svg]:px-4 md:h-18",
                icon: "size-9",
                none: "",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

function Button({
    className,
    variant,
    size,
    asChild = false,
    isLoading = false,
    children,
    type,
    ...props
}) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            data-slot="button"
            type={type || "button"}
            className={cn(buttonVariants({ variant, size, className }))}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? <Icons.loader2 className="animate-spin" /> : children}
        </Comp>
    );
}

export { Button, buttonVariants };
