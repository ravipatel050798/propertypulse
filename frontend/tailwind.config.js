export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'system-ui', 'sans-serif'],
            },
            colors: {
                bcp: {
                    bg: '#0B1437',
                    surface: '#111C44',
                    surfaceHighlight: '#1B254B',
                    border: '#2A3665',
                    text: '#FFFFFF',
                    muted: '#A3AED0',
                    primary: '#4318FF',
                    accent: '#7551FF',
                    success: '#05CD99',
                    warning: '#FFCE20',
                    danger: '#EE5D50',
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'glass-gradient': 'linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)',
                'premium-gradient': 'linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)',
            },
            boxShadow: {
                'premium': '0px 18px 40px rgba(112, 144, 176, 0.12)',
                'premium-dark': '0px 18px 40px rgba(0, 0, 0, 0.25)',
                'neon': '0 0 20px rgba(67, 24, 255, 0.4)',
            }
        },
    },
    plugins: [],
}
