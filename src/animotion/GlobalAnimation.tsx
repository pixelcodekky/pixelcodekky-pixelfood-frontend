import React from 'react'
import { AnimatePresence } from 'framer-motion';

type GlobalAnmationProp = {
    children: React.ReactNode;
}

export const GlobalAnimation = ({children}: GlobalAnmationProp) => {
    return (
        <AnimatePresence mode='wait'>
            {children}
        </AnimatePresence>
    )
}
