import { useState, useRef, DragEvent } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadImage } from "../../services/upload.service";
import toast from "react-hot-toast";

interface ImageUploadWidgetProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove: () => void;
}

export default function ImageUploadWidget({ value, onChange, onRemove }: ImageUploadWidgetProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (file: File) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Solo se permiten imágenes (JPG, PNG, GIF, WEBP, HEIC)');
            return;
        }

        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('La imagen no puede superar 10MB');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => Math.min(prev + 10, 90));
            }, 200);

            const url = await uploadImage(file);
            
            clearInterval(progressInterval);
            setUploadProgress(100);
            
            onChange(url);
            toast.success('¡Imagen subida exitosamente!');
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(error.message || 'Error al subir la imagen');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
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
        fileInputRef.current?.click();
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    return (
        <div className="space-y-3">
            {value ? (
                <div className="relative group">
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                        <img
                            src={value}
                            alt="Car preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                                type="button"
                                onClick={onRemove}
                                className="p-3 bg-danger hover:bg-danger/80 rounded-full text-white transition-all transform hover:scale-110 active:scale-95"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />
                    <div
                        onClick={handleClick}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`
                            w-full h-48 border-2 border-dashed rounded-xl 
                            transition-all cursor-pointer
                            flex flex-col items-center justify-center gap-3
                            ${isDragging 
                                ? 'border-accent bg-accent/10 scale-[1.02]' 
                                : 'border-white/10 hover:border-accent/50 bg-input-bg hover:bg-white/5'
                            }
                            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-12 h-12 text-accent animate-spin" />
                                <div className="w-64">
                                    <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                                        <span>Subiendo...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                        <div 
                                            className="bg-accent h-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={`
                                    p-4 rounded-full transition-colors
                                    ${isDragging ? 'bg-accent/20' : 'bg-white/5'}
                                `}>
                                    <Upload className={`
                                        w-8 h-8 transition-colors
                                        ${isDragging ? 'text-accent' : 'text-white/40'}
                                    `} />
                                </div>
                                <div className="text-center px-4">
                                    <p className="text-white font-medium mb-1">
                                        {isDragging ? '¡Soltá la imagen aquí!' : 'Subir imagen del auto'}
                                    </p>
                                    <p className="text-white/40 text-xs">
                                        Hacé clic o arrastrá una imagen
                                    </p>
                                    <p className="text-white/30 text-[10px] mt-1">
                                        JPG, PNG, GIF, WEBP, HEIC (máx. 10MB)
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
