import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: "hsl(var(--foreground) / 0.8)",
            strong: {
              color: "hsl(var(--foreground) / 0.9)"
            },
            h1: {
              color: "hsl(var(--foreground) / 0.9)",
              letterSpacing: "-0.05em"
            },
            h2: {
              color: "hsl(var(--foreground) / 0.9)",
              letterSpacing: "-0.05em"
            },
            h3: {
              color: "hsl(var(--foreground) / 0.9)",
              letterSpacing: "-0.05em"
            },
            h4: {
              color: "hsl(var(--foreground) / 0.9)",
              letterSpacing: "-0.05em"
            },
            h5: {
              color: "hsl(var(--foreground) / 0.9)",
              letterSpacing: "-0.05em"
            },
            h6: {
              color: "hsl(var(--foreground) / 0.9)",
              letterSpacing: "-0.05em"
            },
            "li::marker": {
              color: "hsl(var(--muted-foreground))"
            },
            li: {
              color: "hsl(var(--foreground) / 0.8)"
            },
            blockquote: {
              color: "hsl(var(--muted-foreground))",
              borderLeftColor: "hsl(var(--border))"
            }
          }
        }
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"]
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        warning: {
          DEFAULT: "hsl(var(--warning))"
        },
        success: {
          DEFAULT: "hsl(var(--success))"
        },
        error: {
          DEFAULT: "hsl(var(--error))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        }
      },
      borderRadius: {
        "5xl": "calc(var(--radius) + 16px)",
        "4xl": "calc(var(--radius) + 12px)",
        "3xl": "calc(var(--radius) + 8px)",
        "2xl": "calc(var(--radius) + 4px)",
        xl: "var(--radius)",
        lg: "calc(var(--radius) - 2px)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 6px)",
        xs: "calc(var(--radius) - 8px)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 3s ease-in-out forwards"
      }
    }
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
    require("tailwind-scrollbar-hide")
  ]
} satisfies Config

export default config
