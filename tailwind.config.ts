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
        sage: {
          bg: '#E8EFE5',
          light: '#F2F7EF',
          border: '#CAD7C5',
          DEFAULT: '#94AB8B',
          dark: '#455E3F',
          deep: '#293B25',
        },
        forest: {
          DEFAULT: '#253521',
          dark: '#1A2617',
          light: '#354B2F',
        },
        rose: {
          petal: '#FFF5F8',
          blush: '#FCE7F3',
          dusty: '#F472B6',
          DEFAULT: '#E11D48',
          berry: '#BE185D',
          dark: '#9D174D',
          deep: '#4A0E23',
        },
        velvet: {
          DEFAULT: '#18181B',
          teal: '#0D2825',
          rose: '#24141A',
        },
        charcoal: '#1E293B',
        // Fresh green-teal accent tokens
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          deep: '#0B2321',
        },
      },
      fontFamily: {
        // Modern geometric sans-serif (Elian Ross body & headers: Outfit)
        sans: ["var(--font-sans)", "'Outfit'", "'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
        
        // Luxury high-contrast editorial serif (Elian Ross headings & footer: Instrument Serif)
        serif: ["var(--font-serif)", "'Instrument Serif'", "'Playfair Display'", "Georgia", "serif"],
        editorial: ["var(--font-serif)", "'Instrument Serif'", "'Playfair Display'", "Georgia", "serif"],
        
        // Secondary script/display
        script: ["var(--font-serif)", "'Instrument Serif'", "cursive", "serif"],
        
        mono: ["ui-monospace", "monospace"],
      },
      letterSpacing: {
        'subheader': '0.22em',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'scroll-left': 'scrollLeft 32s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.06)' },
        },
        scrollLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
