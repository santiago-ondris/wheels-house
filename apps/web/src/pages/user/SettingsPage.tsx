import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Trash2, AlertTriangle, ChevronLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getPublicProfile, updateProfile, updatePassword, deleteUser } from "../../services/profile.service";
import PasswordInput from "../../components/auth/PasswordInput";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";

type SettingsTab = "profile" | "security";

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
    const [isLoading, setIsLoading] = useState(true);

    // Profile States
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [biography, setBiography] = useState("");
    const [picture, setPicture] = useState("");
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // Password States
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    // Delete States
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [confirmUsername, setConfirmUsername] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.username) return;
            try {
                const data = await getPublicProfile(user.username);
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setBiography(data.biography || "");
                setPicture(data.picture || "");
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("No se pudo cargar el perfil");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        try {
            const { uploadImage } = await import("../../services/upload.service");
            const imageUrl = await uploadImage(file);
            setPicture(imageUrl);
            toast.success("Imagen subida");
        } catch (error: any) {
            toast.error(error.message || "Error al subir imagen");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingProfile(true);
        try {
            await updateProfile({ firstName, lastName, biography, picture });
            toast.success("Perfil actualizado");
        } catch (error: any) {
            toast.error(error.message || "Error al actualizar perfil");
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingPassword(true);
        try {
            await updatePassword(oldPassword, newPassword);
            toast.success("Contraseña actualizada");
            setOldPassword("");
            setNewPassword("");
        } catch (error: any) {
            toast.error(error.message || "Error al actualizar contraseña");
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (confirmUsername !== user?.username) return;
        setIsDeleting(true);
        try {
            await deleteUser();
            toast.success("Cuenta eliminada");
            logout();
        } catch (error: any) {
            toast.error(error.message || "Error al eliminar cuenta");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center font-mono text-accent">CARGANDO_SISTEMA...</div>;

    return (
        <div className="container mx-auto px-4 py-10 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <button
                    onClick={() => navigate(`/collection/${user?.username}`)}
                    className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono text-xs tracking-widest uppercase">Volver al Perfil</span>
                </button>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">CONFIGURACIÓN</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12">
                {/* Sidebar Navigation */}
                <nav className="flex flex-col gap-2">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === "profile"
                            ? "bg-accent text-dark font-black"
                            : "text-white/40 hover:bg-white/5 hover:text-white"
                            }`}
                    >
                        <User size={18} />
                        <span className="font-mono text-xs tracking-widest uppercase">Perfil</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("security")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === "security"
                            ? "bg-accent text-dark font-black"
                            : "text-white/40 hover:bg-white/5 hover:text-white"
                            }`}
                    >
                        <Lock size={18} />
                        <span className="font-mono text-xs tracking-widest uppercase">Seguridad</span>
                    </button>
                    <div className="mt-8 pt-8 border-t border-white/5">
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all w-full"
                        >
                            <Trash2 size={18} />
                            <span className="font-mono text-xs tracking-widest uppercase">Borrar Cuenta</span>
                        </button>
                    </div>
                </nav>

                {/* Content Area */}
                <main className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                    <AnimatePresence mode="wait">
                        {activeTab === "profile" ? (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-1">
                                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">Información de Perfil</h2>
                                    <p className="text-xs text-white/40 font-mono">Actualiza cómo te ven los demás coleccionistas</p>
                                </div>

                                {/* Avatar Upload */}
                                <div className="flex flex-col items-center sm:flex-row gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-full border-2 border-accent/20 overflow-hidden bg-dark flex items-center justify-center">
                                            {picture ? (
                                                <img src={picture} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="text-white/20" size={40} />
                                            )}
                                        </div>
                                        {isUploadingImage && (
                                            <div className="absolute inset-0 bg-dark/60 rounded-full flex items-center justify-center">
                                                <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-3 text-center sm:text-left">
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-bold text-white uppercase tracking-tight">Foto de Perfil</h3>
                                            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">JPG, PNG o WEBP. Máximo 10MB.</p>
                                        </div>
                                        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                                            <label className="cursor-pointer px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all">
                                                {isUploadingImage ? "SUBIENDO..." : "CAMBIAR FOTO"}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    disabled={isUploadingImage}
                                                />
                                            </label>
                                            {picture && (
                                                <button
                                                    type="button"
                                                    onClick={() => setPicture("")}
                                                    className="px-4 py-2 text-red-400/60 hover:text-red-400 font-mono text-[10px] uppercase tracking-widest transition-all"
                                                >
                                                    Eliminar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Nombre</label>
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/40 font-mono transition-colors"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Apellido</label>
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/40 font-mono transition-colors"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Biografía</label>
                                        <textarea
                                            value={biography}
                                            onChange={(e) => setBiography(e.target.value)}
                                            rows={5}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/40 font-mono transition-colors resize-none lg:text-sm"
                                            placeholder="Cuenta algo sobre tu pasión por los Hot Wheels..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isUpdatingProfile}
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-dark rounded-xl font-black text-xs uppercase tracking-widest hover:bg-accent/80 transition-all disabled:opacity-50"
                                    >
                                        <Save size={16} />
                                        {isUpdatingProfile ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="security"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-1">
                                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">Acceso y Seguridad</h2>
                                    <p className="text-xs text-white/40 font-mono">Que sea una contraseña fuerte y que no te vayas a olvidar...</p>
                                </div>

                                <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Contraseña Actual</label>
                                        <PasswordInput
                                            id="old-password"
                                            placeholder="••••••••"
                                            value={oldPassword}
                                            onChange={setOldPassword}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                                        <PasswordInput
                                            id="new-password"
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={setNewPassword}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isUpdatingPassword}
                                        className="px-8 py-4 bg-white text-dark rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/80 transition-all disabled:opacity-50"
                                    >
                                        ACTUALIZAR CREDENCIALES
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            {/* Delete Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="SISTEMA: BORRADO PERMANENTE"
            >
                <div className="space-y-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <div className="flex gap-3 text-red-500 mb-3">
                            <AlertTriangle size={18} />
                            <span className="font-bold text-xs uppercase">Advertencia Crítica</span>
                        </div>
                        <p className="text-xs text-red-500/80 font-mono leading-relaxed">
                            Estas por eliminar todos tus datos. Esta acción no se puede deshacer. Escribe tu usuario <strong>{user?.username}</strong> para confirmar.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Confirma tu usuario</label>
                        <input
                            type="text"
                            value={confirmUsername}
                            onChange={(e) => setConfirmUsername(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/40 font-mono transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            onClick={handleDeleteAccount}
                            disabled={isDeleting || confirmUsername !== user?.username}
                            className="w-full py-4 bg-red-500 text-white rounded-xl font-black text-xs uppercase tracking-[0.1em] hover:bg-red-600 transition-all disabled:opacity-30"
                        >
                            {isDeleting ? "BORRANDO..." : "CONFIRMAR BORRADO"}
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="w-full py-3 text-white/40 hover:text-white font-mono text-[10px] transition-colors uppercase tracking-widest"
                        >
                            CANCELAR OPERACIÓN
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
