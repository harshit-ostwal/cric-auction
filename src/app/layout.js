import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import SessionProvider from "@/providers/SessionProvider";
import { manrope, figtree, inter } from "@/styles/fonts";
import "@/styles/globals.css";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

// export const metadata = {
//     title: {
//         default: "Next JS Starter",
//         template: "%s | Next JS Starter",
//     },
//     description: "",
//     keywords: [],
//     metadataBase: new URL(""),
//     alternates: {
//         canonical: "0",
//     },
//     openGraph: {
//         title: "",
//         description: "",
//         url: "0",
//         siteName: "0",
//         locale: "en_US",
//         type: "website",
//         images: [
//             {
//                 url: "0",
//                 width: 0,
//                 height: 0,
//                 alt: "",
//             },
//         ],
//     },
//     twitter: {
//         card: "",
//         title: "",
//         description: "",
//         images: [
//             {
//                 url: "",
//                 width: 0,
//                 height: 0,
//                 alt: "",
//             },
//         ],
//     },
//     icons: {
//         icon: "/favicon.ico",
//         apple: "/favicon.ico",
//     },
// };

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <GoogleTagManager gtmId="" />
            <GoogleAnalytics gaId="" />

            <body
                className={cn(
                    manrope.variable,
                    figtree.variable,
                    inter.variable,
                    "font-Figtree tracking-tighter antialiased"
                )}
            >
                <SessionProvider>{children}</SessionProvider>
                <Toaster
                    richColors
                    theme="light"
                    closeButton
                    expand
                    position="top-right"
                    dir="auto"
                    gap={20}
                />
            </body>
        </html>
    );
}
