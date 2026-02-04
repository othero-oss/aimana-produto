import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        brand: {
          coral: '#F06A6A',
          teal: '#00D4AA',
          navy: '#0A1628',
        },
        // Phase colors
        phase: {
          plan: '#4573D2',
          execute: '#F8A325',
          manage: '#9B5DE5',
        },
        // Status
        status: {
          success: '#5DA283',
          warning: '#F8A325',
          error: '#E8384F',
          pending: '#9CA3AF',
        },
        // Surfaces
        surface: {
          DEFAULT: '#FFFFFF',
          light: '#F6F8FA',
          hover: '#F1F3F5',
          border: '#E5E7EB',
          dark: '#0A1628',
        },
        // Text
        text: {
          DEFAULT: '#1F2937',
          secondary: '#6B7280',
          muted: '#9CA3AF',
          inverse: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'sidebar': '2px 0 8px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-celebration': 'linear-gradient(135deg, #F06A6A 0%, #F8A325 50%, #5DA283 100%)',
        'gradient-header': 'linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)',
        'gradient-coral': 'linear-gradient(135deg, #F06A6A 0%, #E85D5D 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'confetti': 'confetti 3s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in': 'slideIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          from: { transform: 'translateX(-10px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
} satisfies Config;
