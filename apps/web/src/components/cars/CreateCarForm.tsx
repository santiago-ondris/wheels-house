import { useState } from "react";
import { Car, FileText, User, Layers, Image as ImageIcon, Tag, Palette, Ruler, Factory } from "lucide-react";
import { carSchema, CarFormData } from "../../lib/validations/car";
import { createCar } from "../../services/car.service";
import { scales, manufacturers, brands, colors } from "../../data/carOptions";
import SearchableSelect from "../ui/SearchableSelect";
import toast from "react-hot-toast";

interface CreateCarFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function CreateCarForm({ onSuccess, onCancel }: CreateCarFormProps) {
    const [formData, setFormData] = useState<CarFormData>({
        name: "",
        color: "",
        brand: "",
        scale: "",
        manufacturer: "",
        description: "",
        designer: "",
        series: "",
        picture: "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CarFormData, string>>>({});
    const [isLoading, setIsLoading] = useState(false);

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
            return;
        }

        setIsLoading(true);
        try {
            await createCar(result.data);
            toast.success("¡Auto agregado a tu colección!");
            onSuccess();
        } catch (error: any) {
            toast.error("Error al agregar el auto. Intentá de nuevo.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
        <label className="block text-accent uppercase tracking-widest text-[10px] font-bold mb-1.5 ml-1">
            {children} <span className="text-danger">*</span>
        </label>
    );

    const OptionalLabel = ({ children }: { children: React.ReactNode }) => (
        <label className="block text-white/50 uppercase tracking-widest text-[10px] font-bold mb-1.5 ml-1">
            {children} <span className="text-white/30 normal-case">(Opcional)</span>
        </label>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="md:col-span-2">
                    <RequiredLabel>Nombre del Modelo</RequiredLabel>
                    <div className="relative">
                        <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />
                        <input
                            type="text"
                            placeholder="Ej: '71 Datsun 510"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-input-bg border border-white/5 pl-10 pr-4 py-2.5 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm"
                        />
                    </div>
                    {errors.name && <p className="text-danger text-[10px] mt-1 ml-1">{errors.name}</p>}
                </div>

                {/* Marca */}
                <div>
                    <RequiredLabel>Marca (Real)</RequiredLabel>
                    <SearchableSelect
                        options={brands}
                        value={formData.brand}
                        onChange={(value) => setFormData({ ...formData, brand: value })}
                        placeholder="Seleccionar marca"
                        icon={<Tag className="w-4 h-4" />}
                        error={errors.brand}
                    />
                    {errors.brand && <p className="text-danger text-[10px] mt-1 ml-1">{errors.brand}</p>}
                </div>

                {/* Color */}
                <div>
                    <RequiredLabel>Color</RequiredLabel>
                    <SearchableSelect
                        options={colors}
                        value={formData.color}
                        onChange={(value) => setFormData({ ...formData, color: value })}
                        placeholder="Seleccionar color"
                        icon={<Palette className="w-4 h-4" />}
                        error={errors.color}
                    />
                    {errors.color && <p className="text-danger text-[10px] mt-1 ml-1">{errors.color}</p>}
                </div>

                {/* Escala */}
                <div>
                    <RequiredLabel>Escala</RequiredLabel>
                    <SearchableSelect
                        options={scales}
                        value={formData.scale}
                        onChange={(value) => setFormData({ ...formData, scale: value })}
                        placeholder="Seleccionar escala"
                        icon={<Ruler className="w-4 h-4" />}
                        error={errors.scale}
                    />
                    {errors.scale && <p className="text-danger text-[10px] mt-1 ml-1">{errors.scale}</p>}
                </div>

                {/* Fabricante */}
                <div>
                    <RequiredLabel>Fabricante</RequiredLabel>
                    <SearchableSelect
                        options={manufacturers}
                        value={formData.manufacturer}
                        onChange={(value) => setFormData({ ...formData, manufacturer: value })}
                        placeholder="Seleccionar fabricante"
                        icon={<Factory className="w-4 h-4" />}
                        error={errors.manufacturer}
                    />
                    {errors.manufacturer && <p className="text-danger text-[10px] mt-1 ml-1">{errors.manufacturer}</p>}
                </div>
            </div>

            <div className="pt-2 border-t border-white/5">
                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Campos opcionales</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Series */}
                    <div>
                        <OptionalLabel>Serie</OptionalLabel>
                        <div className="relative">
                            <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                placeholder="Ej: Japan Historics"
                                value={formData.series}
                                onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                                className="w-full bg-input-bg border border-white/5 pl-10 pr-4 py-2.5 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* Designer */}
                    <div>
                        <OptionalLabel>Diseñador</OptionalLabel>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                placeholder="Ej: Ryu Asada"
                                value={formData.designer}
                                onChange={(e) => setFormData({ ...formData, designer: e.target.value })}
                                className="w-full bg-input-bg border border-white/5 pl-10 pr-4 py-2.5 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mt-4">
                    <OptionalLabel>Descripción</OptionalLabel>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                        <textarea
                            placeholder="Notas adicionales sobre el modelo..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-input-bg border border-white/5 pl-10 pr-4 py-2.5 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm min-h-[80px] resize-none"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <OptionalLabel>URL de Imagen</OptionalLabel>
                    <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                            type="text"
                            placeholder="https://..."
                            value={formData.picture}
                            onChange={(e) => setFormData({ ...formData, picture: e.target.value })}
                            className="w-full bg-input-bg border border-white/5 pl-10 pr-4 py-2.5 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-6 py-3 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all active:scale-95"
                    disabled={isLoading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-[2] px-6 py-3 bg-accent hover:bg-accent/80 disabled:bg-accent/50 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent/20"
                >
                    {isLoading ? "Guardando..." : "Guardar Auto"}
                </button>
            </div>
        </form>
    );
}
