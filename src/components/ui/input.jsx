import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const inputVariants = cva(
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive focus-visible:border-ring focus-visible:ring-ring/50 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-border flex w-full min-w-0 rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            size: {
                default: "h-12 px-3 py-1 has-[>svg]:px-3",
                lg: "h-14 shadow-md has-[>svg]:px-4",
                xl: "h-16 px-4 py-2 has-[>svg]:px-5 md:text-lg",
            },
        },
        defaultVariants: {
            size: "default",
        },
    }
);

function Input({ className, type, placeholder, LeftIcon, size, ...props }) {
    return (
        <div className="relative h-fit w-full">
            {LeftIcon && (
                <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
                    <LeftIcon size={20} />
                </span>
            )}
            <input
                type={type ?? "text"}
                data-slot="input"
                placeholder={placeholder}
                className={cn(
                    inputVariants({ size, className }),
                    LeftIcon && "pl-10"
                )}
                {...props}
            />
        </div>
    );
}

export { Input };
