"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

function Avatar({ className, rounded = true, ...props }) {
    return (
        <AvatarPrimitive.Root
            data-slot="avatar"
            className={cn(
                "relative flex size-12 shrink-0 overflow-hidden",
                rounded ? "rounded-full" : "rounded-md",
                className
            )}
            {...props}
        />
    );
}

function AvatarImage({ className, ...props }) {
    return (
        <AvatarPrimitive.Image
            data-slot="avatar-image"
            className={cn("aspect-square size-full object-cover", className)}
            {...props}
        />
    );
}

function AvatarFallback({ className, ...props }) {
    return (
        <AvatarPrimitive.Fallback
            data-slot="avatar-fallback"
            className={cn(
                "bg-muted flex size-full items-center justify-center rounded-full object-cover",
                className
            )}
            {...props}
        />
    );
}

export { Avatar, AvatarImage, AvatarFallback };
