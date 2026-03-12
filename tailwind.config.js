/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: "hsl(var(--primary))",
                "primary-foreground": "hsl(var(--primary-foreground))",
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                accent: {
                    red: "#E63946",
                    blue: "#457B9D",
                    glow: "rgba(230, 57, 70, 0.4)",
                },
                gray: {
                    900: "#121212",
                    800: "#242424",
                    100: "#F5F5F5",
                }
            },
            fontFamily: {
                sans: ["Manrope", "sans-serif"],
                serif: ["Playfair Display", "serif"],
            },
        },
    },
    plugins: [],
}
