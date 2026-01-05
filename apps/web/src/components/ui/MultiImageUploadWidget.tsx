import { useState, useRef, DragEvent } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { uploadImage } from "../../services/upload.service";
import toast from "react-hot-toast";

interface MultiImageUploadWidgetProps {
    values: string[];
    onChange: (urls: string[]) => void;
    maxImages?: number;
}

export default function MultiImageUploadWidget({
    values,
    onChange,
    maxImages = 10
}: MultiImageUploadWidgetProps) {
    const [uploadingStates, setUploadingStates] = useState<Record<string, number>>({});
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (files: FileList) => {
        const filesArray = Array.from(files);

        if (values.length + filesArray.length > maxImages) {
            toast.error(`Podés subir hasta ${maxImages} imágenes como máximo`);
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        for (const file of filesArray) {
            if (!allowedTypes.includes(file.type)) {
                toast.error(`${file.name}: Solo se permiten imágenes (JPG, PNG, GIF, WEBP, HEIC)`);
                continue;
            }

            if (file.size > maxSize) {
                toast.error(`${file.name}: La imagen no puede superar 10MB`);
                continue;
            }

            await uploadFile(file);
        }
    };

    const uploadFile = async (file: File) => {
        const uploadId = `${Date.now()}_${file.name}`;

        try {
            setUploadingStates(prev => ({ ...prev, [uploadId]: 0 }));

            const progressInterval = setInterval(() => {
                setUploadingStates(prev => ({
                    ...prev,
                    [uploadId]: Math.min((prev[uploadId] || 0) + 10, 90)
                }));
            }, 200);

            const url = await uploadImage(file);

            clearInterval(progressInterval);
            setUploadingStates(prev => ({ ...prev, [uploadId]: 100 }));

            onChange([...values, url]);
            toast.success('¡Imagen subida exitosamente!');

            setTimeout(() => {
                setUploadingStates(prev => {
                    const newStates = { ...prev };
                    delete newStates[uploadId];
                    return newStates;
                });
            }, 500);
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(error.message || 'Error al subir la imagen');
            setUploadingStates(prev => {
                const newStates = { ...prev };
                delete newStates[uploadId];
                return newStates;
            });
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

    const handleRemove = (index: number) => {
        const newValues = values.filter((_, i) => i !== index);
        onChange(newValues);
        toast.success('Imagen eliminada');
    };

    const uploadingEntries = Object.entries(uploadingStates);
    const canAddMore = values.length < maxImages && uploadingEntries.length === 0;

    return (
        <div className="space-y-3">
            {values.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {values.map((url, index) => (
                        <div key={`${url}_${index}`} className="relative group aspect-square">
                            <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/10 bg-white/5">
                                <img
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                {index === 0 && (
                                    <div className="absolute top-2 left-2 px-2 py-1 bg-accent/90 text-white text-[10px] font-bold rounded-md uppercase tracking-wide">
                                        Principal
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(index)}
                                        className="p-3 bg-danger hover:bg-danger/80 rounded-full text-white transition-all transform hover:scale-110 active:scale-95"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {uploadingEntries.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {uploadingEntries.map(([id, progress]) => (
                        <div key={id} className="aspect-square">
                            <div className="w-full h-full rounded-xl border border-white/10 bg-white/5 flex flex-col items-center justify-center gap-2 p-4">
                                <Loader2 className="w-8 h-8 text-accent animate-spin" />
                                <div className="w-full">
                                    <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                                        <span>Subiendo...</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="bg-accent h-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
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
                            {values.length === 0 ? (
                                <Upload className={`
                                    w-6 h-6 transition-colors
                                    ${isDragging ? 'text-accent' : 'text-white/40'}
                                `} />
                            ) : (
                                <ImageIcon className={`
                                    w-6 h-6 transition-colors
                                    ${isDragging ? 'text-accent' : 'text-white/40'}
                                `} />
                            )}
                        </div>
                        <div className="text-center px-4">
                            <p className="text-white text-sm font-medium">
                                {isDragging ? '¡Soltá las imágenes aquí!' :
                                    values.length === 0 ? 'Subir imágenes del auto' : 'Agregar más imágenes'}
                            </p>
                            <p className="text-white/30 text-[10px] mt-0.5">
                                {values.length}/{maxImages} imágenes • {isDragging ? '' : 'Hacé clic o arrastrá'}
                            </p>
                        </div>
                    </div>
                </>
            )}

            {!canAddMore && uploadingEntries.length === 0 && (
                <div className="w-full p-3 border border-white/10 rounded-xl bg-white/5 text-center">
                    <p className="text-white/40 text-xs">
                        Llegaste al límite de {maxImages} imágenes
                    </p>
                </div>
            )}
        </div>
    );
}
