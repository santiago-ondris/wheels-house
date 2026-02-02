import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare,
    Clock,
    CheckCircle2,
    AlertCircle,
    Search,
    Save,
    Loader2,
    X,
    Archive,
    ArchiveRestore,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { contactService, ContactMessage, AdminMessagesResponse } from "../../services/contact.service";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminContactPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<ContactMessage['status'] | 'ALL' | 'ARCHIVED'>('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationMeta, setPaginationMeta] = useState<AdminMessagesResponse['meta'] | null>(null);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [adminNotes, setAdminNotes] = useState("");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const load = async () => {
            await fetchMessages(currentPage, filter);
            // Forza el scroll al inicio después de cargar la nueva página
            window.scrollTo({ top: 0, behavior: 'instant' });
        };
        load();
    }, [currentPage, filter]);

    const fetchMessages = async (page: number, currentFilter: string) => {
        setLoading(true);
        try {
            const options: any = { page, limit: 10 };

            if (currentFilter === 'ARCHIVED') {
                options.archived = true;
            } else {
                options.archived = false;
                if (currentFilter !== 'ALL') {
                    options.status = currentFilter;
                }
            }

            const response = await contactService.getAdminMessages(options);
            setMessages(response.data);
            setPaginationMeta(response.meta);
        } catch (error) {
            toast.error("Error al cargar mensajes");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: number, status: string) => {
        setUpdating(true);
        try {
            await contactService.updateMessageStatus(id, status, adminNotes);
            toast.success("Estado actualizado");
            await fetchMessages(currentPage, filter);
            if (selectedMessage?.contactMessageId === id) {
                const response = await contactService.getAdminMessages({ page: currentPage, limit: 10, status: filter === 'ALL' ? undefined : filter as any });
                const refreshedMsg = response.data.find(m => m.contactMessageId === id);
                if (refreshedMsg) setSelectedMessage(refreshedMsg);
            }
        } catch (error) {
            toast.error("Error al actualizar");
        } finally {
            setUpdating(false);
        }
    };

    const handleArchive = async (id: number, archived: boolean) => {
        setUpdating(true);
        try {
            await contactService.archiveMessage(id, archived);
            toast.success(archived ? "Mensaje archivado" : "Mensaje restaurado");
            await fetchMessages(currentPage, filter);
            if (selectedMessage?.contactMessageId === id) {
                if (archived && filter !== 'ARCHIVED') {
                    setSelectedMessage(null);
                } else {
                    const response = await contactService.getAdminMessages({ page: currentPage, limit: 10, archived: filter === 'ARCHIVED' });
                    const refreshedMsg = response.data.find(m => m.contactMessageId === id);
                    if (refreshedMsg) setSelectedMessage(refreshedMsg);
                }
            }
        } catch (error) {
            toast.error("Error al procesar");
        } finally {
            setUpdating(false);
        }
    };

    const getReasonColor = (reason: string) => {
        switch (reason) {
            case 'BUG': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'SUGGESTION': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'RESOLVED': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'READ': return <Clock className="w-4 h-4 text-blue-500" />;
            default: return <AlertCircle className="w-4 h-4 text-amber-500" />;
        }
    };

    const MessageDetail = ({ msg, isInline = false }: { msg: ContactMessage, isInline?: boolean }) => (
        <motion.div
            initial={isInline ? { opacity: 0, height: 0 } : { opacity: 0, y: 20 }}
            animate={isInline ? { opacity: 1, height: 'auto' } : { opacity: 1, y: 0 }}
            exit={isInline ? { opacity: 0, height: 0 } : { opacity: 0, scale: 0.95 }}
            className={`bg-[#0f0f11]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl ${isInline ? 'mt-4 border-accent/20' : ''}`}
        >
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30 text-accent font-mono font-black text-xl">
                        {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-lg font-mono font-black uppercase tracking-tighter leading-none">
                            {msg.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{msg.email}</p>
                            {msg.archived && (
                                <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-white/40 font-black">ARCHIVADO</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleArchive(msg.contactMessageId, !msg.archived);
                        }}
                        className={`p-2 border rounded-lg transition-all group ${msg.archived
                            ? 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                        title={msg.archived ? "Restaurar" : "Archivar"}
                    >
                        {msg.archived ? (
                            <ArchiveRestore className="w-4 h-4 text-emerald-500" />
                        ) : (
                            <Archive className="w-4 h-4 text-white/60 group-hover:text-accent" />
                        )}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMessage(null);
                        }}
                        className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all group"
                        title="Cerrar"
                    >
                        <X className="w-4 h-4 text-white/60 group-hover:text-red-500" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                        <p className="text-[8px] font-mono font-bold text-white/20 uppercase mb-1">CATEGORIA</p>
                        <p className="text-[10px] font-mono font-black text-white/60">{msg.reason}</p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                        <p className="text-[8px] font-mono font-bold text-white/20 uppercase mb-1">ENVIADO</p>
                        <p className="text-[10px] font-mono font-black text-white/60">
                            {format(new Date(msg.createdAt), 'dd MMMM yyyy', { locale: es })}
                        </p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl col-span-2 md:col-span-1">
                        <p className="text-[8px] font-mono font-bold text-white/20 uppercase mb-1">USUARIO_ID</p>
                        <p className="text-[10px] font-mono font-black text-accent/80">{msg.userId || 'INVITADO'}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-mono font-black text-white/30 uppercase tracking-[0.2em]">
                        <Clock className="w-3 h-3" />
                        <span>MENSAJE_RECIBIDO</span>
                    </div>
                    <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl relative">
                        <p className="text-sm font-mono leading-relaxed text-white/80 whitespace-pre-wrap">
                            {msg.message}
                        </p>
                        <div className="absolute top-0 right-4 w-4 h-1 bg-accent/30" />
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-6">
                    <div className="space-y-4">
                        <label className="block text-[10px] font-mono font-black text-white/30 uppercase tracking-[0.2em]">NOTAS_ADMINISTRATIVAS</label>
                        <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-accent/50 outline-none transition-all placeholder:text-white/10 resize-none h-24"
                            placeholder="Escribí acá notas internas..."
                        />
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {(['PENDING', 'READ', 'RESOLVED'] as const).map(status => (
                            <button
                                key={status}
                                disabled={updating || msg.status === status}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatus(msg.contactMessageId, status);
                                }}
                                className={`flex-1 py-3 font-mono font-black text-[10px] uppercase rounded-xl border transition-all ${msg.status === status
                                    ? status === 'PENDING' ? 'bg-amber-500/20 border-amber-500/50 text-amber-500' :
                                        status === 'READ' ? 'bg-blue-500/20 border-blue-500/50 text-blue-500' :
                                            'bg-emerald-500/20 border-emerald-500/50 text-emerald-500'
                                    : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                                    }`}
                            >
                                {status === 'PENDING' ? 'Pendiente' : status === 'READ' ? 'Leído' : 'Resuelto'}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(msg.contactMessageId, msg.status);
                        }}
                        disabled={updating}
                        className="w-full py-4 bg-accent text-dark font-mono font-black text-[11px] uppercase rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Guardar Notas
                    </button>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white pt-12 pb-12 px-4">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                            <MessageSquare className="w-3 h-3 text-accent" />
                            <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-accent">ADMIN_CONTROL</span>
                        </div>
                        <h1 className="text-4xl font-mono font-black uppercase tracking-tighter">
                            CENTRAL_DE <span className="text-white/40">MENSAJES</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 p-1 rounded-xl">
                        {(['ALL', 'PENDING', 'READ', 'RESOLVED', 'ARCHIVED'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => {
                                    setFilter(s);
                                    setCurrentPage(1);
                                    setSelectedMessage(null);
                                }}
                                className={`px-4 py-2 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${filter === s ? 'bg-accent text-dark' : 'hover:bg-white/5 text-white/40'}`}
                            >
                                {s === 'ARCHIVED' ? 'ARCHIVADOS' : (s === 'ALL' ? 'TODOS' : s)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-12 xl:col-span-5 space-y-4">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
                                <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
                                <p className="text-xs font-mono text-white/20 uppercase tracking-widest">Sincronizando mensajes...</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl text-center px-4">
                                <Search className="w-8 h-8 text-white/10 mb-4" />
                                <p className="text-xs font-mono text-white/20 uppercase tracking-widest">No se encontraron mensajes</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div key={msg.contactMessageId}>
                                        <motion.div
                                            layoutId={`msg-${msg.contactMessageId}`}
                                            onClick={() => {
                                                setSelectedMessage(msg);
                                                setAdminNotes(msg.adminNotes || "");
                                            }}
                                            className={`relative group cursor-pointer p-4 rounded-2xl border transition-all ${selectedMessage?.contactMessageId === msg.contactMessageId
                                                ? 'bg-accent/5 border-accent/50 shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)]'
                                                : 'bg-[#0f0f11] border-white/5 hover:border-white/20'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className={`px-2 py-0.5 rounded text-[8px] font-mono font-black border ${getReasonColor(msg.reason)}`}>{msg.reason}</div>
                                                    {msg.archived && <div className="px-2 py-0.5 rounded text-[8px] font-mono font-black border border-white/10 bg-white/5 text-white/40">ARCHIVADO</div>}
                                                </div>
                                                {getStatusIcon(msg.status)}
                                            </div>
                                            <h3 className="text-sm font-mono font-bold mb-1 group-hover:text-accent transition-colors truncate">{msg.name}</h3>
                                            <p className="text-[10px] text-white/40 font-mono truncate mb-3">{msg.email}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-mono text-white/20">{format(new Date(msg.createdAt), 'dd MMM, HH:mm', { locale: es })}</span>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3].map(i => <div key={i} className={`w-1 h-1 rounded-full ${selectedMessage?.contactMessageId === msg.contactMessageId ? 'bg-accent' : 'bg-white/10'}`} />)}
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Inline Detail for Mobile / Tablet */}
                                        <div className="xl:hidden">
                                            <AnimatePresence>
                                                {selectedMessage?.contactMessageId === msg.contactMessageId && (
                                                    <MessageDetail msg={selectedMessage} isInline />
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                ))}

                                {paginationMeta && paginationMeta.totalPages > 1 && (
                                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 bg-white/5 border border-white/10 rounded-xl disabled:opacity-20 hover:bg-white/10 transition-all group">
                                            <ChevronLeft className="w-4 h-4 text-white group-hover:text-accent" />
                                        </button>
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-mono font-black text-white/40 uppercase tracking-widest">PAGINA {currentPage} DE {paginationMeta.totalPages}</span>
                                            <span className="text-[8px] font-mono text-white/10 uppercase">TOTAL {paginationMeta.total} MENSAJES</span>
                                        </div>
                                        <button disabled={currentPage === paginationMeta.totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 bg-white/5 border border-white/10 rounded-xl disabled:opacity-20 hover:bg-white/10 transition-all group">
                                            <ChevronRight className="w-4 h-4 text-white group-hover:text-accent" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Desktop Sidebar (visible only on XL+) */}
                    <div className="hidden xl:block xl:col-span-7 sticky top-24">
                        <AnimatePresence mode="wait">
                            {selectedMessage ? (
                                <MessageDetail msg={selectedMessage} />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center py-40 text-center opacity-20">
                                    <MessageSquare className="w-16 h-16 mb-6 stroke-[1]" />
                                    <p className="font-mono text-sm uppercase tracking-[0.3em]">Seleccioná un mensaje para ver el detalle</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
