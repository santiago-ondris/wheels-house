import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Car,
    FileText,
    User,
    Layers,
    Tag,
    Palette,
    Ruler,
    Factory,
    Save,
    Sparkles,
    Folder,
    Check,
    Plus,
    Gem,
    Award,
    PaintBucket,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Modal from "../../components/ui/Modal";
import { carSchema, CarFormData } from "../../lib/validations/car";
import { createCar, updateCarGroups } from "../../services/car.service";
import { listGroups, GroupBasicInfo } from "../../services/group.service";
import { scales, manufacturers, brands, colors, carConditions, brandNationalities, conditionDisplayCollection, rarities, qualities, varieties, finishes } from "../../data/carOptions";
import FieldSelector from "../../components/cars/addcar/FieldSelector";
import MultiImageUploadWidget from "../../components/ui/MultiImageUploadWidget";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useCarSuggestions } from "../../hooks/useCarSuggestions";
import SuggestionInput from "../../components/ui/SuggestionInput";
import { useNavigateBack } from "../../hooks/useNavigateBack";

export default function AddCarPage() {
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
        rarity: "",
        quality: "",
        variety: "",
        finish: "",
    });

    // ScrollRestoration handles scroll automatically

    const [errors, setErrors] = useState<Partial<Record<keyof CarFormData, string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [userGroups, setUserGroups] = useState<GroupBasicInfo[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const { suggestions } = useCarSuggestions();

    useEffect(() => {
        if (user?.username) {
            fetchGroups();
        }
    }, [user?.username]);

    const fetchGroups = async () => {
        try {
            const groups = await listGroups(user!.username);
            setUserGroups(groups);
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    };

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
            const carId = await createCar(result.data);

            // Assign to selected groups if any
            if (selectedGroups.length > 0) {
                await updateCarGroups(carId, selectedGroups);
            }

            toast.success("¡Auto agregado a tu colección!");
            // Use navigate(-1) to go back to the existing collection entry
            navigate(-1);
        } catch (error: any) {
            toast.error("Error al agregar el auto. Intentá de nuevo.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Safe back navigation with fallback
    const handleCancel = useNavigateBack(`/collection/${user?.username || ''}`);

    const updateField = (field: keyof CarFormData, value: string) => {
        setFormData((prev) => {
            const newData = { ...prev, [field]: value };

            // Auto-detect nationality if brand changes
            if (field === "brand") {
                newData.country = brandNationalities[value] || "";
            }

            return newData;
        });

        if (value === "Otro") {
            setIsContactModalOpen(true);
        }

        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const toggleGroup = (groupId: number) => {
        setSelectedGroups((prev) =>
            prev.includes(groupId)
                ? prev.filter((id) => id !== groupId)
                : [...prev, groupId]
        );
    };

    return (
        <div className="min-h-screen pb-32 md:pb-8">
            <PageHeader
                title="Agregar Auto"
                subtitle="Nuevo modelo a tu colección"
                icon={Car}
                onBack={handleCancel}
                actions={
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="hidden md:flex items-center gap-2 px-5 py-2 bg-accent hover:bg-accent/80 disabled:bg-accent/50 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all"
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
                <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-4 h-4 text-accent" />
                            <h2 className="text-sm font-bold text-accent uppercase tracking-widest">
                                Información Principal
                            </h2>
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-6 space-y-5">
                            <div>
                                <label className="block text-accent uppercase tracking-widest text-[10px] font-bold mb-1.5 ml-1">
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
                                    options={[...brands, "Otro"]}
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
                                <label className="block text-accent uppercase tracking-widest text-[10px] font-bold mb-1.5 ml-1">
                                    Estado del Auto <span className="text-danger">*</span>
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {carConditions.map((condition) => (
                                        <button
                                            key={condition}
                                            type="button"
                                            onClick={() => updateField("condition", condition)}
                                            className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border ${formData.condition === condition
                                                ? "bg-accent border-accent text-white shadow-lg shadow-accent/25"
                                                : "bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20"
                                                }`}
                                        >
                                            {conditionDisplayCollection[condition] || condition}
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
                            {/* Características especiales */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                <FieldSelector
                                    label="Rareza"
                                    options={rarities}
                                    value={formData.rarity || ""}
                                    onChange={(value) => updateField("rarity", value)}
                                    placeholder="Seleccionar"
                                    icon={<Gem className="w-5 h-5" />}
                                />
                                <FieldSelector
                                    label="Calidad"
                                    options={qualities}
                                    value={formData.quality || ""}
                                    onChange={(value) => updateField("quality", value)}
                                    placeholder="Seleccionar"
                                    icon={<Award className="w-5 h-5" />}
                                />
                                <FieldSelector
                                    label="Variedad"
                                    options={[...varieties, "Otro"]}
                                    value={formData.variety || ""}
                                    onChange={(value) => updateField("variety", value)}
                                    placeholder="Seleccionar"
                                    icon={<Layers className="w-5 h-5" />}
                                />
                                <FieldSelector
                                    label="Acabado"
                                    options={finishes}
                                    value={formData.finish || ""}
                                    onChange={(value) => updateField("finish", value)}
                                    placeholder="Seleccionar"
                                    icon={<PaintBucket className="w-5 h-5" />}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Series */}
                                <div>
                                    <label className="block text-white/50 uppercase tracking-widest text-[10px] font-bold mb-1.5 ml-1">
                                        Serie
                                    </label>
                                    <SuggestionInput
                                        options={suggestions.series}
                                        value={formData.series || ""}
                                        onChange={(value) => updateField("series", value)}
                                        placeholder="Ej: Japan Historics"
                                        icon={<Layers className="w-5 h-5" />}
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/50 uppercase tracking-widest text-[10px] font-bold mb-1.5 ml-1">
                                        Diseñador
                                    </label>
                                    <SuggestionInput
                                        options={suggestions.designers}
                                        value={formData.designer || ""}
                                        onChange={(value) => updateField("designer", value)}
                                        placeholder="Ej: Ryu Asada"
                                        icon={<User className="w-5 h-5" />}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-white/50 uppercase tracking-widest text-[10px] font-bold mb-1.5 ml-1">
                                    Descripción
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-4 w-5 h-5 text-white/40" />
                                    <textarea
                                        placeholder="Notas adicionales sobre el modelo..."
                                        value={formData.description}
                                        onChange={(e) => updateField("description", e.target.value)}
                                        className="w-full bg-input-bg border border-white/5 pl-12 pr-4 py-3.5 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-base min-h-[120px] resize-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-white/50 uppercase tracking-widest text-[10px] font-bold mb-1.5 ml-1">
                                    Imágenes del Auto
                                </label>
                                <MultiImageUploadWidget
                                    values={formData.pictures || []}
                                    onChange={(urls) => setFormData(prev => ({ ...prev, pictures: urls }))}
                                    maxImages={10}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Group Selector Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Folder className="w-4 h-4 text-white/40" />
                            <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest">
                                Agregar a Grupos
                            </h2>
                            <span className="text-[10px] text-white/20 ml-2">(Opcional)</span>
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-6">
                            {userGroups.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {userGroups.map((group) => (
                                        <div
                                            key={group.groupId}
                                            onClick={() => toggleGroup(group.groupId)}
                                            className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all ${selectedGroups.includes(group.groupId)
                                                ? "border-accent bg-accent/10"
                                                : "border-white/10 bg-white/[0.02] hover:border-white/20"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedGroups.includes(group.groupId)
                                                    ? "bg-accent text-white"
                                                    : "bg-white/5 text-white/40"
                                                    }`}>
                                                    <Folder className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-medium truncate">{group.name}</p>
                                                    <p className="text-white/40 text-xs">{group.totalCars} autos</p>
                                                </div>
                                            </div>
                                            {selectedGroups.includes(group.groupId) && (
                                                <div className="absolute top-2 right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-white/40 text-sm mb-3">
                                        No tenés grupos donde agregarlo.
                                    </p>
                                    <Link
                                        to="/collection/group/new"
                                        className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors text-sm font-bold uppercase tracking-wider"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Crear el primero ahora
                                    </Link>
                                    <p className="text-white/20 text-[10px] mt-2">
                                        (Siempre podés hacerlo después)
                                    </p>
                                </div>
                            )}
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
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-accent hover:bg-accent/80 disabled:bg-accent/50 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-accent/30"
                        >
                            <Save className="w-5 h-5" />
                            {isLoading ? "Guardando..." : "Guardar Auto"}
                        </button>
                    </div>
                </form>
            </motion.div>

            <Modal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                title="¿Falta alguna opción?"
            >
                <div className="space-y-6">
                    <p className="text-white/60">
                        ¿No encontrás lo que buscás? ¡Escribinos y lo agregamos enseguida!
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setIsContactModalOpen(false)}
                            className="px-4 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cerrar
                        </button>
                        <Link
                            to="/contact"
                            className="px-4 py-2 bg-accent hover:bg-accent/80 text-white font-bold rounded-lg transition-colors"
                        >
                            Ir a Contacto
                        </Link>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
