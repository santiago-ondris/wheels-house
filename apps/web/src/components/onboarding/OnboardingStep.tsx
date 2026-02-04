import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface OnboardingStepProps {
    stepNumber: number;
    totalSteps: number;
    title: string;
    description: string;
    subDescription?: string | React.ReactNode;
    icon: LucideIcon;
    children?: React.ReactNode;
}

export default function OnboardingStep({
    stepNumber,
    totalSteps,
    title,
    description,
    subDescription,
    icon: Icon,
    children,
}: OnboardingStepProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center px-6 py-4 text-center md:justify-center min-h-full"
        >
            {/* Step Indicator */}
            <div className="mb-2">
                <span className="text-[14px] font-mono font-bold text-[#BF247A] uppercase tracking-[0.3em]">
                    PASO_{String(stepNumber).padStart(2, '0')} // {String(totalSteps).padStart(2, '0')}
                </span>
            </div>

            {/* Icon */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mb-3 p-3 bg-accent/10 border border-accent/20 rounded-full"
            >
                <Icon className="w-10 h-10 md:w-12 md:h-12 text-accent" />
            </motion.div>

            {/* Title */}
            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-3xl md:text-2xl font-mono font-bold text-white uppercase tracking-tight mb-2"
            >
                {title}
            </motion.h2>

            {/* Description */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-white font-mono text-base md:text-lg max-w-md leading-relaxed"
            >
                {description}
            </motion.p>

            {/* Sub-description */}
            {subDescription && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="text-white/60 font-mono text-xs md:text-sm max-w-sm leading-relaxed mt-2"
                >
                    {subDescription}
                </motion.p>
            )}

            {/* Optional children for extra content */}
            {children && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="mt-4"
                >
                    {children}
                </motion.div>
            )}
        </motion.div>
    );
}
