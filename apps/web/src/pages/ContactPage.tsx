import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Send,
    MessageSquare,
    Terminal,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
    Loader2
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

type ContactReason = "BUG" | "SUGGESTION" | "GENERAL";

interface ContactForm {
    name: string;
    email: string;
    reason: ContactReason;
    message: string;
}

export default function ContactPage() {
    const { user } = useAuth();
    const [formData, setFormData] = useState<ContactForm>({
        name: "",
        email: "",
        reason: "GENERAL",
        message: ""
    });

    const [status, setStatus] = useState<"IDLE" | "SENDING" | "SUCCESS" | "ERROR">("IDLE");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (user?.username) {

        }
    }, [user]);

    const validateForm = () => {
        if (!formData.name.trim()) return "El nombre es obligatorio";
        if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) return "Email inválido";
        if (formData.message.trim().length < 10) return "El mensaje debe tener al menos 10 caracteres";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const error = validateForm();
        if (error) {
            toast.error(error);
            return;
        }

        setStatus("SENDING");

        // Mock Submission (1.5s delay)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log("Contact Data Received:", formData);

            setStatus("SUCCESS");
            toast.success("Mensaje enviado con éxito");
            setFormData({
                name: "",
                email: "",
                reason: "GENERAL",
                message: ""
            });
        } catch (err) {
            console.error("Submission error:", err);
            setStatus("ERROR");
            toast.error("Error al enviar el mensaje");
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white py-10 px-4 flex items-start justify-center pt-12">
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Side: Info & Visuals */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                            <Terminal className="w-3 h-3 text-accent" />
                            <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-accent">
                                CONTACTANOS
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-mono font-black uppercase tracking-tighter leading-none">
                            CENTRAL_DE <br />
                            <span className="text-accent underline decoration-4 underline-offset-8 decoration-accent/30">COMUNICACIÓN</span>
                        </h1>
                        <p className="text-white/40 font-mono text-sm max-w-md uppercase tracking-wide leading-relaxed">
                            ¿Tenes un error que reportar o una idea para mejorar el sitio?
                            Comentanos lo que quieras y necesites, estamos para todos.
                        </p>
                    </div>

                    {/* HUD Decorations */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border border-white/5 bg-white/[0.02] space-y-2">
                            <MessageSquare className="w-5 h-5 text-accent/50" />
                            <p className="text-[10px] font-mono font-bold text-white/30 uppercase">Canales_Abiertos</p>
                            <div className="h-1 w-full bg-accent/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-accent"
                                    animate={{ width: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                        </div>
                        <div className="p-4 border border-white/5 bg-white/[0.02] space-y-2">
                            <Send className="w-5 h-5 text-emerald-500/50" />
                            <p className="text-[10px] font-mono font-bold text-white/30 uppercase">Estado_Red</p>
                            <p className="text-[10px] font-mono font-black text-emerald-500 uppercase tracking-widest">FUNCIONAL</p>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Form Card */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative"
                >
                    {/* Background Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-blue-500/20 blur-2xl opacity-50 -z-10" />

                    <div className="bg-[#0f0f11]/80 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-2xl shadow-2xl relative overflow-hidden">

                        {/* Decorative Corner */}
                        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-accent/30 rounded-tr-2xl" />

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-mono font-black text-white/30 uppercase tracking-[0.2em] mb-2">TU_NOMBRE</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-accent/50 focus:ring-1 focus:ring-accent/50 outline-none transition-all placeholder:text-white/10"
                                        placeholder="EJ: NICOLAS_ABATI"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-mono font-black text-white/30 uppercase tracking-[0.2em] mb-2">TU_EMAIL</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-accent/50 focus:ring-1 focus:ring-accent/50 outline-none transition-all placeholder:text-white/10"
                                        placeholder="EJ: NICO@WHEELSHOUSE.COM"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-mono font-black text-white/30 uppercase tracking-[0.2em] mb-2">MOTIVO_CONTACTO</label>
                                    <select
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value as ContactReason })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-accent/50 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="GENERAL" className="bg-[#0a0a0b]">CONSULTA GENERAL</option>
                                        <option value="BUG" className="bg-[#0a0a0b]">REPORTAR UN PROBLEMA (BUG)</option>
                                        <option value="SUGGESTION" className="bg-[#0a0a0b]">SUGERENCIA O IDEA</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-mono font-black text-white/30 uppercase tracking-[0.2em] mb-2">DETALLE_MENSAJE (MIN. 10 CAR.)</label>
                                    <textarea
                                        required
                                        minLength={10}
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-accent/50 focus:ring-1 focus:ring-accent/50 outline-none transition-all placeholder:text-white/10 resize-none"
                                        placeholder="ESCRIBÍ ACÁ TU CONSULTA..."
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={status === "SENDING"}
                                className={`w-full group relative flex items-center justify-center gap-3 py-4 bg-accent text-dark font-black font-mono text-sm uppercase transition-all overflow-hidden -skew-x-12 ${status === "SENDING" ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                            >
                                <div className="skew-x-12 flex items-center gap-3">
                                    {status === "SENDING" ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Enviando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Enviar mensaje</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>

                                {/* Button Shine */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                            </button>
                        </form>

                        {/* Status Messages */}
                        {status === "SUCCESS" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-500"
                            >
                                <CheckCircle2 className="w-5 h-5 shrink-0" />
                                <span className="text-xs font-mono font-bold uppercase tracking-wider">Transmisión completada con éxito.</span>
                            </motion.div>
                        )}

                        {status === "ERROR" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500"
                            >
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <span className="text-xs font-mono font-bold uppercase tracking-wider">Error en la transmisión. Reintente.</span>
                            </motion.div>
                        )}
                    </div>

                    {/* Footer Info Field inside Card */}
                    <div className="mt-6 flex justify-between items-center px-2">
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-white/20 rounded-full" />)}
                        </div>
                        <span className="text-[8px] font-mono text-emerald-500 uppercase tracking-[0.3em]">SERVIDOR_SEGURO // TRANSMISION_ENCRYPTADA</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
