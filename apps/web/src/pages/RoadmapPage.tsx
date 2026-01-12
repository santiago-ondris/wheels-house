import { motion, useScroll, useTransform } from "framer-motion";
import {
    Flag,
    Zap,
    Target,
    ArrowRight,
    Sparkles,
    Clock,
    Rocket,
    Lightbulb
} from "lucide-react";
import { Link } from "react-router-dom";
import { roadmapData, RoadmapItem } from "../data/roadmapData";
import { useRef, useEffect, useState } from "react";
import { LucideIcon, ArrowUp } from "lucide-react";

interface SectionEntry {
    type: 'section';
    title: string;
    icon: LucideIcon;
    color: string;
}

interface ItemEntry extends RoadmapItem {
    type: 'item';
}

export default function RoadmapPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const allItems: (SectionEntry | ItemEntry)[] = [
        { type: 'section', title: 'En_Desarrollo', icon: Zap, color: 'emerald' },
        ...roadmapData.inDevelopment.map(item => ({ type: 'item' as const, ...item })),
        { type: 'section', title: 'Proximamente', icon: Target, color: 'blue' },
        ...roadmapData.upcoming.map(item => ({ type: 'item' as const, ...item })),
        { type: 'section', title: 'Futuras_Ideas', icon: Sparkles, color: 'accent' },
        ...roadmapData.future.map(item => ({ type: 'item' as const, ...item })),
    ];

    let itemIndex = 0;

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white py-6 px-4 relative overflow-hidden">

            {/* Grid Pattern Background */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, white 1px, transparent 1px),
                        linear-gradient(to bottom, white 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Ambient Light Blobs - Desktop only (heavy on mobile GPU) */}
            <div className="hidden md:block absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="hidden md:block absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="hidden md:block absolute bottom-1/4 left-1/3 w-96 h-96 bg-accent/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">

                {/* Header Section - Compact */}
                <header className="text-center space-y-3 relative mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-accent/5 border border-accent/10 rounded-full"
                    >
                        <Flag className="w-3 h-3 text-accent" />
                        <span className="text-[14px] font-mono font-black uppercase tracking-[0.2em] text-accent">
                            HOJA_DE_RUTA
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="text-3xl md:text-5xl font-mono font-black uppercase tracking-tighter"
                    >
                        Nuestro <span className="text-accent">Camino</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/40 font-mono text-xs md:text-sm max-w-xl mx-auto uppercase tracking-wide"
                    >
                        Tenemos estas ideas pensadas, sujetas a modificaciones..
                    </motion.p>
                </header>

                {/* Timeline Container */}
                <div ref={containerRef} className="relative">

                    {/* The Spine - Vertical Line with Glow */}
                    <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] md:w-[3px]">
                        {/* Background rail */}
                        <div className="absolute inset-0 bg-white/10 md:bg-white/5 rounded-full" />
                        {/* Glow effect - Desktop only */}
                        <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-emerald-500/20 via-blue-500/20 to-accent/20 blur-sm rounded-full" />
                        {/* Animated fill line - Desktop only */}
                        <motion.div
                            className="hidden md:block absolute top-0 left-0 w-full bg-gradient-to-b from-emerald-500 via-blue-500 to-accent rounded-full shadow-[0_0_15px_rgba(var(--color-accent),0.5)]"
                            style={{ height: lineHeight }}
                        />
                        {/* Static gradient line - Mobile */}
                        <div className="md:hidden absolute inset-0 bg-gradient-to-b from-emerald-500/50 via-blue-500/50 to-accent/50 rounded-full" />
                    </div>

                    {/* Timeline Items */}
                    <div className="relative space-y-0">
                        {allItems.map((entry) => {
                            if (entry.type === 'section') {
                                const sectionEntry = entry as SectionEntry;
                                return (
                                    <SectionMilestone
                                        key={sectionEntry.title}
                                        title={sectionEntry.title}
                                        Icon={sectionEntry.icon}
                                        color={sectionEntry.color}
                                    />
                                );
                            } else {
                                const currentIndex = itemIndex++;
                                return (
                                    <TimelineItem
                                        key={(entry as RoadmapItem).id}
                                        item={entry as RoadmapItem}
                                        index={currentIndex}
                                    />
                                );
                            }
                        })}
                    </div>
                </div>

                {/* Call To Action */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-24 p-12 border border-white/5 bg-white/[0.01] rounded-[2rem] text-center space-y-8 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />

                    <div className="relative space-y-4">
                        <h3 className="text-2xl md:text-3xl font-mono font-black uppercase tracking-tighter">¿Tenes_una_idea?</h3>
                        <p className="text-white/30 font-mono text-sm uppercase tracking-wide">
                            Este sitio se construye entre todos. Tus sugerencias son el motor de Wheels House.
                        </p>
                    </div>

                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-4 px-8 py-4 bg-accent text-dark font-black font-mono text-sm uppercase -skew-x-12 hover:scale-105 transition-all group"
                    >
                        <span className="skew-x-12 flex items-center gap-3">
                            Te escuchamos!
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                </motion.div>

                {/* Back to Top Button */}
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all group"
                    >
                        <ArrowUp className="w-4 h-4 text-accent" />
                        <span className="text-[10px] font-mono font-bold text-white/60 uppercase tracking-wider group-hover:text-white transition-colors">VOLVER_ARRIBA</span>
                    </motion.button>
                )}

            </div>
        </div>
    );
}

