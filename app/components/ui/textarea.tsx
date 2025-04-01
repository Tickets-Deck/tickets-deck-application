"use client"

import * as React from "react"
import { motion } from "framer-motion"
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
    const { onDrag, onDragEnd, onDragStart, onAnimationStart, ...rest } = props;
    return (
        <motion.textarea
            className={`textarea ${className}`}
            ref={ref}
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 1 }}
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            {...rest}
        />
    )
})
Textarea.displayName = "Textarea"

export { Textarea }
