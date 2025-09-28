"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/headings";
import { Icons } from "@/shared/icons";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, memo, useState } from "react";

const LoginHeader = memo(() => (
    <div className="flex flex-col">
        <Heading size="h4" className="font-bold">
            <Icons.gavel size={32} /> CricAuction
        </Heading>
        <Heading size="h6" className="text-muted-foreground">
            Welcome back! Please sign in to continue.
        </Heading>
    </div>
));

LoginHeader.displayName = "LoginHeader";

function Page() {
    const { status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="flex h-dvh items-center justify-center">
                <Icons.loader2 className="text-muted-foreground animate-spin" />
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="mx-auto flex h-dvh max-w-sm flex-col justify-center gap-6">
                <LoginHeader />
                <Button
                    isLoading={loading || status === "loading"}
                    variant="outline"
                    size="md"
                    className="w-full"
                    onClick={() => {
                        setLoading(true);
                        signIn("google", { redirect: true, callbackUrl: "/" });
                    }}
                >
                    <Icons.loginGoogle />
                    Sign in with Google
                </Button>
            </div>
        );
    }

    return null;
}

export default Page;
