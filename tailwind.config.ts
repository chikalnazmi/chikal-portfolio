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
          petal: '#FBF0F4',
          blush: '#F5D3DC',
          dusty: '#BD5871',
          DEFAULT: '#A6435B',
          berry: '#781E34',
          dark: '#4C1021',
        },
        charcoal: '#212B1E',
      },
      fontFamily: {
        // Title Styling: Quincy
        serif: ["'Quincy CF'", "'Quincy'", "var(--font-quincy)", "Georgia", "serif"],
        title: ["'Quincy CF'", "'Quincy'", "var(--font-quincy)", "Georgia", "serif"],
        
        // Subheader Styling: Futura
        subheader: ["'Futura'", "'Futura-Medium'", "var(--font-futura)", "'Century Gothic'", "sans-serif"],
        futura: ["'Futura'", "'Futura-Medium'", "var(--font-futura)", "'Century Gothic'", "sans-serif"],
        
        // Paragraph Styling: Source Sans
        sans: ["var(--font-source-sans)", "'Source Sans 3'", "'Source Sans Pro'", "system-ui", "sans-serif"],
        body: ["var(--font-source-sans)", "'Source Sans 3'", "'Source Sans Pro'", "system-ui", "sans-serif"],
        
        mono: ["var(--font-space-mono)", "monospace"],
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
