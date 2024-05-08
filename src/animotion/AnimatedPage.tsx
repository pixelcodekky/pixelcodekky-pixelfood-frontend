import { motion } from 'framer-motion'
import { exit } from 'process'
import React from 'react'

type  Props = {
    children: React.ReactNode,
}

const animationsrighttoleft = {
    initial: {opacity: 0, x:100},
    animate: {opacity:1, x: 0},
    exit: {opacity: 0, x:-100},
}

const animations = {
    initial: {opacity: 0},
    animate: {opacity:1},
    exit: {opacity: 0}
}

export const AnimatedPage = ({children}: Props) => {
    return (
        <motion.div variants={animations}
        initial='initial'
        animate='animate'
        exit={'exit'}
        transition={{duration:0.3, delay:0.11}}
        >
            {children}
        </motion.div>
    )
}

const animationscale = {
    initial: {opacity: 0, scale:0.5},
    animate: {opacity:1, x: 0},
    exit: {opacity: 0, x:0.5},
}

export const AnimatedCard = ({children}: Props) => {
    return (
        <motion.div variants={animationscale}
        initial='initial'
        animate='animate'
        exit={"exit"}
        transition={{duration:0.3, delay:0}}
        >
            {children}
        </motion.div>
    )
}
