import { ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon: LucideIcon;
    onBack: () => void;
    actions?: ReactNode;
}

export default function PageHeader({ title, subtitle, icon: Icon, onBack, actions }: PageHeaderProps) {
    return (
        <header className="sticky top-0 z-40 bg-[#0a0a0b]/90 backdrop-blur-xl border-b border-white/5">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center gap-3">
                    {/* Back button */}
                    <button
                        onClick={onBack}
                        className="p-2 text-white/30 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    {/* Separator */}
                    <div className="w-px h-6 bg-white/10" />

                    {/* Icon */}
                    <div className="w-8 h-8 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-accent" />
                    </div>

                    {/* Title block */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-base md:text-lg font-mono font-bold text-white uppercase tracking-tight truncate">
                            {title.replace(/ /g, "_")}
                        </h1>
                        {subtitle && (
                            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] truncate">
                                // {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    {actions && (
                        <div className="flex items-center gap-2 shrink-0">
                            {actions}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
