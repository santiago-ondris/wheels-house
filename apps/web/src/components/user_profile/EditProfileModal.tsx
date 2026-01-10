import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { PublicProfile, updateProfile } from "../../services/profile.service";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: PublicProfile;
    onSuccess: (updatedProfile: PublicProfile) => void;
}

export default function EditProfileModal({ isOpen, onClose, profile, onSuccess }: EditProfileModalProps) {
    const [firstName, setFirstName] = useState(profile.firstName);
    const [lastName, setLastName] = useState(profile.lastName);
    const [biography, setBiography] = useState(profile.biography || "");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setFirstName(profile.firstName);
        setLastName(profile.lastName);
        setBiography(profile.biography || "");
    }, [profile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const updated = await updateProfile({
                firstName,
                lastName,
                biography
            });
            onSuccess(updated);
            onClose();
        } catch (err: any) {
            setError(err.message || "Error al actualizar el perfil");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="EDITAR PERFIL">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                            Nombre
                        </label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/40 font-mono transition-colors"
                            placeholder="Nombre"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                            Apellido
                        </label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/40 font-mono transition-colors"
                            placeholder="Apellido"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                        Biografía
                    </label>
                    <textarea
                        value={biography}
                        onChange={(e) => setBiography(e.target.value)}
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/40 font-mono transition-colors resize-none"
                        placeholder="Cuenta algo sobre ti y tu colección..."
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
                        {isLoading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
