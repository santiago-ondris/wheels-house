import { useState } from "react";
import { Lock, Trash2, AlertTriangle } from "lucide-react";
import { updatePassword, deleteUser } from "../../services/profile.service";
import { useAuth } from "../../contexts/AuthContext";
import Modal from "../ui/Modal";

export default function SecuritySection({ username }: { username: string }) {
    const { logout } = useAuth();

    // Password States
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [pwdError, setPwdError] = useState<string | null>(null);
    const [pwdSuccess, setPwdSuccess] = useState(false);

    // Delete States
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [confirmUsername, setConfirmUsername] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [delError, setDelError] = useState<string | null>(null);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingPassword(true);
        setPwdError(null);
        setPwdSuccess(false);

        try {
            await updatePassword(currentPassword, newPassword);
            setPwdSuccess(true);
            setCurrentPassword("");
            setNewPassword("");
        } catch (err: any) {
            setPwdError(err.message || "Error al actualizar contraseña");
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (confirmUsername !== username) return;

        setIsDeleting(true);
        setDelError(null);

        try {
            await deleteUser();
            logout(); // Redirects to home
        } catch (err: any) {
            setDelError(err.message || "Error al eliminar la cuenta");
            setIsDeleting(false);
        }
    };

    return (
        <section className="mt-12 mb-20 space-y-10">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
                    <Lock className="text-accent" size={24} />
                    Seguridad y Cuenta
                </h2>
                <div className="h-1 w-12 bg-accent mt-2" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Password Update */}
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">Cambiar Contraseña</h3>
                        <p className="text-xs text-white/40 font-mono mt-1">Actualiza tus credenciales de acceso</p>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Contraseña Actual</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/40 font-mono transition-colors"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Nueva Contraseña</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/40 font-mono transition-colors"
                                required
                            />
                        </div>

                        {pwdError && <p className="text-red-400 text-[10px] font-mono">{pwdError}</p>}
                        {pwdSuccess && <p className="text-accent text-[10px] font-mono uppercase tracking-widest font-bold">✓ Contraseña actualizada!</p>}

                        <button
                            type="submit"
                            disabled={isUpdatingPassword}
                            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold text-[10px] tracking-widest uppercase transition-all"
                        >
                            {isUpdatingPassword ? "PROCESANDO..." : "ACTUALIZAR CREDENCIALES"}
                        </button>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-500/[0.02] border border-red-500/20 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
                    <div className="space-y-6">
                        <div className="flex items-start gap-4 text-red-400">
                            <AlertTriangle className="flex-shrink-0 mt-1" size={32} />
                            <div>
                                <h3 className="text-lg font-bold uppercase tracking-tight">Zona de Peligro</h3>
                                <p className="text-xs font-mono mt-1 opacity-60">Eliminar tu cuenta es una acción permanente y no se puede deshacer.</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-xs font-mono text-red-400/60 leading-relaxed">
                            <p>• Se borrarán todos tus vehículos y grupos.</p>
                            <p>• Perderás acceso a tu perfil @{username}.</p>
                            <p>• Los datos serán eliminados de nuestros servidores.</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-500 font-black text-[10px] tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3"
                    >
                        <Trash2 size={14} />
                        ELIMINAR MI CUENTA permanentemente
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="ESTÁS POR ELIMINAR TU CUENTA"
            >
                <div className="space-y-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-mono leading-normal">
                        Esta acción es <strong>IRREVERSIBLE</strong>. Por favor escribe tu nombre de usuario <strong>{username}</strong> para confirmar.
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Confirma tu usuario</label>
                        <input
                            type="text"
                            value={confirmUsername}
                            onChange={(e) => setConfirmUsername(e.target.value)}
                            placeholder={username}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/40 font-mono transition-colors"
                        />
                    </div>

                    {delError && <p className="text-red-400 text-[10px] font-mono">{delError}</p>}

                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            onClick={handleDeleteAccount}
                            disabled={isDeleting || confirmUsername !== username}
                            className="w-full py-4 bg-red-500 text-white rounded-xl font-black text-xs uppercase tracking-[0.1em] hover:bg-red-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? "ELIMINANDO..." : "CONFIRMO QUE QUIERO ELIMINAR MI CUENTA"}
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="w-full py-3 text-white/40 hover:text-white font-mono text-[10px] transition-colors uppercase tracking-widest"
                        >
                            MEJOR NO, VOLVER ATRÁS
                        </button>
                    </div>
                </div>
            </Modal>
        </section>
    );
}
