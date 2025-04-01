import React from 'react'

type Props = {
    title: string
    className?: string
}

export default function Badge({ title, className}: Props) {
    return (
        <span className={`mb-4 block w-fit mx-auto p-1 px-3 rounded-2xl text-sm cursor-default bg-purple-600 hover:bg-purple-700 ${className}`}>{title}</span>
    )
}