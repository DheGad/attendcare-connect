import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // Family OS
                "family-primary": "#2dd4bf", // teal-400
                "family-bg": "#ecfdf5", // emerald-50
                // Hospital OS
                "hospital-primary": "#3b82f6", // blue-500
                "hospital-bg": "#eff6ff", // blue-50
                // Provider OS
                "provider-primary": "#1e3a8a", // blue-900
                "provider-bg": "#f8fafc", // slate-50
                // Workforce OS
                "workforce-primary": "#10b981", // emerald-500
                "workforce-bg": "#f0fdf4", // green-50
                // Regulator OS
                "regulator-primary": "#fbbf24", // amber-400
                "regulator-bg": "#fffbeb", // amber-50

                // Universal
                "glass-border": "rgba(255, 255, 255, 0.2)",
                "glass-bg": "rgba(255, 255, 255, 0.1)",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                display: ["var(--font-outfit)", "sans-serif"],
            },
        },
    },
    plugins: [],
};
export default config;
