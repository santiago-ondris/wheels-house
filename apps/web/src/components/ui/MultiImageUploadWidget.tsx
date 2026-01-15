import { useState, useRef, DragEvent, useMemo } from "react";
import { Upload, X, Loader2, Star, Crop } from "lucide-react";
import { uploadImage, deleteRemoteImage } from "../../services/upload.service";
import { resizeImage } from "../../lib/image-utils";
import toast from "react-hot-toast";
import ImageCropperModal from "./ImageCropperModal";

interface MultiImageUploadWidgetProps {
    values: string[];
    onChange: (values: string[]) => void;
    maxImages?: number;
}

export default function MultiImageUploadWidget({
    values,
    onChange,
    maxImages = 10
}: MultiImageUploadWidgetProps) {
    const [uploadingStates, setUploadingStates] = useState<Record<string, { progress: number, status: 'processing' | 'uploading' }>>({});
    const [isDragging, setIsDragging] = useState(false);
    const [croppingIndex, setCroppingIndex] = useState<number | null>(null);
    const [isSavingCrop, setIsSavingCrop] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Normalize values to strings (redundant but safe)
    const normalizedValues = useMemo(() => values, [values]);

    const handleFileSelect = async (files: FileList) => {
        const filesArray = Array.from(files);

        if (normalizedValues.length + filesArray.length > maxImages) {
            toast.error(`Podés subir hasta ${maxImages} imágenes como máximo`);
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
        const maxSize = 20 * 1024 * 1024; // Increased to 20MB because we'll resize it anyway

        const validFiles = filesArray.filter(file => {
            if (!allowedTypes.includes(file.type)) {
                toast.error(`${file.name}: Solo se permiten imágenes (JPG, PNG, GIF, WEBP, HEIC)`);
                return false;
            }
            if (file.size > maxSize) {
                toast.error(`${file.name}: La imagen es demasiado grande`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        // Subimos de a 2 imágenes en paralelo para balancear velocidad vs rate limiting (errores 429 en producción).
        // Si Railway sigue bloqueando, bajar CHUNK_SIZE a 1. Si funciona bien, se puede probar con 3.
        const CHUNK_SIZE = 2;
        const successfulUrls: string[] = [];
        
        for (let i = 0; i < validFiles.length; i += CHUNK_SIZE) {
            const chunk = validFiles.slice(i, i + CHUNK_SIZE);
            const results = await Promise.all(chunk.map(file => processAndUploadFile(file)));
            
            for (const result of results) {
                if (result !== null) {
                    successfulUrls.push(result);
                }
            }
        }

        if (successfulUrls.length > 0) {
            onChange([...values, ...successfulUrls]);
        }
    };

    const processAndUploadFile = async (file: File): Promise<string | null> => {
        const tempId = `${Date.now()}_${Math.random()}`;

        try {
            // Stage 1: Processing (Resizing)
            setUploadingStates(prev => ({
                ...prev,
                [tempId]: { progress: 0, status: 'processing' }
            }));

            const resizedFile = await resizeImage(file);

            // Stage 2: Uploading
            setUploadingStates(prev => ({
                ...prev,
                [tempId]: { progress: 10, status: 'uploading' }
            }));

            // Simulate progress since fetch doesn't support it easily without XHR
            const progressInterval = setInterval(() => {
                setUploadingStates(prev => {
                    if (!prev[tempId]) return prev; // Prevent error if item is removed before interval clears
                    return {
                        ...prev,
                        [tempId]: {
                            ...prev[tempId],
                            progress: Math.min((prev[tempId]?.progress || 10) + 10, 90)
                        }
                    };
                });
            }, 300);

            const result = await uploadImage(resizedFile);

            clearInterval(progressInterval);
            setUploadingStates(prev => ({
                ...prev,
                [tempId]: { progress: 100, status: 'uploading' }
            }));

            setTimeout(() => {
                setUploadingStates(prev => {
                    const newStates = { ...prev };
                    delete newStates[tempId];
                    return newStates;
                });
            }, 500);

            return result;

        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(`${file.name}: Error al subir`);
            setUploadingStates(prev => {
                const newStates = { ...prev };
                delete newStates[tempId];
                return newStates;
            });
            return null;
        }
    };

    const handleRemove = async (index: number) => {
        const urlToRemove = values[index];

        // Optimistic UI update
        const newValues = values.filter((_, i) => i !== index);
        onChange(newValues);

        // Extract publicId if it looks like a Cloudinary URL from our app
        // Logic: http.../wheels-house/cars/id.jpg -> wheels-house/cars/id
        if (urlToRemove.includes('wheels-house/cars/')) {
            try {
                const parts = urlToRemove.split('/');
                const idWithExtension = parts[parts.length - 1];
                const publicId = idWithExtension.split('.')[0];
                const fullPublicId = `wheels-house/cars/${publicId}`;
                await deleteRemoteImage(fullPublicId);
            } catch (error) {
                console.error("Failed to delete remote image:", error);
            }
        }

        toast.success('Imagen eliminada');
    };

    const handleSetPrimary = (index: number) => {
        if (index === 0) return;
        const newValues = [...values];
        const [selected] = newValues.splice(index, 1);
        newValues.unshift(selected);
        onChange(newValues);
        toast.success('Imagen principal actualizada');
    };

    const handleCropSave = async (blob: Blob) => {
        if (croppingIndex === null) return;

        setIsSavingCrop(true);
        const toastId = toast.loading('Guardando recorte...');

        try {
            const oldUrl = values[croppingIndex];
            const file = new File([blob], `cropped_${Date.now()}.jpg`, { type: 'image/jpeg' });

            // Upload new cropped version
            const newUrl = await uploadImage(file);

            // Update values
            const newValues = [...values];
            newValues[croppingIndex] = newUrl;
            onChange(newValues);

            // Cleanup old image if possible
            if (oldUrl.includes('wheels-house/cars/')) {
                const parts = oldUrl.split('/');
                const idWithExtension = parts[parts.length - 1];
                const publicId = idWithExtension.split('.')[0];
                await deleteRemoteImage(`wheels-house/cars/${publicId}`);
            }

            toast.success('Imagen recortada con éxito', { id: toastId });
        } catch (error) {
            console.error('Error saving crop:', error);
            toast.error('Error al guardar el recorte', { id: toastId });
        } finally {
            setIsSavingCrop(false);
            setCroppingIndex(null);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleClick = () => {
        if (values.length >= maxImages) {
            toast.error(`Ya alcanzaste el límite de ${maxImages} imágenes`);
            return;
        }
        fileInputRef.current?.click();
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files);
        }
        e.target.value = '';
    };

    const uploadingEntries = Object.entries(uploadingStates);
    const canAddMore = values.length < maxImages && uploadingEntries.length < maxImages;

    return (
        <div className="space-y-3">
            {values.length > 0 && (
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold ml-1">
                    La foto que selecciones como principal será la portada del vehículo
                </p>
            )}
            {values.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {values.map((url, index) => (
                        <div key={`${url}_${index}`} className="relative group aspect-square">
                            <div className="relative w-full h-full rounded-xl overflow-hidden bg-white/5 border border-white/10">
                                <img
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                {/* Mobile Friendly: Always show delete button or at least make it easier to see than just hover */}
                                <div className="absolute top-2 right-2 flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        onClick={() => setCroppingIndex(index)}
                                        className="p-2 bg-accent/90 hover:bg-accent rounded-lg text-white shadow-lg active:scale-90 transition-all"
                                        title="Recortar"
                                    >
                                        <Crop className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(index)}
                                        className="p-2 bg-danger/90 hover:bg-danger rounded-lg text-white shadow-lg active:scale-90 transition-all"
                                        title="Eliminar"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {index === 0 ? (
                                    <div className="absolute top-2 left-2 px-2 py-1 bg-accent/90 text-[10px] font-bold text-white rounded-md shadow-lg flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-white" />
                                        PRINCIPAL
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 bg-black/40 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                        <button
                                            type="button"
                                            onClick={() => handleSetPrimary(index)}
                                            className="pointer-events-auto px-3 py-1.5 bg-white text-dark text-[10px] font-bold rounded-lg hover:bg-accent hover:text-white transition-all active:scale-95 shadow-xl"
                                        >
                                            HACER PRINCIPAL
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {uploadingEntries.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {uploadingEntries.map(([id, state]) => (
                        <div key={id} className="aspect-square">
                            <div className="w-full h-full rounded-xl border border-white/10 bg-white/5 flex flex-col items-center justify-center gap-2 p-4">
                                <Loader2 className={`w-8 h-8 ${state.status === 'processing' ? 'text-blue-400' : 'text-accent'} animate-spin`} />
                                <div className="w-full text-center">
                                    <p className="text-[10px] text-white/50 mb-1 font-medium uppercase tracking-wider">
                                        {state.status === 'processing' ? 'Procesando...' : 'Subiendo...'}
                                    </p>
                                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${state.status === 'processing' ? 'bg-blue-400' : 'bg-accent'}`}
                                            style={{ width: `${state.progress}%` }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-white/30 mt-1">{state.progress}%</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {canAddMore && (
                <>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif"
                        multiple
                        onChange={handleFileInputChange}
                        className="hidden"
                    />
                    <div
                        onClick={handleClick}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`
                            w-full h-32 border-2 border-dashed rounded-xl 
                            transition-all cursor-pointer
                            flex flex-col items-center justify-center gap-2
                            ${isDragging
                                ? 'border-accent bg-accent/10 scale-[1.02]'
                                : 'border-white/10 hover:border-accent/50 bg-input-bg hover:bg-white/5'
                            }
                        `}
                    >
                        <div className={`
                            p-3 rounded-full transition-colors
                            ${isDragging ? 'bg-accent/20' : 'bg-white/5'}
                        `}>
                            <Upload className={`
                                w-6 h-6 transition-colors
                                ${isDragging ? 'text-accent' : 'text-white/40'}
                            `} />
                        </div>
                        <div className="text-center px-4">
                            <p className="text-white text-sm font-medium">
                                {isDragging ? '¡Soltá las imágenes!' :
                                    values.length === 0 ? 'Subir imágenes del auto' : 'Agregar más imágenes'}
                            </p>
                            <p className="text-white/30 text-[10px] mt-0.5 uppercase tracking-wider font-semibold">
                                {values.length}/{maxImages} • {isDragging ? 'SOLTAR' : 'AQUÍ'}
                            </p>
                        </div>
                    </div>
                </>
            )}

            {croppingIndex !== null && (
                <ImageCropperModal
                    image={values[croppingIndex]}
                    onSave={handleCropSave}
                    onCancel={() => !isSavingCrop && setCroppingIndex(null)}
                />
            )}
        </div>
    );
}
