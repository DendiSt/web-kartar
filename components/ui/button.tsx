import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[#1868db] text-white hover:bg-[#1558be] shadow-none",
        outline:
          "border-[#101214] text-[#101214] hover:bg-[#f0f1f2] dark:border-white dark:text-white dark:hover:bg-white/10",
        secondary:
          "bg-[#f0f1f2] text-[#101214] hover:bg-[#e4e6e9] dark:bg-[#1c2b42] dark:text-white dark:hover:bg-[#233552]",
        ghost:
          "hover:bg-[#f0f1f2] hover:text-[#101214] dark:hover:bg-white/10 dark:hover:text-white",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30",
        link: "text-[#1868db] underline-offset-4 hover:underline",
        yellow: "bg-[#fca700] text-[#101214] hover:bg-[#e59800] font-semibold shadow-none",
      },
      size: {
        default:
          "h-10 gap-2 px-5 text-sm font-medium",
        xs: "h-7 gap-1 px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-4 text-xs font-medium [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2.5 px-7 text-base font-medium",
        icon: "size-10",
        "icon-xs": "size-7",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
