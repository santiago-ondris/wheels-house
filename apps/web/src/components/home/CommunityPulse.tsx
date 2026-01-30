import { motion } from "framer-motion";
import { User, Car, Heart, Layers, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { getFeed, FeedItemDto } from "../../services/social.service";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";

const getActivityConfig = (type: string) => {
    switch (type) {
        case "car_added":
            return {
                icon: <Car className="w-4 h-4 text-emerald-400" />,
                action: "agregó un nuevo auto",
                color: "text-emerald-400"
            };
        case "group_created":
            return {
                icon: <Layers className="w-4 h-4 text-blue-400" />,
                action: "creó un nuevo grupo",
                color: "text-blue-400"
            };
        case "milestone_reached":
            return {
                icon: <Trophy className="w-4 h-4 text-amber-400" />,
                action: "alcanzó un hito",
                color: "text-amber-400"
            };
        case "wishlist_achieved":
            return {
                icon: <Heart className="w-4 h-4 text-pink-400" />,
                action: "¡consiguió un buscado!",
                color: "text-pink-400"
            };
        default:
            return {
                icon: <User className="w-4 h-4 text-accent" />,
                action: "realizó una acción",
                color: "text-accent"
            };
    }
};

export default function CommunityPulse() {
    const [activities, setActivities] = useState<FeedItemDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPulse = async () => {
            try {
                const response = await getFeed({ limit: 10, tab: 'explore' });
                setActivities(response.items);
            } catch (error) {
                console.error("Error fetching community pulse:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPulse();
    }, []);

    if (isLoading && activities.length === 0) return null;

    const displayActivities = activities.length > 0 && activities.length < 6
        ? [...activities, ...activities, ...activities]
        : [...activities, ...activities];

    return (
        <section className="container mx-auto px-6 py-16 md:py-20 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                        </span>
                        <span className="text-accent font-mono text-sm tracking-tighter uppercase font-bold">Live Network Feed</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.9] tracking-tighter mb-6">
                        EL PULSO DE LA
                        <br />
                        <span className="text-white/20">COMUNIDAD</span>
                    </h2>
                    <p className="text-white/60 text-lg max-w-md leading-relaxed border-l-2 border-accent/30 pl-6 py-2">
                        Hicimos un feed para que puedas ir viendo que están haciendo los demás coleccionistas en tiempo real.
                    </p>
                </motion.div>

                <div className="relative group">
                    {/* Technical Frame Decor */}
                    <div className="absolute -inset-4 border border-white/5 rounded-3xl pointer-events-none group-hover:border-white/10 transition-colors" />
                    <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-accent/20 rounded-tr-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-accent/20 rounded-bl-3xl pointer-events-none" />



                    {/* Feed Container */}
                    <Link to="/community" className="block cursor-pointer relative h-[450px] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a1a] shadow-2xl hover:border-accent/30 transition-colors">
                        {/* Scanline Effect */}
                        <div className="absolute inset-0 pointer-events-none z-20 opacity-20"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                                backgroundSize: '100% 4px, 3px 100%'
                            }} />

                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-accent/5 to-transparent pointer-events-none z-10" />

                        {/* Fading mask top and bottom */}
                        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#0a0a1a] via-[#0a0a1a]/80 to-transparent z-30 pointer-events-none" />
                        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/80 to-transparent z-30 pointer-events-none" />

                        <div className="flex flex-col gap-2 p-4 animate-scroll-vertical">
                            {displayActivities.map((activity, index) => {
                                const config = getActivityConfig(activity.type);
                                const timeStr = formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true, locale: es });

                                // Logic for item name and image
                                let itemName = "Actividad";
                                let itemImage = null;

                                if (activity.type === 'car_added') {
                                    itemName = activity.metadata?.carName || "Auto";
                                    itemImage = activity.metadata?.carImage;
                                } else if (activity.type === 'group_created') {
                                    itemName = activity.metadata?.groupName || "Grupo";
                                    itemImage = activity.metadata?.groupImage;
                                } else if (activity.type === 'milestone_reached') {
                                    itemName = `${activity.metadata?.milestone || activity.metadata?.carCount || '?'} AUTOS`;
                                } else if (activity.type === 'wishlist_achieved') {
                                    itemName = activity.metadata?.carName || "Auto";
                                    itemImage = activity.metadata?.carImage;
                                }

                                return (
                                    <div key={`${activity.id}-${index}`}
                                        className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.08] transition-all duration-300 group/item">
                                        <div className="relative shrink-0">
                                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden grayscale group-hover/item:grayscale-0 transition-all">
                                                {itemImage ? (
                                                    <img src={itemImage} alt={itemName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="text-xl font-black text-white/20 capitalize">{activity.username.charAt(0)}</div>
                                                )}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-md bg-[#0a0a1a] flex items-center justify-center border border-white/20 shadow-lg">
                                                {config.icon}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0 font-mono">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[10px] text-accent font-bold tracking-widest uppercase opacity-70">[{timeStr.toUpperCase()}]</span>
                                                <span className="text-[9px] text-white/20 uppercase">#EVENT_{activity.id}</span>
                                            </div>
                                            <p className="text-xs text-white/90 leading-tight">
                                                <span className="text-white font-bold">@{activity.username}</span>
                                                <br />
                                                <span className="text-white/40">{config.action}</span>
                                            </p>
                                            <p className={`text-sm font-bold mt-1 transition-colors truncate ${config.color || 'text-white'}`}>
                                                {itemName}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
