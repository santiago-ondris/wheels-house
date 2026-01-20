import { useState, useRef, DragEvent } from "react";
import { Upload, X, Loader2, Crop, Image as ImageIcon } from "lucide-react";
import { uploadImage, deleteRemoteImage } from "../../services/upload.service";
import { resizeImage } from "../../lib/image-utils";
import toast from "react-hot-toast";
import ImageCropperModal from "./ImageCropperModal";

interface SingleImageUploadWidgetProps {
    value?: string | null;
    onChange: (value: string | null) => void;
    label?: string;
    aspectRatio?: number;
    helperText?: string;
}

export default function SingleImageUploadWidget({
    value,
    onChange,
    label = "Imagen de Portada",
    aspectRatio = 3 / 1,
    helperText = "Se recomienda una imagen horizontal de alta calidad."
}: SingleImageUploadWidgetProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [showCropper, setShowCropper] = useState(false);
    const [isSavingCrop, setIsSavingCrop] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (files: FileList) => {
        if (files.length === 0) return;
        const file = files[0];

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
        const maxSize = 20 * 1024 * 1024; // 20MB

        if (!allowedTypes.includes(file.type)) {
            toast.error("Solo se permiten imágenes (JPG, PNG, GIF, WEBP)");
            return;
        }

        if (file.size > maxSize) {
            toast.error("La imagen es demasiado grande");
            return;
        }

        await processAndUpload(file);
    };

    const processAndUpload = async (file: File) => {
        try {
            setIsUploading(true);
            setUploadProgress(10);

            // Resize first
            const resizedFile = await resizeImage(file);
            setUploadProgress(30);

            // Simulate progress
            const interval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            // Upload
            const url = await uploadImage(resizedFile);

            clearInterval(interval);
            setUploadProgress(100);

            // Delete old image if it exists and is ours
            if (value && value.includes('wheels-house/')) {
                // Background delete, don't await
                deleteOldImage(value);
            }

            onChange(url);
            toast.success("Imagen subida con éxito");

        } catch (error) {
            console.error(error);
            toast.error("Error al subir la imagen");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const deleteOldImage = async (url: string) => {
        try {
            // Check if it's a Cloudinary URL from our app
            if (url.includes('wheels-house/cars/')) {
                const parts = url.split('/');
                const idWithExtension = parts[parts.length - 1];
                const publicId = idWithExtension.split('.')[0];
                const fullPublicId = `wheels-house/cars/${publicId}`;

                await deleteRemoteImage(fullPublicId);
            }
        } catch (e) {
            console.error("Error deleting old image", e);
        }
    };

    const handleRemove = () => {
        onChange(null);
    };

    const handleCropSave = async (blob: Blob) => {
        setIsSavingCrop(true);
        const toastId = toast.loading('Guardando recorte...');
        try {
            const file = new File([blob], `cropped_${Date.now()}.jpg`, { type: 'image/jpeg' });
            const newUrl = await uploadImage(file);

            if (value) {
                deleteOldImage(value);
            }

            onChange(newUrl);
            toast.success('Recorte guardado', { id: toastId });
            setShowCropper(false);
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar recorte', { id: toastId });
        } finally {
            setIsSavingCrop(false);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/70">{label}</label>
                {value && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowCropper(true)}
                            type="button"
                            className="text-xs flex items-center gap-1 text-accent hover:text-accent/80 transition-colors"
                        >
                            <Crop className="w-3 h-3" />
                            Recortar
                        </button>
                        <button
                            onClick={handleRemove}
                            type="button"
                            className="text-xs flex items-center gap-1 text-danger hover:text-danger/80 transition-colors"
                        >
                            <X className="w-3 h-3" />
                            Eliminar
                        </button>
                    </div>
                )}
            </div>

            {value ? (
                // Image Preview State
                <div className="relative w-full rounded-xl overflow-hidden border border-white/10 group bg-black/20">
                    <div style={{ aspectRatio: aspectRatio }} className="w-full relative">
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <button
                                onClick={() => setShowCropper(true)}
                                type="button"
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all transform hover:scale-110"
                                title="Recortar"
                            >
                                <Crop className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                type="button"
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all transform hover:scale-110"
                                title="Cambiar imagen"
                            >
                                <Upload className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                // Upload Placeholder State
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    className={`
                        relative w-full rounded-xl border-2 border-dashed
                        transition-all cursor-pointer overflow-hidden
                        ${isDragging
                            ? 'border-accent bg-accent/10'
                            : 'border-white/10 hover:border-accent/50 bg-white/5 hover:bg-white/[0.07]'
                        }
                    `}
                >
                    <div style={{ aspectRatio: aspectRatio }} className="w-full flex flex-col items-center justify-center p-6 text-center">
                        {isUploading ? (
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-8 h-8 text-accent animate-spin" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-white">Subiendo...</p>
                                    <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-accent transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className={`
                                    p-4 rounded-full mb-3 transition-colors
                                    ${isDragging ? 'bg-accent/20' : 'bg-white/5 group-hover:bg-white/10'}
                                `}>
                                    <ImageIcon className={`
                                        w-8 h-8 transition-colors
                                        ${isDragging ? 'text-accent' : 'text-white/40'}
                                    `} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-white">
                                        {isDragging ? '¡Soltala acá!' : 'Click para subir portada'}
                                    </p>
                                    <p className="text-xs text-white/40">
                                        {helperText}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={(e) => {
                    if (e.target.files?.length) handleFileSelect(e.target.files);
                    e.target.value = '';
                }}
            />

            {showCropper && value && (
                <ImageCropperModal
                    image={value}
                    aspect={aspectRatio}
                    onSave={handleCropSave}
                    onCancel={() => !isSavingCrop && setShowCropper(false)}
                />
            )}
        </div>
    );
}
