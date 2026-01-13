import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Key } from "lucide-react";
import { resetPassword } from "../../services/profile.service";
import PasswordInput from "../../components/auth/PasswordInput";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isTokenExpired, setIsTokenExpired] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.error("Token de recuperación no válido o ausente");
            navigate("/");
        }
    }, [token, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (newPassword.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await resetPassword(token!, newPassword);
            toast.success("¡Contraseña restablecida correctamente!");
            navigate("/");
        } catch (err: any) {
            const errorMsg = err?.error || "Error al restablecer la contraseña";
            setError(errorMsg);

            if (errorMsg.includes("expirado") || errorMsg.includes("inválido")) {
                setIsTokenExpired(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-md"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                        <Key className="text-accent" size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tighter uppercase">Nueva Contraseña</h1>
                    <p className="text-white/40 font-mono text-xs mt-2 text-center uppercase tracking-widest">
                        Ingresa tu nueva clave de acceso
                    </p>
                </div>

                {isTokenExpired ? (
                    <div className="space-y-6 text-center">
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <h2 className="text-red-400 font-black text-sm uppercase tracking-[0.2em] mb-2">
                                [ TOKEN EXPIRADO ]
                            </h2>
                            <p className="text-white/40 font-mono text-[10px] leading-relaxed uppercase">
                                El enlace de recuperación ya no es válido. Por razones de seguridad, estos enlaces expiran después de cierto tiempo.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/")}
                            className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
                        >
                            SOLICITAR NUEVO LINK
                        </button>

                        <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                            Volver al inicio para reiniciar el proceso
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                            <PasswordInput
                                id="new-password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={setNewPassword}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Confirmar Contraseña</label>
                            <PasswordInput
                                id="confirm-password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={setConfirmPassword}
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-[10px] font-mono uppercase tracking-widest animate-pulse">
                                [ ERROR: {error} ]
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-accent text-dark rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-accent/80 transition-all disabled:opacity-50"
                        >
                            {isLoading ? "PROCESANDO..." : "CAMBIAR CONTRASEÑA"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="w-full text-white/20 hover:text-white/40 font-mono text-[10px] transition-colors uppercase tracking-widest"
                        >
                            CANCELAR Y VOLVER
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
