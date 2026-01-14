import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, AlertTriangle, ChevronLeft, Save } from "lucide-react";
import { useNavigate, useBlocker } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getPublicProfile, updateProfile, updatePassword, deleteUser } from "../../services/profile.service";
import PasswordInput from "../../components/auth/PasswordInput";
import Modal from "../../components/ui/Modal";
import ImageCropperModal from "../../components/ui/ImageCropperModal";
import toast from "react-hot-toast";

type SettingsTab = "profile" | "security";

export default function SettingsPage() {
    const { user, logout, updatePicture } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
    const [isLoading, setIsLoading] = useState(true);

    // Profile States
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [biography, setBiography] = useState("");
    const [picture, setPicture] = useState("");
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [tempImage, setTempImage] = useState<string | null>(null);
    const [isCropping, setIsCropping] = useState(false);
    const [pendingPictureBlob, setPendingPictureBlob] = useState<Blob | null>(null);

    // Password States
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    // Delete States
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [confirmUsername, setConfirmUsername] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    // Original values for change detection
    const [originalFirstName, setOriginalFirstName] = useState("");
    const [originalLastName, setOriginalLastName] = useState("");
    const [originalBiography, setOriginalBiography] = useState("");
    const [originalPicture, setOriginalPicture] = useState("");

    // Unsaved changes modal
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

    const hasUnsavedChanges = () => {
        return firstName !== originalFirstName ||
            lastName !== originalLastName ||
            biography !== originalBiography ||
            picture !== originalPicture;
    };

    // Block navigation when there are unsaved changes
    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            hasUnsavedChanges() &&
            currentLocation.pathname !== nextLocation.pathname
    );

    useEffect(() => {
        if (blocker.state === "blocked") {
            setPendingAction(() => () => blocker.proceed());
            setShowUnsavedModal(true);
        }
    }, [blocker.state]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.username) return;
            try {
                const data = await getPublicProfile(user.username);
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setBiography(data.biography || "");
                setPicture(data.picture || "");
                // Store original values
                setOriginalFirstName(data.firstName);
                setOriginalLastName(data.lastName);
                setOriginalBiography(data.biography || "");
                setOriginalPicture(data.picture || "");
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

        const reader = new FileReader();
        reader.onload = () => {
            setTempImage(reader.result as string);
            setIsCropping(true);
        };
        reader.readAsDataURL(file);

        // Reset input value
        e.target.value = '';
    };

    const handleCropSave = async (croppedBlob: Blob) => {
        setIsCropping(false);
        // Store the blob locally and create a preview URL
        setPendingPictureBlob(croppedBlob);
        const previewUrl = URL.createObjectURL(croppedBlob);
        setPicture(previewUrl);
        setTempImage(null);
        toast.success("Foto lista para guardar");
    };

    const handleCropCancel = () => {
        setIsCropping(false);
        setTempImage(null);
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName.trim()) {
            toast.error("El nombre es requerido");
            return;
        }

        if (!lastName.trim()) {
            toast.error("El apellido es requerido");
            return;
        }

        setIsUpdatingProfile(true);
        try {
            let finalPictureUrl = picture;

            // If there's a pending blob, upload it now
            if (pendingPictureBlob) {
                const { uploadImage } = await import("../../services/upload.service");
                const file = new File([pendingPictureBlob], "avatar.jpg", { type: "image/jpeg" });
                finalPictureUrl = await uploadImage(file);
                setPendingPictureBlob(null);
                setPicture(finalPictureUrl);
            }

            await updateProfile({ firstName, lastName, biography, picture: finalPictureUrl });
            // Update original values after successful save
            setOriginalFirstName(firstName);
            setOriginalLastName(lastName);
            setOriginalBiography(biography);
            setOriginalPicture(finalPictureUrl);
            // Update navbar avatar
            updatePicture(finalPictureUrl);
            toast.success("Perfil actualizado");
        } catch (error: any) {
            toast.error(error.message || "Error al actualizar perfil");
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!oldPassword.trim()) {
            toast.error("Ingresá tu contraseña actual");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        if (!/[A-Z]/.test(newPassword)) {
            toast.error("La contraseña debe tener al menos una mayúscula");
            return;
        }

        if (!/[a-z]/.test(newPassword)) {
            toast.error("La contraseña debe tener al menos una minúscula");
            return;
        }

        setIsUpdatingPassword(true);
        try {
            await updatePassword(oldPassword, newPassword);
            toast.success("Contraseña actualizada");
            setOldPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
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
        <div className="min-h-screen pb-20 bg-[#0a0a0b]">
            {/* Desktop Header - Sticky */}
            <header className="hidden lg:block sticky top-0 z-40 bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(`/collection/${user?.username}`)}
                            className="p-2 text-white/40 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-mono font-bold text-white flex items-center gap-3 uppercase tracking-tighter">
                                <User className="w-6 h-6 text-accent" />
                                Configuración_Cuenta
                            </h1>
                            <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
                                USUARIO: @{user?.username} // Editando perfil
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Header */}
            <div className="lg:hidden px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate(`/collection/${user?.username}`)}
                        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-mono text-[10px] tracking-widest uppercase">Volver</span>
                    </button>
                    <h1 className="text-sm font-black text-white tracking-tighter uppercase italic">CONFIGURACIÓN</h1>
                </div>
            </div>

            <main className="container mx-auto px-4 lg:px-6 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 lg:gap-16">
                    {/* Sidebar Navigation */}
                    <nav className="lg:sticky lg:top-24 lg:self-start space-y-3">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${activeTab === "profile"
                                ? "bg-accent text-dark font-black"
                                : "bg-white/[0.02] border border-white/5 text-white/40 hover:bg-white/5 hover:text-white hover:border-white/10"
                                }`}
                        >
                            <User size={20} className={activeTab === "profile" ? "" : "group-hover:text-accent transition-colors"} />
                            <div className="text-left">
                                <span className="font-mono text-sm tracking-wide uppercase block">Perfil</span>
                                <span className={`text-[10px] font-mono ${activeTab === "profile" ? "text-dark/60" : "text-white/20"}`}>Información pública</span>
                            </div>
                        </button>
                        <button
                            onClick={() => {
                                if (activeTab === "profile" && hasUnsavedChanges()) {
                                    setPendingAction(() => () => setActiveTab("security"));
                                    setShowUnsavedModal(true);
                                } else {
                                    setActiveTab("security");
                                }
                            }}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${activeTab === "security"
                                ? "bg-accent text-dark font-black"
                                : "bg-white/[0.02] border border-white/5 text-white/40 hover:bg-white/5 hover:text-white hover:border-white/10"
                                }`}
                        >
                            <Lock size={20} className={activeTab === "security" ? "" : "group-hover:text-accent transition-colors"} />
                            <div className="text-left">
                                <span className="font-mono text-sm tracking-wide uppercase block">Seguridad</span>
                                <span className={`text-[10px] font-mono ${activeTab === "security" ? "text-dark/60" : "text-white/20"}`}>Contraseña y cuenta</span>
                            </div>
                        </button>
                    </nav>

                    {/* Content Area */}
                    <div className="lg:bg-white/[0.01] lg:border lg:border-white/5 lg:rounded-3xl lg:p-10 min-h-[600px]">
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

                                    {/* Avatar & Bio Grid */}
                                    <div className="grid grid-cols-1 xl:grid-cols-[auto_1fr] gap-8">
                                        {/* Avatar Upload */}
                                        <div className="flex flex-col items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl h-fit">
                                            <div className="relative group">
                                                <div className="w-24 h-24 rounded-full border-2 border-accent/20 overflow-hidden bg-dark flex items-center justify-center">
                                                    {picture ? (
                                                        <img src={picture} alt="Avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="text-white/20" size={40} />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-3 text-center">
                                                <div className="space-y-1">
                                                    <h3 className="text-sm font-bold text-white uppercase tracking-tight">Foto de Perfil</h3>
                                                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest leading-tight">JPG, PNG o WEBP.<br />Máximo 10MB.</p>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="cursor-pointer px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all">
                                                        CAMBIAR FOTO
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={handleImageUpload}
                                                        />
                                                    </label>
                                                    {picture && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setPicture("")}
                                                            className="text-red-400/60 hover:text-red-400 font-mono text-[10px] uppercase tracking-widest transition-all"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Nombre</label>
                                                    <input
                                                        type="text"
                                                        value={firstName}
                                                        onChange={(e) => setFirstName(e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/40 font-mono transition-colors"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Apellido</label>
                                                    <input
                                                        type="text"
                                                        value={lastName}
                                                        onChange={(e) => setLastName(e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/40 font-mono transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between items-end px-1">
                                                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Biografía</label>
                                                    <span className={`text-[10px] font-mono ${biography.length >= 190 ? 'text-red-400' : 'text-white/20'}`}>
                                                        {biography.length}/200
                                                    </span>
                                                </div>
                                                <textarea
                                                    value={biography}
                                                    onChange={(e) => setBiography(e.target.value.slice(0, 200))}
                                                    maxLength={200}
                                                    rows={4}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/40 font-mono transition-colors resize-none lg:text-sm"
                                                    placeholder="Cuenta algo sobre tu pasión por los Hot Wheels..."
                                                />
                                            </div>

                                            <div className="flex justify-end pt-4">
                                                <button
                                                    type="submit"
                                                    disabled={isUpdatingProfile}
                                                    className="inline-flex items-center gap-3 px-10 py-4 bg-accent text-dark rounded-xl font-black text-xs uppercase tracking-widest hover:bg-accent/80 transition-all disabled:opacity-50"
                                                >
                                                    <Save size={16} />
                                                    {isUpdatingProfile ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
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

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                                            <p className="text-white/30 text-[10px] font-mono ml-1 mb-1">
                                                Mínimo 8 caracteres, una mayúscula y una minúscula
                                            </p>
                                            <PasswordInput
                                                id="new-password"
                                                placeholder="••••••••"
                                                value={newPassword}
                                                onChange={setNewPassword}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Confirmar Nueva Contraseña</label>
                                            <PasswordInput
                                                id="confirm-new-password"
                                                placeholder="••••••••"
                                                value={confirmNewPassword}
                                                onChange={setConfirmNewPassword}
                                                error={confirmNewPassword !== "" && newPassword !== confirmNewPassword ? "Las contraseñas no coinciden" : undefined}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isUpdatingPassword || (confirmNewPassword !== "" && newPassword !== confirmNewPassword)}
                                            className="px-8 py-4 bg-white text-dark rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            ACTUALIZAR CONTRASEÑA
                                        </button>
                                    </form>

                                    <div className="pt-10 mt-10 border-t border-white/5">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-red-500/5 border border-red-500/10 rounded-2xl">
                                            <div className="space-y-1">
                                                <h3 className="text-sm font-bold text-red-500 uppercase tracking-tight">Zona de Peligro</h3>
                                                <p className="text-[10px] font-mono text-red-500/40 uppercase tracking-widest">Eliminar tu cuenta es una acción irreversible</p>
                                            </div>
                                            <button
                                                onClick={() => setIsDeleteModalOpen(true)}
                                                className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl font-mono text-[10px] uppercase tracking-widest transition-all border border-red-500/20"
                                            >
                                                BORRAR_CUENTA
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Unsaved Changes Modal */}
            <Modal
                isOpen={showUnsavedModal}
                onClose={() => {
                    setShowUnsavedModal(false);
                    setPendingAction(null);
                    if (blocker.state === "blocked") {
                        blocker.reset();
                    }
                }}
                title="CAMBIOS SIN GUARDAR"
            >
                <div className="space-y-6">
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <div className="flex gap-3 text-amber-500 mb-3">
                            <AlertTriangle size={18} />
                            <span className="font-bold text-xs uppercase">Advertencia</span>
                        </div>
                        <p className="text-xs text-amber-500/80 font-mono leading-relaxed">
                            Tenes cambios sin guardar. Si continuas, vas a perder los cambios.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            onClick={() => {
                                // Reset to original values
                                setFirstName(originalFirstName);
                                setLastName(originalLastName);
                                setBiography(originalBiography);
                                setPicture(originalPicture);
                                setShowUnsavedModal(false);
                                if (pendingAction) {
                                    pendingAction();
                                    setPendingAction(null);
                                }
                            }}
                            className="w-full py-4 bg-amber-500 text-dark rounded-xl font-black text-xs uppercase tracking-[0.1em] hover:bg-amber-600 transition-all"
                        >
                            DESCARTAR CAMBIOS Y CONTINUAR
                        </button>
                        <button
                            onClick={() => {
                                setShowUnsavedModal(false);
                                setPendingAction(null);
                                if (blocker.state === "blocked") {
                                    blocker.reset();
                                }
                            }}
                            className="w-full py-3 text-white/40 hover:text-white font-mono text-[10px] transition-colors uppercase tracking-widest"
                        >
                            VOLVER Y GUARDAR CAMBIOS
                        </button>
                    </div>
                </div>
            </Modal>

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

            {isCropping && tempImage && (
                <ImageCropperModal
                    image={tempImage}
                    onSave={handleCropSave}
                    onCancel={handleCropCancel}
                    aspect={1 / 1}
                    cropShape="round"
                />
            )}
        </div>
    );
}
