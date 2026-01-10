import { useState } from "react";
import Modal from "../ui/Modal";
import { requestPasswordRecovery } from "../../services/profile.service";

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
    const [credential, setCredential] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await requestPasswordRecovery(credential);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Error al solicitar la recuperación");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="RECUPERAR CONTRASEÑA">
            {success ? (
                <div className="space-y-6 text-center py-4">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-accent text-2xl">✓</span>
                    </div>
                    <p className="text-white font-bold uppercase tracking-widest">Solicitud Enviada</p>
                    <p className="text-white/40 font-mono text-xs leading-relaxed max-w-sm mx-auto">
                        Si existe una cuenta asociada a <strong>{credential}</strong>, recibirás un correo con las instrucciones para restablecer tu contraseña.
                    </p>
                    <button
                        onClick={onClose}
                        className="mt-6 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-[10px] tracking-widest uppercase hover:bg-white/10 transition-all"
                    >
                        ENTENDIDO
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <p className="text-white/40 font-mono text-xs leading-relaxed">
                        Ingresa tu email o nombre de usuario y te enviaremos los pasos para recuperar tu acceso.
                    </p>

                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Email o Usuario</label>
                        <input
                            type="text"
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                            placeholder="tu@email.com o usuario"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/40 font-mono transition-colors"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-xs font-mono">{error}</p>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl font-mono text-xs text-white/40 hover:text-white transition-colors"
                        >
                            CANCELAR
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-3 bg-accent text-dark rounded-xl font-black text-xs uppercase tracking-widest hover:bg-accent/80 transition-all disabled:opacity-50"
                        >
                            {isLoading ? "ENVIANDO..." : "ENVIAR INSTRUCCIONES"}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
