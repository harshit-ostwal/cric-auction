import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    {
        ignores: [
            "node_modules/**",
            ".next/**",
            "out/**",
            "build/**",
            "next-env.d.ts",
        ],
    },
    ...compat.extends("next/core-web-vitals", "prettier"),
    {
        files: ["**/*.{js,jsx}"],
        languageOptions: {
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: "module",
            },
        },
        rules: {
            "no-unused-vars": "warn",
            "no-console": "warn",
            "@next/next/no-document-import-in-page": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
            "@typescript-eslint/no-unused-vars": "off",
        },
    },
];

export default eslintConfig;