function SectionMilestone({ title, Icon, color }: { title: string, Icon: LucideIcon, color: string }) {
    const colorClasses: Record<string, string> = {
        emerald: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500 shadow-emerald-500/20',
        blue: 'bg-blue-500/20 border-blue-500/50 text-blue-500 shadow-blue-500/20',
        accent: 'bg-accent/20 border-accent/50 text-accent shadow-accent/20'
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="relative flex items-center justify-center py-12"
        >
            {/* Central Node (Milestone) */}
            <div className={`relative z-10 flex items-center gap-4 px-6 py-3 rounded-full border shadow-lg ${colorClasses[color]} backdrop-blur-sm`}>
                <Icon className="w-5 h-5" />
                <span className="text-sm font-mono font-black uppercase tracking-[0.2em]">
                    {title}
                </span>
            </div>

            {/* Horizontal decorative lines - extended */}
            <div className="absolute left-0 right-1/2 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-white/5 to-white/20 mr-8 hidden md:block" />
            <div className="absolute right-0 left-1/2 top-1/2 -translate-y-1/2 h-px bg-gradient-to-l from-transparent via-white/5 to-white/20 ml-8 hidden md:block" />
        </motion.div>
    );
}

function TimelineItem({ item, index }: { item: RoadmapItem, index: number }) {
    const isLeft = index % 2 === 0;

    // Status metadata
    const statusMeta: Record<string, { icon: LucideIcon, label: string, timeline: string }> = {
        'DEVELOPMENT': { icon: Rocket, label: 'EN_PROGRESO', timeline: 'Q1 2026' },
        'UPCOMING': { icon: Clock, label: 'PLANEADO', timeline: 'Q2 2026' },
        'CONCEPT': { icon: Lightbulb, label: 'CONCEPTO', timeline: 'FUTURO' }
    };

    const meta = statusMeta[item.statusType] || statusMeta['CONCEPT'];
    const MetaIcon = meta.icon;

    return (
        <div className="relative flex items-stretch py-6 min-h-[140px]">

            {/* Central Node - Larger with Glow */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 z-20">
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className="w-5 h-5 rounded-full bg-[#0a0a0b] border-2 border-accent/50 flex items-center justify-center shadow-[0_0_10px_rgba(var(--color-accent),0.3)]"
                >
                    <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                </motion.div>
            </div>

            {/* Connector Lines (Horizontal) - Both sides */}
            <div className={`absolute top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-white/5 to-white/15 hidden md:block ${isLeft ? 'left-[calc(50%+10px)] right-[calc(50%-2rem)]' : 'right-[calc(50%+10px)] left-[calc(50%-2rem)]'}`} style={{ width: '3rem' }} />
            <div className={`absolute top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-white/15 to-white/5 hidden md:block ${!isLeft ? 'left-[calc(50%+10px)]' : 'right-[calc(50%+10px)]'}`} style={{ width: '3rem' }} />

            {/* Left Side Content */}
            <div className={`hidden md:flex w-[calc(50%-2rem)] items-center ${isLeft ? 'justify-end pr-8' : 'justify-start pl-8'}`}>
                {isLeft ? (
                    /* Card on Left */
                    <TimelineCard item={item} isLeft={isLeft} />
                ) : (
                    /* Metadata on Left */
                    <MetadataPanel icon={MetaIcon} label={meta.label} timeline={meta.timeline} badge={item.badge} alignRight />
                )}
            </div>

            {/* Center Spacer */}
            <div className="hidden md:block w-16" />

            {/* Right Side Content */}
            <div className={`hidden md:flex w-[calc(50%-2rem)] items-center ${!isLeft ? 'justify-start pl-8' : 'justify-end pr-8'}`}>
                {!isLeft ? (
                    /* Card on Right */
                    <TimelineCard item={item} isLeft={isLeft} />
                ) : (
                    /* Metadata on Right */
                    <MetadataPanel icon={MetaIcon} label={meta.label} timeline={meta.timeline} badge={item.badge} />
                )}
            </div>

            {/* Mobile Layout - Card Only */}
            <div className="md:hidden ml-12 w-full">
                <TimelineCard item={item} isLeft={true} />
            </div>
        </div>
    );
}

function TimelineCard({ item, isLeft }: { item: RoadmapItem, isLeft: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full"
        >
            <div className="group relative bg-[#0c0c0e]/90 backdrop-blur-md border border-white/5 p-5 rounded-xl hover:border-white/15 transition-all hover:bg-white/[0.03]">

                {/* Status Badge */}
                <div className="absolute top-3 right-3 text-[7px] font-mono font-black text-emerald-500 uppercase tracking-[0.12em] px-2 py-0.5 border border-white/5 rounded bg-white/[0.02]">
                    {item.statusLabel}
                </div>

                <div className="space-y-3">
                    <span className="text-2xl block group-hover:scale-110 transition-transform duration-500 origin-left">
                        {item.badge}
                    </span>
                    <div className="space-y-1.5">
                        <h3 className="text-sm font-mono font-black uppercase tracking-tight text-white/90 group-hover:text-white transition-colors pr-14">
                            {item.title}
                        </h3>
                        <p className="text-[10px] text-white font-mono leading-relaxed group-hover:text-white/45 transition-colors">
                            {item.description}
                        </p>
                    </div>
                </div>

                {/* Decorative Footer */}
                <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                    <div className="flex gap-1">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-1 h-1 bg-white/10 rounded-full" />
                        ))}
                    </div>
                    <div className="w-5 h-[2px] bg-white/5 group-hover:w-10 group-hover:bg-accent/40 transition-all duration-500" />
                </div>

                {/* PCB Corner */}
                <div className={`absolute top-0 ${isLeft ? 'right-0 border-t border-r rounded-tr-xl' : 'left-0 border-t border-l rounded-tl-xl'} w-6 h-6 border-accent/15 hidden md:block`} />
            </div>
        </motion.div>
    );
}

function MetadataPanel({ icon: Icon, label, timeline, badge, alignRight }: { icon: LucideIcon, label: string, timeline: string, badge: string, alignRight?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`flex flex-col gap-3 ${alignRight ? 'items-end text-right' : 'items-start text-left'}`}
        >
            {/* Large Emoji */}
            <span className="text-4xl opacity-20">{badge}</span>

            {/* Status Icon + Label */}
            <div className={`flex items-center gap-2 ${alignRight ? 'flex-row-reverse' : ''}`}>
                <Icon className="w-4 h-4 text-white/20" />
                <span className="text-[10px] font-mono font-bold text-white/25 uppercase tracking-[0.15em]">
                    {label}
                </span>
            </div>

            {/* Timeline */}
            <div className="px-3 py-1 border border-white/5 rounded bg-white/[0.02]">
                <span className="text-[9px] font-mono font-black text-white/30 uppercase tracking-[0.2em]">
                    {timeline}
                </span>
            </div>

            {/* Decorative Dots */}
            <div className={`flex gap-1 ${alignRight ? 'flex-row-reverse' : ''}`}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-1 h-1 bg-white/5 rounded-full" />
                ))}
            </div>
        </motion.div>
    );
}
