"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

interface DropdownMenuProps {
    children: React.ReactNode
}

const DropdownMenu = ({ children }: DropdownMenuProps) => {
    return <div className="relative">{children}</div>
}

interface DropdownMenuTriggerProps {
    asChild?: boolean
    children: React.ReactNode
    className?: string
}

const DropdownMenuTrigger = React.forwardRef<
    HTMLButtonElement,
    DropdownMenuTriggerProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ asChild, children, className, ...props }, ref) => {
    const { onDrag, onDragEnd, onDragStart, onAnimationStart, ...rest } = props;
    const [open, setOpen] = React.useState(false)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setOpen(!open)
        props.onClick?.(e)
    }

    React.useEffect(() => {
        const handleOutsideClick = () => {
            setOpen(false)
        }

        if (open) {
            document.addEventListener("click", handleOutsideClick)
        }

        return () => {
            document.removeEventListener("click", handleOutsideClick)
        }
    }, [open])

    const Comp = asChild ? (React.Children.only(children) as React.ReactElement) : "button"
    const childProps = asChild && React.isValidElement(Comp) ? { ...(Comp as React.ReactElement).props } : {};

    return (
        <>
            {React.cloneElement(
                asChild ? (
                    (Comp as React.ReactElement)
                ) : (
                    <motion.button className={className} whileTap={{ scale: 0.97 }} {...rest}>
                        {children}
                    </motion.button>
                ),
                {
                    ref,
                    onClick: handleClick,
                    "aria-expanded": open,
                    "data-state": open ? "open" : "closed",
                    ...childProps,
                },
            )}
            <DropdownMenuContext.Provider value={{ open, setOpen }}>{children}</DropdownMenuContext.Provider>
        </>
    )
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

interface DropdownMenuContextType {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(null)

const useDropdownMenu = () => {
    const context = React.useContext(DropdownMenuContext)
    if (!context) {
        throw new Error("useDropdownMenu must be used within a DropdownMenuProvider")
    }
    return context
}

interface DropdownMenuContentProps {
    children: React.ReactNode
    className?: string
    align?: "start" | "end" | "center"
}

const DropdownMenuContent = React.forwardRef<
    HTMLDivElement,
    DropdownMenuContentProps & React.HTMLAttributes<HTMLDivElement>
>(({ children, className, align = "center", ...props }, ref) => {
    const { onDrag, onDragEnd, onDragStart, onAnimationStart, ...rest } = props;
    const { open } = useDropdownMenu()

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    ref={ref}
                    className={
                        `
                        z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md
                        ${align === "start" && "origin-top-left left-0"}
                        ${align === "center" && "origin-top left-1/2 -translate-x-1/2"}
                        ${align === "end" && "origin-top-right right-0"}
                        ${className}
                        `
                    }
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    onClick={(e) => e.stopPropagation()}
                    {...rest}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

interface DropdownMenuItemProps {
    children: React.ReactNode
    className?: string
    onSelect?: () => void
}

const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps & React.HTMLAttributes<HTMLDivElement>>(
    ({ children, className, onSelect, ...props }, ref) => {
        const { onDrag, onDragEnd, onDragStart, onAnimationStart, ...rest } = props;
        const { setOpen } = useDropdownMenu()

        const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation()
            onSelect?.()
            setOpen(false)
            props.onClick?.(e)
        }

        return (
            <motion.div
                ref={ref}
                className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground ${className}`}
                whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClick}
                {...rest}
            >
                {children}
            </motion.div>
        )
    },
)
DropdownMenuItem.displayName = "DropdownMenuItem"

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }