import { motion } from 'framer-motion'
import React from 'react'

type  Props = {
    children: React.ReactNode,
}

const animations = {
    initial: {opacity: 0,
        
    },
    animate: {
        opacity:1,
        transition: {duration:0.5, ease: 'easeOut'}
    },
    exit: {
        opacity: 0.5,
        transition: {duration:0.2, ease: 'easeIn'}
    }
}

export const AnimatedPage = ({children}: Props) => {
    return (
        <motion.div variants={animations}
        initial='initial'
        animate='animate'
        exit={'exit'}
        transition={{duration:0.25, delay:0.11}}
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

const loadinganimate = {
    initial: {opacity: 0},
    animate: {opacity:1, rotate: [0, 180, 180]},
    exit: {opacity: 0},
}

export const LoadingAnimation = ({children}: Props) => {
    return (
        <motion.div
            className='flex flex-row justify-center h-[20px] w-[20px]'
            animate ='animate'
            variants={loadinganimate}
            transition={{duration:1, repeat:Infinity,repeatDelay:0.3, type: 'spring'}}
        >
            {children}
        </motion.div>

    )
}

export const HoverItem = ({children}: Props) => {
    return (
        <motion.div whileHover={{scale: 1.1}} whileTap={{scale: 1}}>
            {children}
        </motion.div>
    )
} 

