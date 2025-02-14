/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./app/global.css",
    ],
    theme: {
        extend: {
            fontFamily: {
                MonaSans: ['"Mona-Sans"', "sans-serif"],
                MonaSansWide: ['"Mona-Sans-Wide"', "sans-serif"],
            },
            colors: {
                grey: "#f2f2f2",
                "dark-grey": "#111111",
                "dark-grey-2": "#222222",

                "container-grey": "#313131",
                "container-grey-20": "#464646",
                "text-grey": "#717171",
                "purple-grey": "#adadbc",

                "primary-color": "#8133f1",
                "primary-color-sub": "#ceb0fa",
                "primary-color-sub-50": "#efe6fd",
                "secondary-color": "#fee755",
                "grey-bg": "#f4f1f1",
                "grey-3": "#828282",

                "success-color": "#00c940",
                "failed-color": "#dc143c",
                "warning-color": "#d3b809",

                peach: "#ff7875",
                standard: "#34abae",
                premium: "#006aff",
            },
            fontFamily: {
                MonaSans: ['"Mona-Sans"', "sans-serif"],
                "Mona-Sans-Wide": ['"Mona-Sans-Wide"', "sans-serif"],
            },
            // borderRadius: {
            //     lg: "var(--radius)",
            //     md: "calc(var(--radius) - 2px)",
            //     sm: "calc(var(--radius) - 4px)",
            // },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                bumpDown: {
                    from: { top: "2.188rem", opacity: 0 },
                },
                floating: {
                    '0%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-3%)' },
                    '100%': { transform: 'translateY(0)' },
                },
                subtleZoom: {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.10) translateY(-5%)' },
                    '100%': { transform: 'scale(1)' },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                bumpDown: "bumpDown 0.4s cubic-bezier(0.65, -0.07, 0.25, 1.24)",

                floating: 'floating 6s ease-in-out infinite',
                subtleZoom: 'subtleZoom 10s ease-in-out infinite',
            },
            boxShadow: {
                teamCard: "0px 0px 4px rgba(0, 0, 0, 0.25)",
                "outline-button": "0px 4px 4px rgba(0, 0, 0, 0.25)",
            },
        },
    },
    plugins: [],
};
