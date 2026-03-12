import { motion } from 'framer-motion';

export function Reveal({
    children,
    delay = 0,
    direction = 'up',
    className = '',
}) {
    const variants = {
        hidden: {
            opacity: 0,
            y: direction === 'up' ? 40 : 0,
            x: direction === 'left' ? -40 : direction === 'right' ? 40 : 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration: 0.8,
                delay,
                ease: [0.25, 1, 0.5, 1],
            },
        },
    };

    return (
        <motion.div
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
