import * as React from "react"
import { motion, useMotionTemplate, useMotionValue, MotionProps } from "framer-motion"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Enhanced button variants with Tailwind CSS 4.0 features
const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground",
          "hover:scale-[1.02] hover:bg-primary/90",
          "active:scale-[0.98]",
          "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]",
          "motion-safe:hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2),0_4px_8px_rgba(0,0,0,0.1)]"
        ],
        destructive: [
          "bg-destructive text-destructive-foreground",
          "hover:scale-[1.02] hover:bg-destructive/90",
          "active:scale-[0.98]",
          "motion-safe:hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2),0_4px_8px_rgba(255,0,0,0.2)]"
        ],
        outline: [
          "border border-input bg-background",
          "hover:scale-[1.02] hover:bg-accent hover:text-accent-foreground",
          "active:scale-[0.98]",
          "motion-safe:hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)]"
        ],
        secondary: [
          "bg-secondary text-secondary-foreground",
          "hover:scale-[1.02] hover:bg-secondary/80",
          "active:scale-[0.98]",
          "motion-safe:hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
        ],
        ghost: [
          "hover:bg-accent hover:text-accent-foreground",
          "hover:scale-[1.02]",
          "active:scale-[0.98]"
        ],
        glass: [
          "bg-background/30 backdrop-blur-md text-foreground border border-border/10",
          "hover:scale-[1.02] hover:bg-background/40",
          "active:scale-[0.98]",
          "motion-safe:hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)]"
        ],
        link: [
          "text-primary underline-offset-4 hover:underline",
          "hover:text-primary/90"
        ],
        gradient: [
          "bg-gradient-to-br from-primary to-primary-dark text-primary-foreground",
          "hover:scale-[1.02] hover:brightness-110",
          "active:scale-[0.98]",
          "shadow-primary/20 shadow-lg"
        ]
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10 rounded-full",
      },
      animate: {
        default: "",
        glow: "group",  // Used for group-hover effects
        pulse: "",
        bounce: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animate: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  motionProps?: MotionProps
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animate, asChild = false, motionProps, children, ...props }, ref) => {
    // For asChild, we need to handle separately since Slot doesn't accept motion props
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, animate, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    // Motion values for interactive effects
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const radius = useMotionValue(0)

    // Generate motion template for glow effect
    const background = useMotionTemplate`
      radial-gradient(
        ${radius}px circle at ${mouseX}px ${mouseY}px,
        rgba(var(--color-primary-rgb) / 0.15),
        transparent 80%
      )
    `

    // Handle mouse move for glow effect
    const handleMouseMove = React.useCallback(
      ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
        const rect = currentTarget.getBoundingClientRect()
        mouseX.set(clientX - rect.left)
        mouseY.set(clientY - rect.top)
      },
      [mouseX, mouseY]
    )

    // Set radius on mouse enter/leave
    const handleMouseEnter = React.useCallback(() => {
      radius.set(200)
    }, [radius])

    const handleMouseLeave = React.useCallback(() => {
      radius.set(0)
    }, [radius])

    // Animation variants based on animate prop
    const animations = {
      default: {},
      glow: {},
      pulse: {
        animate: {
          scale: [1, 1.03, 1],
          transition: {
            duration: 2,
            repeat: Infinity,
            repeatType: "loop" as const,
          }
        }
      },
      bounce: {
        whileHover: {
          y: [0, -5, 0],
          transition: {
            duration: 0.4,
            repeat: Infinity,
            repeatType: "loop" as const,
          }
        }
      }
    }

    // Select animation based on prop
    const selectedAnimation = animate ? animations[animate] : animations.default

    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, animate, className }))}
        ref={ref}
        onMouseMove={animate === "glow" ? handleMouseMove : undefined}
        onMouseEnter={animate === "glow" ? handleMouseEnter : undefined}
        onMouseLeave={animate === "glow" ? handleMouseLeave : undefined}
        {...selectedAnimation}
        {...motionProps}
        {...props}
      >
        {/* Glow effect overlay */}
        {animate === "glow" && (
          <motion.span
            className="absolute inset-0 rounded-md"
            style={{ background }}
            aria-hidden="true"
          />
        )}
        {children}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
