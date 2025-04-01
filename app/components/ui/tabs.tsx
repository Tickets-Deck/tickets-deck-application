"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

const TabsContext = React.createContext<{
    selectedValue: string
    onChange: (value: string) => void
} | null>(null)

function useTabs() {
    const context = React.useContext(TabsContext)
    if (!context) {
        throw new Error("Tabs components must be used within a TabsProvider")
    }
    return context
}

interface TabsProps {
    defaultValue: string
    value?: string
    onValueChange?: (value: string) => void
    className?: string
    children: React.ReactNode
}

const Tabs = ({ defaultValue, value, onValueChange, className, children }: TabsProps) => {
    const [selectedValue, setSelectedValue] = React.useState(value || defaultValue)

    React.useEffect(() => {
        if (value !== undefined) {
            setSelectedValue(value)
        }
    }, [value])

    const onChange = React.useCallback(
        (value: string) => {
            setSelectedValue(value)
            onValueChange?.(value)
        },
        [onValueChange],
    )

    return (
        <TabsContext.Provider value={{ selectedValue, onChange }}>
            <div className={`space-y-2 ${className}`}>{children}</div>
        </TabsContext.Provider>
    )
}

interface TabsListProps {
    className?: string
    children: React.ReactNode
}

const TabsList = ({ className, children }: TabsListProps) => {
    return (
        <div
            className={`inline-flex h-[42px] w-full items-center justify-center rounded-md bg-container-grey p-1 text-white ${className}`}
        >
            {children}
        </div>
    )
}

interface TabsTriggerProps<T extends string> {
    value: T
    className?: string
    children: React.ReactNode
}

const TabsTrigger = <T extends string>({ value, className, children }: TabsTriggerProps<T>) => {
    const { selectedValue, onChange } = useTabs();
    const isSelected = selectedValue === value

    return (
        <motion.button
            className={
                `inline-flex w-full items-center justify-center whitespace-nowrap rounded-sm px-3 py-2 text-sm font-normal ring-offset-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
                ${isSelected ? "bg-black text-white shadow-sm" : "hover:bg-black/50 hover:text-white"}
                ${className}`
            }
            onClick={() => onChange(value)}
            whileTap={{ scale: 0.95 }}
        >
            {children}
        </motion.button>
    )
}

interface TabsContentProps {
    value: string
    className?: string
    children: React.ReactNode
}

const TabsContent = ({ value, className, children }: TabsContentProps) => {
    const { selectedValue } = useTabs()
    const isSelected = selectedValue === value

    return (
        <AnimatePresence mode="wait">
            {isSelected && (
                <motion.div
                    className={`ring-offset-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${className}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }

