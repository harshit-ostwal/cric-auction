"use client";
import React from "react";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { QueryProvider } from "./QueryProvider";

export function SessionProvider({ children }) {
    return (
        <NextAuthSessionProvider>
            <QueryProvider>{children}</QueryProvider>
        </NextAuthSessionProvider>
    );
}

export default SessionProvider;
