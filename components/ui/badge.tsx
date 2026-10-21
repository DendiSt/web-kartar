import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border border-transparent px-3 py-0.5 text-[13px] font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-[#e9f2fe] text-[#1868db] dark:bg-[#1c2b42] dark:text-[#7bb0ff]",
        secondary: "bg-[#f0f1f2] text-[#42526e] dark:bg-[#20252e] dark:text-[#b7b9be]",
        outline: "border-[#1c2b42]/20 text-[#101214] dark:border-white/20 dark:text-white",
        destructive: "bg-[#ffebe6] text-[#de350b] dark:bg-[#3d1a18] dark:text-[#ff8f73]",
        accent: "bg-[#eed7fc] text-[#52257d] dark:bg-[#341b4a] dark:text-[#eed7fc]",
        yellow: "bg-[#fffae6] text-[#8a5d00] dark:bg-[#332a00] dark:text-[#ffe380]",
        green: "bg-[#e3fcef] text-[#006644] dark:bg-[#123824] dark:text-[#79f2c0]",
        ghost: "hover:bg-muted text-muted-foreground",
        link: "text-[#1868db] underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
