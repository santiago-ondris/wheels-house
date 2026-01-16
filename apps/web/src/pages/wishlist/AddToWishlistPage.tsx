import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Star,
    Car,
    FileText,
    Tag,
    Palette,
    Ruler,
    Factory,
    Save,
    Sparkles,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import { carSchema, CarFormData } from "../../lib/validations/car";
import { createWishedCar } from "../../services/car.service";
import { scales, manufacturers, brands, colors, carConditions, brandNationalities, conditionDisplayWishlist } from "../../data/carOptions";
import FieldSelector from "../../components/cars/addcar/FieldSelector";
import MultiImageUploadWidget from "../../components/ui/MultiImageUploadWidget";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useCarSuggestions } from "../../hooks/useCarSuggestions";
import SuggestionInput from "../../components/ui/SuggestionInput";
import { useNavigateBack } from "../../hooks/useNavigateBack";

export default function AddToWishlistPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState<CarFormData>({
        name: "",
        color: "",
        brand: "",
        scale: "",
        manufacturer: "",
        condition: "Abierto",
        country: "",
        description: "",
        designer: "",
        series: "",
        pictures: [],
    });

    // ScrollRestoration handles scroll automatically

    const [errors, setErrors] = useState<Partial<Record<keyof CarFormData, string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    const { suggestions } = useCarSuggestions();

    // Safe back navigation with fallback
    const handleCancel = useNavigateBack(`/wishlist/${user?.username}`);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const result = carSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors: Partial<Record<keyof CarFormData, string>> = {};
            result.error.issues.forEach((err) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0] as keyof CarFormData] = err.message;
                }
            });
            setErrors(fieldErrors);
            toast.error("Completá los campos obligatorios");
            return;
        }

        setIsLoading(true);
        try {
            await createWishedCar({
                ...result.data,
                wished: true,
            });

            toast.success("¡Auto agregado a tu wishlist!");
            // Use navigate(-1) to go back to the existing Wishlist entry
            // instead of creating a new history entry
            navigate(-1);
        } catch (error: any) {
            toast.error("Error al agregar el auto. Intentá de nuevo.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };



    const updateField = (field: keyof CarFormData, value: string) => {
        setFormData((prev) => {
            const newData = { ...prev, [field]: value };

            if (field === "brand") {
                newData.country = brandNationalities[value] || "";
            }

            return newData;
        });

        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <div className="min-h-screen pb-32 md:pb-8">
            <PageHeader
                title="Agregar a Wishlist"
                subtitle="Un vehículo que buscás"
                icon={Star}
                onBack={handleCancel}
                actions={
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="hidden md:flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-black text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all"
                    >
                        <Save className="w-4 h-4" />
                        {isLoading ? "Guardando..." : "Guardar"}
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
                    {/* Wishlist Notice */}
                    <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
                        <Star className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-amber-500 font-bold text-sm">
                                Estás agregando a tu Wishlist
                            </p>
                            <p className="text-amber-500/70 text-xs mt-1">
                                Este auto se guardará como "buscado". Cuando lo consigas, podrás marcarlo y pasará a tu colección.
                            </p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <h2 className="text-sm font-bold text-amber-500 uppercase tracking-widest">
                                Información del Vehículo
                            </h2>
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-6 space-y-5">
                            <div>
                                <label className="block text-amber-500 uppercase tracking-widest text-[10px] font-bold mb-1.5 ml-1">
                                    Nombre del Modelo <span className="text-danger">*</span>
                                </label>
                                <SuggestionInput
                                    options={suggestions.names}
                                    value={formData.name}
                                    onChange={(value) => updateField("name", value)}
                                    placeholder="Ej: '71 Datsun 510"
                                    icon={<Car className="w-5 h-5" />}
                                    error={errors.name}
                                />
                                {errors.name && <p className="text-danger text-[10px] mt-1 ml-1">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                <FieldSelector
                                    label="Marca (Real)"
                                    options={brands}
                                    value={formData.brand}
                                    onChange={(value) => updateField("brand", value)}
                                    placeholder="Seleccionar marca"
                                    icon={<Tag className="w-5 h-5" />}
                                    error={errors.brand}
                                    required
                                />

                                <FieldSelector
                                    label="Color"
                                    options={colors}
                                    value={formData.color}
                                    onChange={(value) => updateField("color", value)}
                                    placeholder="Seleccionar color"
                                    icon={<Palette className="w-5 h-5" />}
                                    error={errors.color}
                                    required
                                />

                                <FieldSelector
                                    label="Escala"
                                    options={scales}
                                    value={formData.scale}
                                    onChange={(value) => updateField("scale", value)}
                                    placeholder="Seleccionar escala"
                                    icon={<Ruler className="w-5 h-5" />}
                                    error={errors.scale}
                                    required
                                />

                                <FieldSelector
                                    label="Fabricante"
                                    options={manufacturers}
                                    value={formData.manufacturer}
                                    onChange={(value) => updateField("manufacturer", value)}
                                    placeholder="Seleccionar fabricante"
                                    icon={<Factory className="w-5 h-5" />}
                                    error={errors.manufacturer}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-amber-500 uppercase tracking-widest text-[10px] font-bold mb-1.5 ml-1">
                                    Estado del Auto <span className="text-danger">*</span>
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {carConditions.map((condition) => (
                                        <button
                                            key={condition}
                                            type="button"
                                            onClick={() => updateField("condition", condition)}
                                            className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border ${formData.condition === condition
                                                ? "bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/25"
                                                : "bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20"
                                                }`}
                                        >
                                            {conditionDisplayWishlist[condition] || condition}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-4 h-4 text-white/40" />
                            <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest">
                                Información Adicional
                            </h2>
                            <span className="text-[10px] text-white/20 ml-2">(Opcional)</span>
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-6 space-y-5">
                            <div>
                                <label className="block text-white/50 uppercase tracking-widest text-[10px] font-bold mb-1.5 ml-1">
                                    Descripción / Notas
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-4 w-5 h-5 text-white/40" />
                                    <textarea
                                        placeholder="Dónde lo viste, precio aproximado, variante específica..."
                                        value={formData.description}
                                        onChange={(e) => updateField("description", e.target.value)}
                                        className="w-full bg-input-bg border border-white/5 pl-12 pr-4 py-3.5 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-base min-h-[100px] resize-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-white/50 uppercase tracking-widest text-[10px] font-bold mb-1.5 ml-1">
                                    Imágenes de Referencia
                                </label>
                                <MultiImageUploadWidget
                                    values={formData.pictures || []}
                                    onChange={(urls) => setFormData(prev => ({ ...prev, pictures: urls }))}
                                    maxImages={5}
                                />
                                <p className="text-white/30 text-[10px] mt-2 ml-1">
                                    Opcional: podés subir fotos de referencia del modelo que buscás
                                </p>
                            </div>
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

                    <div className="md:hidden mt-8 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="px-6 py-4 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all active:scale-95"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-black font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-amber-500/30"
                        >
                            <Save className="w-5 h-5" />
                            {isLoading ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
