import { cn } from "@/lib/utils";
import Image from "next/image";

function ImageComp({ src, alt, width, height, className, ...props }) {
    return (
        <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={cn("select-none", className)}
            quality={100}
            draggable={false}
            loading="eager"
            fetchPriority="high"
            {...props}
        />
    );
}

export { ImageComp };
