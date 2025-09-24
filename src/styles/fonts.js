import { Figtree, Inter, Manrope } from "next/font/google";

const inter = Inter({
    preload: true,
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    adjustFontFallback: true,
    variable: "--Inter",
    fallback: ["system-ui", "sans-serif"],
});

const figtree = Figtree({
    preload: true,
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    adjustFontFallback: true,
    variable: "--Figtree",
    fallback: ["system-ui", "sans-serif"],
});

const manrope = Manrope({
    preload: true,
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700", "800"],
    adjustFontFallback: true,
    variable: "--Manrope",
    fallback: ["system-ui", "sans-serif"],
});

export { inter, figtree, manrope };
