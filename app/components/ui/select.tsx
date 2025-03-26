"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Icons } from "./icons"

interface SelectContextType {
    value: string
    onValueChange: (value: string) => void
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SelectContext = React.createContext<SelectContextType | null>(null)

const useSelect = () => {
    const context = React.useContext(SelectContext)
    if (!context) {
        throw new Error("useSelect must be used within a Select component")
    }
    return context
}

interface SelectProps {
    value: string
    onValueChange: (value: string) => void
    children: React.ReactNode
    defaultValue?: string
}

const Select = ({ value, onValueChange, children, defaultValue }: SelectProps) => {
    const [open, setOpen] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(value || defaultValue || "")

    React.useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value)
        }
    }, [value])

    const handleValueChange = React.useCallback(
        (newValue: string) => {
            setInternalValue(newValue)
            onValueChange?.(newValue)
        },
        [onValueChange],
    )

    return (
        <SelectContext.Provider
            value={{
                value: internalValue,
                onValueChange: handleValueChange,
                open,
                setOpen,
            }}
        >
            {children}
        </SelectContext.Provider>
    )
}

interface SelectTriggerProps {
    className?: string
    children?: React.ReactNode
    id?: string
}

const SelectTrigger = React.forwardRef<
    HTMLButtonElement,
    SelectTriggerProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, id, ...props }, ref) => {
    const { open, setOpen, value } = useSelect()

    const { onDrag, onDragEnd, onDragStart, onAnimationStart, ...rest } = props;

    return (
        <motion.button
            ref={ref}
            id={id}
            type="button"
            className={`flex h-10 w-full items-center justify-between rounded-md border border-container-grey-20 bg-container-grey-20 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            whileTap={{ scale: 0.98 }}
            {...rest}
        >
            {children}
            <Icons.ChevronLeft className="h-4 w-4 opacity-50" />
        </motion.button>
    )
})
SelectTrigger.displayName = "SelectTrigger"

interface SelectValueProps {
    placeholder?: string
}

const SelectValue = ({ placeholder }: SelectValueProps) => {
    const { value } = useSelect()

    return <span className="text-sm">{value ? value : placeholder}</span>
}

interface SelectContentProps {
    className?: string
    children: React.ReactNode
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps & React.HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => {
        const { open, setOpen } = useSelect()

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
        }, [open, setOpen])

        const { onDrag, onDragEnd, onDragStart, onAnimationStart, ...rest } = props;

        return (
            <AnimatePresence>
                {open && (
                    <div className="relative z-50 w-full">
                        <motion.div
                            ref={ref}
                            className={`absolute w-full top-2 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-black p-1 text-white shadow-md ${className}`}
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                            {...rest}
                        >
                            {children}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        )
    },
)
SelectContent.displayName = "SelectContent"

interface SelectItemProps {
    value: string
    children: React.ReactNode
    className?: string
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps & React.HTMLAttributes<HTMLDivElement>>(
    ({ value, children, className, ...props }, ref) => {
        const { value: selectedValue, onValueChange, setOpen } = useSelect()
        const isSelected = selectedValue === value

        const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation()
            onValueChange(value)
            setOpen(false)
        }

        const { onDrag, onDragEnd, onDragStart, onAnimationStart, ...rest } = props;

        return (
            <motion.div
                ref={ref}
                className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground ${className}`}
                whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClick}
                {...rest}
            >
                {isSelected &&
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Icons.Check className="h-4 w-4" />
                    </span>
                }
                {children}
            </motion.div>
        )
    },
)
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
