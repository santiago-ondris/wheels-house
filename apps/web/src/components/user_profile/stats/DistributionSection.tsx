import { motion } from "framer-motion";
import { DistributionItem } from "../../../services/profile.service";

interface DistributionSectionProps {
    title: string;
    subTitle: string;
    items: DistributionItem[];
    total: number;
    colorClass?: string;
}

const SEGMENTS = 20;

export default function DistributionSection({ title, subTitle, items, total, colorClass = "bg-accent" }: DistributionSectionProps) {
    const topItems = items.slice(0, 5);
    const otherCount = items.slice(5).reduce((acc, item) => acc + item.count, 0);

    return (
        <div className="bg-black/20 border-l border-white/5 pl-6 py-4">
            <div className="mb-6">
                <span className="text-[10px] text-accent/50 font-bold uppercase tracking-[0.2em]">
                    {subTitle}
                </span>
                <h3 className="text-white font-mono font-bold text-lg uppercase tracking-tight">
                    {title}
                </h3>
            </div>

            <div className="space-y-8">
                {topItems.map((item, idx) => {
                    const percentage = (item.count / total) * 100;
                    const filledSegments = Math.round((percentage / 100) * SEGMENTS);

                    return (
                        <div key={item.name} className="group">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs text-white/50 font-bold uppercase tracking-wider group-hover:text-white transition-colors">
                                    {item.name}
                                </span>
                                <span className="text-sm font-mono text-emerald-500 group-hover:text-accent transition-colors">
                                    {item.count} U.
                                </span>
                            </div>

                            <div className="flex gap-[3px]">
                                {Array.from({ length: SEGMENTS }).map((_, sIdx) => (
                                    <motion.div
                                        key={sIdx}
                                        initial={{ opacity: 0 }}
                                        animate={{
                                            opacity: sIdx < filledSegments ? 1 : 0.1,
                                            scaleY: sIdx < filledSegments ? 1 : 0.8
                                        }}
                                        transition={{ delay: (idx * 0.1) + (sIdx * 0.02) }}
                                        className={`h-4 w-full -skew-x-[20deg] rounded-[1px] transition-all duration-500 ${sIdx < filledSegments ? colorClass : 'bg-white/20'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}

                {otherCount > 0 && (
                    <div className="pt-4 border-t border-white/5">
                        <p className="text-[10px] text-white/20 font-bold uppercase">
                            + {items.length - 5} otras categorías ({otherCount} unidades)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
