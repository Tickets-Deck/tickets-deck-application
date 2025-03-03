import React from 'react'

type Props = {
    type: boolean
}

export default function Pulse({ type }: Props) {
    return (
        <div className="relative flex h-3 w-3">
            <span className={`"animate-ping absolute inline-flex h-full w-full rounded-full ${type ? 'bg-green-400' : 'bg-red-400'} opacity-75"`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${type ? 'bg-green-500' : 'bg-red-500'}`}></span>
        </div>
    )
}
