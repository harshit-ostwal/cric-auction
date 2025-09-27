import { Icons } from "@/shared/icons";
import React from "react";

function Loading() {
    return (
        <div className="flex w-full items-center justify-center py-20">
            <Icons.loader2 className="animate-spin" />
        </div>
    );
}

export default Loading;
