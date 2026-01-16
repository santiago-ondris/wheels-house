import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Car,
    Tag,
    Palette,
    Ruler,
    Factory,
    Save,
    Zap,
    Eye,
    AlertTriangle,
    ExternalLink,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import { quickAddCarSchema, QuickAddCarFormData, QuickAddCarPayload } from "../../lib/validations/quickAddCar";
import { createCar } from "../../services/car.service";
import { scales, manufacturers, brands, colors, brandNationalities } from "../../data/carOptions";
import FieldSelector from "../../components/cars/addcar/FieldSelector";
import SuggestionInput from "../../components/ui/SuggestionInput";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigateBack } from "../../hooks/useNavigateBack";
import { useCarSuggestions } from "../../hooks/useCarSuggestions";

const initialFormData: QuickAddCarFormData = {
    name: "",
    color: "",
    brand: "",
    scale: "",
    manufacturer: "",
};

export default function QuickAddPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState<QuickAddCarFormData>(initialFormData);
    const [errors, setErrors] = useState<Partial<Record<keyof QuickAddCarFormData, string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [formKey, setFormKey] = useState(0);
    const { suggestions, addLocalSuggestion } = useCarSuggestions();

    const handleCancel = useNavigateBack(`/collection/${user?.username || ''}`);

    const updateField = (field: keyof QuickAddCarFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const validateAndGetPayload = (): QuickAddCarPayload | null => {
        setErrors({});
        const result = quickAddCarSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors: Partial<Record<keyof QuickAddCarFormData, string>> = {};
            result.error.issues.forEach((err) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0] as keyof QuickAddCarFormData] = err.message;
                }
            });
            setErrors(fieldErrors);
            toast.error("Completá los campos obligatorios");
            return null;
        }

        // Create full payload with defaults
        return {
            ...result.data,
            condition: "Abierto",
            description: "",
            designer: "",
            series: "",
            country: brandNationalities[result.data.brand] || "",
            pictures: [],
        };
    };

    const resetFormAndFocus = () => {
        setFormData(initialFormData);
        setErrors({});
        // Increment formKey to force FieldSelector and SuggestionInput components to remount and reset their internal state
        setFormKey((prev) => prev + 1);
    };

    // Primary save: clear form, show toast with link
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = validateAndGetPayload();
        if (!payload) return;

        setIsLoading(true);
        try {
            const carId = await createCar(payload);

            // Add the name to local suggestions so it appears immediately for the next entry
            addLocalSuggestion(payload.name);

            resetFormAndFocus();

            toast.success(
                (t) => (
                    <div className="flex items-center gap-3">
                        <span>Auto guardado ✓</span>
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                navigate(`/car/${carId}`);
                            }}
                            className="flex items-center gap-1 text-accent font-bold hover:underline"
                        >
                            Ver auto <ExternalLink className="w-3 h-3" />
                        </button>
                    </div>
                ),
                { duration: 5000 }
            );
        } catch (error: any) {
            toast.error("Error al agregar el auto. Intentá de nuevo.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Secondary save: redirect to car detail
    const handleSaveAndView = async () => {
        const payload = validateAndGetPayload();
        if (!payload) return;

        setIsLoading(true);
        try {
            const carId = await createCar(payload);
            toast.success("¡Auto agregado!");
            navigate(`/car/${carId}`);
        } catch (error: any) {
            toast.error("Error al agregar el auto. Intentá de nuevo.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pb-32 md:pb-8">
            <PageHeader
                title="Carga rápida"
                subtitle="Carga rápida de vehículos"
                icon={Zap}
                onBack={handleCancel}
                actions={
                    <div className="hidden md:flex items-center gap-2">
                        <button
                            onClick={handleSaveAndView}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:bg-white/5 disabled:opacity-50 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all"
                        >
                            <Eye className="w-4 h-4" />
                            Agregar y ver
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-5 py-2 bg-accent hover:bg-accent/80 disabled:bg-accent/50 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all"
                        >
                            <Save className="w-4 h-4" />
                            {isLoading ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                }
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="container mx-auto px-4 py-6"
            >
                {/* Warning about no images */}
                <div className="max-w-6xl mx-auto mb-6">
                    <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="text-amber-200 font-medium">Modo carga rápida</p>
                            <p className="text-amber-200/70 mt-1">
                                No podrás subir imágenes desde acá. Podés agregarlas después editando cada auto.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSave} className="max-w-6xl mx-auto">
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-6 space-y-5">
                        {/* Name field */}
                        <div>
                            <label className="block text-accent uppercase tracking-widest text-[10px] font-bold mb-1.5 ml-1">
                                Nombre del Modelo <span className="text-danger">*</span>
                            </label>
                            <SuggestionInput
                                key={`name-${formKey}`}
                                options={suggestions.names}
                                value={formData.name}
                                onChange={(value) => updateField("name", value)}
                                placeholder="Ej: '71 Datsun 510"
                                icon={<Car className="w-5 h-5" />}
                                error={errors.name}
                                autoFocus
                            />
                            {errors.name && <p className="text-danger text-[10px] mt-1 ml-1">{errors.name}</p>}
                        </div>

                        {/* 2x2 grid for selectors on mobile, 4 cols on desktop */}
                        <div key={formKey} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <FieldSelector
                                label="Marca"
                                options={brands}
                                value={formData.brand}
                                onChange={(value) => updateField("brand", value)}
                                placeholder="Seleccionar"
                                icon={<Tag className="w-5 h-5" />}
                                error={errors.brand}
                                required
                            />

                            <FieldSelector
                                label="Color"
                                options={colors}
                                value={formData.color}
                                onChange={(value) => updateField("color", value)}
                                placeholder="Seleccionar"
                                icon={<Palette className="w-5 h-5" />}
                                error={errors.color}
                                required
                            />

                            <FieldSelector
                                label="Escala"
                                options={scales}
                                value={formData.scale}
                                onChange={(value) => updateField("scale", value)}
                                placeholder="Seleccionar"
                                icon={<Ruler className="w-5 h-5" />}
                                error={errors.scale}
                                required
                            />

                            <FieldSelector
                                label="Fabricante"
                                options={manufacturers}
                                value={formData.manufacturer}
                                onChange={(value) => updateField("manufacturer", value)}
                                placeholder="Seleccionar"
                                icon={<Factory className="w-5 h-5" />}
                                error={errors.manufacturer}
                                required
                            />
                        </div>
                    </div>

                    {/* Mobile buttons */}
                    <div className="md:hidden mt-6 space-y-3">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent hover:bg-accent/80 disabled:bg-accent/50 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-accent/30"
                        >
                            <Save className="w-5 h-5" />
                            {isLoading ? "Guardando..." : "Guardar"}
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveAndView}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all active:scale-95"
                        >
                            <Eye className="w-5 h-5" />
                            Agregar y ver
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
