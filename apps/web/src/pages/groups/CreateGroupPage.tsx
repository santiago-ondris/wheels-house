import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Folder,
    FileText,
    Save,
    Sparkles,
    Star,
    Check,
    Car,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import { createGroup, CreateGroupData } from "../../services/group.service";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigateBack } from "../../hooks/useNavigateBack";

interface GroupFormData {
    name: string;
    description: string;
    featured: boolean;
    cars: number[];
}

export default function CreateGroupPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState<GroupFormData>({
        name: "",
        description: "",
        featured: false,
        cars: [],
    });

    const [errors, setErrors] = useState<Partial<Record<keyof GroupFormData, string>>>({});
    const [isLoading, setIsLoading] = useState(false);


    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setErrors({});

        if (!formData.name.trim()) {
            setErrors({ name: "El nombre es requerido" });
            toast.error("Completá el nombre del grupo");
            return;
        }

        if (formData.name.length > 25) {
            setErrors({ name: "El nombre no puede tener más de 25 caracteres" });
            toast.error("El nombre es muy largo");
            return;
        }

        setIsLoading(true);
        try {
            const data: CreateGroupData = {
                name: formData.name,
                description: formData.description || undefined,
                featured: formData.featured,
                cars: formData.cars,
            };
            await createGroup(data);
            toast.success("¡Grupo creado exitosamente!");
            navigate(`/collection/${user?.username}/groups`, { replace: true });
        } catch (error: any) {
            if (error?.error?.includes("more than 4")) {
                toast.error("No podés tener más de 4 grupos destacados");
            } else if (error?.error?.includes("already have a group")) {
                toast.error("Ya tenés un grupo con este nombre");
            } else {
                toast.error("Error al crear el grupo. Intentá de nuevo.");
            }
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Safe back navigation with fallback
    const handleCancel = useNavigateBack(`/collection/${user?.username}/groups`);


    return (
        <div className="min-h-screen pb-32 md:pb-8">
            <PageHeader
                title="Crear Grupo"
                subtitle="Organizá tus autos como quieras"
                icon={Folder}
                onBack={handleCancel}
                actions={
                    <button
                        onClick={() => handleSubmit()}
                        disabled={isLoading}
                        className="hidden md:flex items-center gap-2 px-5 py-2 bg-accent hover:bg-accent/80 disabled:bg-accent/50 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all"
                    >
                        <Save className="w-4 h-4" />
                        {isLoading ? "Creando..." : "Crear"}
                    </button>
                }
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="container mx-auto px-4 py-6"
            >
                <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-4 h-4 text-accent" />
                            <h2 className="text-sm font-bold text-accent uppercase tracking-widest">
                                Información del Grupo
                            </h2>
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-6 space-y-5">
                            <div>
                                <label className="block text-accent uppercase tracking-widest text-[10px] font-bold mb-1.5 ml-1">
                                    Nombre del Grupo <span className="text-danger">*</span>
                                </label>
                                <div className="relative">
                                    <Folder className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 z-10" />
                                    <input
                                        type="text"
                                        placeholder="Ej: Mis JDM Favoritos"
                                        maxLength={25}
                                        value={formData.name}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                        className={`w-full bg-input-bg border ${errors.name ? "border-danger" : "border-white/5"} pl-12 pr-4 py-3.5 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-base md:text-lg`}
                                    />
                                </div>
                                <div className="flex justify-between mt-1 ml-1">
                                    {errors.name && <p className="text-danger text-[10px]">{errors.name}</p>}
                                    <p className="text-white/30 text-[10px] ml-auto">{formData.name.length}/25</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-white/50 uppercase tracking-widest text-[10px] font-bold mb-1.5 ml-1">
                                    Descripción <span className="text-white/30">(Opcional)</span>
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-4 w-5 h-5 text-white/40" />
                                    <textarea
                                        placeholder="Describe tu grupo..."
                                        maxLength={128}
                                        value={formData.description}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                        className="w-full bg-input-bg border border-white/5 pl-12 pr-4 py-3.5 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-base min-h-[100px] resize-none"
                                    />
                                </div>
                                <p className="text-white/30 text-[10px] mt-1 ml-1 text-right">{formData.description.length}/128</p>
                            </div>

                            <div
                                onClick={() => setFormData((prev) => ({ ...prev, featured: !prev.featured }))}
                                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${formData.featured ? "bg-accent/10 border-accent/50" : "bg-white/[0.02] border-white/5 hover:border-white/10"}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.featured ? "bg-accent text-white" : "bg-white/5 text-white/40"}`}>
                                    <Star className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-medium">Grupo Destacado</p>
                                    <p className="text-white/40 text-sm">Se mostrará en tu perfil público (máx 4)</p>
                                </div>
                                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${formData.featured ? "bg-accent border-accent" : "border-white/20"}`}>
                                    {formData.featured && <Check className="w-4 h-4 text-white" />}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="bg-white/[0.02] border border-white/10 border-dashed rounded-2xl p-8 text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Car className="w-8 h-8 text-white/20" />
                            </div>
                            <h3 className="text-white font-bold mb-2">¿Cómo añado vehículos?</h3>
                            <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed">
                                Crea tu grupo ahora y luego podrás añadir o quitar vehículos fácilmente desde la sección de gestión del grupo.
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-8 py-3 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all active:scale-95"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </motion.div>

            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3 }}
                className="md:hidden fixed bottom-0 left-0 right-0 bg-dark/95 backdrop-blur-xl border-t border-white/10 p-4 z-50"
            >
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="flex-1 px-6 py-4 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all active:scale-95"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => handleSubmit()}
                        disabled={isLoading}
                        className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-accent hover:bg-accent/80 disabled:bg-accent/50 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-accent/30"
                    >
                        <Save className="w-5 h-5" />
                        {isLoading ? "Creando..." : "Crear Grupo"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
