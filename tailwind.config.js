/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
        'manrope': ['Manrope', 'sans-serif'],
      },
      colors: {
        // Brand Colors - Updated with new orange color
        'brand': {
          'dark-bg': '#212121',
          'light-bg': '#eeede9',
          'dark-text': '#EAEAEA',
          'light-text': '#222222',
          'muted-text': '#888888',
          'accent-start': '#fece0a',
          'accent-end': '#fece0a',
        },
        // Theme switcher colors
        "gray-700": "var(--ds-gray-700)",
        "gray-1000": "var(--ds-gray-1000)",
        "shadow": "var(--ds-shadow)",
        // shadcn/ui compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #fece0a 0%, #fece0a 100%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 8s linear infinite',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.33, 1, 0.68, 1)',
        'slide-down': 'slideDown 0.8s cubic-bezier(0.33, 1, 0.68, 1)',
        'slide-left': 'slideLeft 0.8s cubic-bezier(0.33, 1, 0.68, 1)',
        'slide-right': 'slideRight 0.8s cubic-bezier(0.33, 1, 0.68, 1)',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        scaleIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-200% center',
          },
          '100%': {
            backgroundPosition: '200% center',
          },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(40px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-40px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(50px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-50px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
      },
      // Typography scale following design guide
      fontSize: {
        'hero-loop': ['6rem', { lineHeight: '1.1', fontWeight: '800' }], // 96px
        'hero-heading': ['4rem', { lineHeight: '1.15', fontWeight: '700' }], // 64px
        'section-title': ['3rem', { lineHeight: '1.2', fontWeight: '700' }], // 48px
        'card-title': ['1.5rem', { lineHeight: '1.4', fontWeight: '500' }], // 24px
        'body-text': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }], // 18px
        'ui-text': ['1rem', { lineHeight: '1.0', fontWeight: '500' }], // 16px
        'subtitle': ['1rem', { lineHeight: '1.4', fontWeight: '400' }], // 16px
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
};