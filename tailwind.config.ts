import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Kıvılcım Ana Renk Paleti (Sakin Mod - Varsayılan)
        'calm-blue': '#A5D8FF',
        'focus-blue': '#3B82F6',
        'success-green': '#86EFAC',
        'encourage-orange': '#FDBA74',
        'neutral-gray': '#E5E7EB',
        'text-color': '#1F2937',
        
        // Dark theme colors
        'dark-bg': '#0F172A',
        'dark-surface': '#1E293B',
        'dark-border': '#475569',
        'dark-text': '#F8FAFC',
        'dark-text-secondary': '#CBD5E1',
        
        // Theme adaptive colors (CSS variables)
        'bg-adaptive': 'var(--card-bg)',
        'bg-adaptive-secondary': 'var(--card-bg-secondary)',
        'text-adaptive': 'var(--text-primary)',
        'text-adaptive-secondary': 'var(--text-secondary)',
        'border-adaptive': 'var(--border-color)',
        
        // CSS değişkenleri için renk tanımları
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        // Kıvılcım Tipografi Kılavuzu
        'nunito': ['Nunito', 'sans-serif'],
        'opendyslexic': ['OpenDyslexic', 'sans-serif'],
        sans: ['Nunito', 'ui-sans-serif', 'system-ui'],
      },
      fontWeight: {
        'extrabold': '800',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        'gentle-bounce': 'gentle-bounce 2s ease-in-out infinite',
        'calm-pulse': 'calm-pulse 3s ease-in-out infinite',
        'slow-slide-up': 'slow-slide-up 1s ease-out',
      },
      keyframes: {
        'gentle-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'calm-pulse': {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
        'slow-slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config; 