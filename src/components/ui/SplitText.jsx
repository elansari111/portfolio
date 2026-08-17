import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function SplitText({ text, className = "", delay = 0.05 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });
    const letters = text.split("");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: delay, delayChildren: 0.1 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", damping: 12, stiffness: 100 },
        },
        hidden: {
            opacity: 0,
            y: 40,
            transition: { type: "spring", damping: 12, stiffness: 100 },
        },
    };

    return (
        <motion.div
            ref={ref}
            className={`overflow-hidden flex flex-wrap justify-center ${className}`}
            variants={container}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            {letters.map((letter, index) => (
                <motion.span variants={child} key={index} className="inline-block">
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </motion.div>
    );
}
