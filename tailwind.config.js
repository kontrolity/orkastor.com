/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))', '2': 'hsl(var(--chart-2))', '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))', '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))', foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))', 'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))', 'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))', ring: 'hsl(var(--sidebar-ring))',
        },
        brand: {
          cyan:           '#3b82f6',
          'cyan-light':   '#60a5fa',
          violet:         '#10b981',
          'violet-light': '#34d399',
          dark:           '#080e1c',
          card:           '#0b1220',
        },
      },
      boxShadow: {
        'glow-cyan':         '0 0 24px rgba(59,130,246,0.18), 0 0 60px rgba(59,130,246,0.08)',
        'glow-cyan-strong':  '0 0 40px rgba(59,130,246,0.35)',
        'glow-violet':       '0 0 24px rgba(16,185,129,0.18), 0 0 60px rgba(16,185,129,0.08)',
        'glow-violet-strong':'0 0 40px rgba(16,185,129,0.3)',
        'card':              '0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 20px rgba(0,0,0,0.4)',
        'terminal':          '0 32px 80px rgba(0,0,0,0.6)',
        'bento':             '0 4px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glow-sm':           '0 0 20px rgba(59,130,246,0.18)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up':   { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'border-spin':    { to: { '--border-angle': '360deg' } },
        'float-y': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'spotlight-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'beam': {
          '0%':   { opacity: '1',   transform: 'translateX(-100%)' },
          '100%': { opacity: '0.2', transform: 'translateX(300%)' },
        },
        'shimmer-slide': {
          '0%':   { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':      { opacity: '1',   transform: 'scale(1.06)' },
        },
        'glow-drift': {
          '0%':   { transform: 'translate(0px, 0px) scale(1)' },
          '33%':  { transform: 'translate(20px, -15px) scale(1.04)' },
          '66%':  { transform: 'translate(-15px, 10px) scale(0.97)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        'cursor-blink': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        'marquee-left': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-right': {
          '0%':   { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'meteor-fall': {
          '0%':   { transform: 'rotate(215deg) translateX(0)',      opacity: '0' },
          '5%':   { opacity: '1' },
          '70%':  { opacity: '1' },
          '100%': { transform: 'rotate(215deg) translateX(-600px)', opacity: '0' },
        },
      },
      animation: {
        'accordion-down':  'accordion-down 0.2s ease-out',
        'accordion-up':    'accordion-up 0.2s ease-out',
        'border-spin':     'border-spin 4s linear infinite',
        'float-y':         'float-y 6s ease-in-out infinite',
        'spotlight-in':    'spotlight-in 1.8s ease 0.2s 1 forwards',
        'beam':            'beam 3.5s ease-in-out infinite',
        'glow-pulse':      'glow-pulse 5s ease-in-out infinite',
        'glow-drift':      'glow-drift 12s ease-in-out infinite',
        'cursor-blink':    'cursor-blink 1.1s step-start infinite',
        'marquee-left':    'marquee-left 32s linear infinite',
        'marquee-right':   'marquee-right 28s linear infinite',
        'spin-slow':       'spin-slow 20s linear infinite',
        'meteor-fall':     'meteor-fall 8s linear infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
