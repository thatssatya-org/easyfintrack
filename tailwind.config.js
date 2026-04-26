/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                carbon: {
                    50: '#f7f6f4',
                    100: '#e8e6e1',
                    200: '#d1cdc5',
                    300: '#b5afa3',
                    400: '#948c7d',
                    500: '#7a7164',
                    600: '#625a4f',
                    700: '#4a4439',
                    800: '#2a2621',
                    900: '#161412',
                    950: '#0a0a08',
                },
                amber: {
                    400: '#e8a849',
                    500: '#d4952e',
                    600: '#b87d1a',
                },
                sage: {
                    400: '#7ec9a0',
                    500: '#5bb882',
                },
                coral: {
                    400: '#e87461',
                    500: '#d4503a',
                },
            },
            fontFamily: {
                display: ['"DM Serif Display"', 'Georgia', 'serif'],
                body: ['"Outfit"', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-up': 'fadeUp 0.5s ease-out forwards',
                'fade-in': 'fadeIn 0.4s ease-out forwards',
                'slide-in': 'slideIn 0.3s ease-out forwards',
                'grain': 'grain 8s steps(10) infinite',
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(12px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateX(-8px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                grain: {
                    '0%, 100%': { transform: 'translate(0, 0)' },
                    '10%': { transform: 'translate(-5%, -10%)' },
                    '20%': { transform: 'translate(-15%, 5%)' },
                    '30%': { transform: 'translate(7%, -25%)' },
                    '40%': { transform: 'translate(-5%, 25%)' },
                    '50%': { transform: 'translate(-15%, 10%)' },
                    '60%': { transform: 'translate(15%, 0%)' },
                    '70%': { transform: 'translate(0%, 15%)' },
                    '80%': { transform: 'translate(3%, 35%)' },
                    '90%': { transform: 'translate(-10%, 10%)' },
                },
            },
        },
    },
    plugins: [],
}