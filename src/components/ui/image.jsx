import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

function ImageComp({
    src,
    alt,
    width,
    height,
    className,
    fallbackSrc = "https://res.cloudinary.com/harshitjain/image/upload/v1758842491/evqlhcs8svxch3iygray.webp",
    ...props
}) {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <Image
            src={imgSrc}
            alt={alt}
            width={width}
            height={height}
            className={cn("select-none", className)}
            quality={100}
            draggable={false}
            loading="eager"
            fetchPriority="high"
            onError={() => fallbackSrc && setImgSrc(fallbackSrc)}
            {...props}
        />
    );
}

export { ImageComp };
