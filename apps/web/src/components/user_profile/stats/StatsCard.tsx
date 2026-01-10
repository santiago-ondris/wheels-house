import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    label: string;
    subLabel: string;
    value: string | number;
    icon: LucideIcon;
    index: number;
    showDivider?: boolean;
}

export default function StatsCard({ label, subLabel, value, icon: Icon, index, showDivider = true }: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative flex flex-col items-center md:items-start px-6 py-2 ${showDivider ? 'md:border-r border-white/10' : ''}`}
        >
            <div className="flex items-center gap-2 text-accent/60 mb-1">
                <Icon className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                    {subLabel}
                </span>
            </div>

            <div className="flex flex-col items-center md:items-start">
                <p className="text-3xl md:text-4xl font-mono font-bold text-white tracking-tighter">
                    {value}
                </p>
                <h3 className="text-white/30 text-[9px] font-medium uppercase tracking-widest mt-1">
                    {label}
                </h3>
            </div>
        </motion.div>
    );
}
