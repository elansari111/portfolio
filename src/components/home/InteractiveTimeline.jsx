import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const timelineVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
}

const itemVariants = {
    hidden: { 
        opacity: 0, 
        x: -30,
        scale: 0.95
    },
    visible: { 
        opacity: 1, 
        x: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1]
        }
    }
}

const lineVariants = {
    hidden: { scaleY: 0 },
    visible: { 
        scaleY: 1,
        transition: {
            duration: 0.8,
            ease: "easeInOut"
        }
    }
}

export default function InteractiveTimeline({ experience = [] }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <div ref={ref} className="relative">
            {/* Vertical Line */}
            <motion.div
                variants={lineVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-success transform -translate-x-1/2 origin-top rounded-full"
            />

            {/* Timeline Items */}
            <motion.div
                variants={timelineVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="space-y-8 md:space-y-16"
            >
                {experience.map((job, index) => {
                    const isEven = index % 2 === 0
                    
                    return (
                        <motion.div
                            key={job.id}
                            variants={itemVariants}
                            className={`relative flex items-start ${
                                isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                            }`}
                        >
                            {/* Content Card */}
                            <motion.div
                                whileHover={{ y: -3 }}
                                className={`ml-20 md:ml-0 md:w-[45%] ${
                                    isEven ? 'md:mr-auto md:pr-16' : 'md:ml-auto md:pl-16'
                                }`}
                            >
                                <div className="bg-white dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:border-primary/50">
                                    {/* Date Badge */}
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                        className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20"
                                    >
                                        {job.startDate} – {job.endDate}
                                    </motion.div>

                                    {/* Title & Company */}
                                    <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                                        {job.title}
                                    </h3>
                                    <p className="text-primary font-semibold mb-4">
                                        @{job.company}
                                    </p>

                                    {/* Description */}
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        {job.description}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )
                })}
            </motion.div>
        </div>
    )
}
