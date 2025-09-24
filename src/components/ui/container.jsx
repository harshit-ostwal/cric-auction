import { cn } from "@/lib/utils";
import React from "react";

function Container({ children, className, ref }) {
    return (
        <section
            className={cn(
                className,
                "3xl:w-2/3 relative z-10 mx-auto w-11/12 2xl:w-3/4"
            )}
            ref={ref}
        >
            {children}
        </section>
    );
}

export default Container;
