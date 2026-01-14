import { useState, useRef, useCallback } from "react";
import { Upload, Download, FileSpreadsheet, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { 
    downloadTemplate, 
    uploadForPreview, 
    ImportPreviewResponse 
} from "../../services/import.service";
import toast from "react-hot-toast";

interface ImportStep1UploadProps {
    onPreviewReady: (data: ImportPreviewResponse) => void;
}

export default function ImportStep1Upload({ onPreviewReady }: ImportStep1UploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDownloadTemplate = async () => {
        setIsDownloading(true);
        try {
            await downloadTemplate();
            toast.success("Plantilla descargada");
        } catch (error) {
            toast.error("Error al descargar la plantilla");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleFileUpload = async (file: File) => {
        // Validate file type
        if (!file.name.endsWith('.xlsx')) {
            toast.error("Solo se permiten archivos .xlsx");
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("El archivo excede el tamaño máximo de 5MB");
            return;
        }

        setIsUploading(true);
        try {
            const result = await uploadForPreview(file);
            onPreviewReady(result);
        } catch (error: any) {
            toast.error(error.message || "Error al procesar el archivo");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileUpload(file);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Info card */}
            <div className="mb-6 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="flex items-start gap-3">
                    <FileSpreadsheet className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-white mb-1">Cargá hasta 500 autos desde un archivo Excel</h3>
                        <p className="text-sm text-white/50">
                            Descargá la plantilla, completala con tus datos y subila acá. Recomendado hacer en PC.
                        </p>
                    </div>
                </div>
            </div>

            {/* Download template button */}
            <button
                onClick={handleDownloadTemplate}
                disabled={isDownloading}
                className="w-full mb-6 flex items-center justify-center gap-3 p-4 bg-accent/10 border border-accent/30 rounded-xl hover:bg-accent/20 transition-all disabled:opacity-50"
            >
                <Download className="w-5 h-5 text-accent" />
                <span className="font-bold text-accent">
                    {isDownloading ? "Descargando..." : "Descargar plantilla Excel"}
                </span>
            </button>

            {/* Drop zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative cursor-pointer p-8 md:p-12 border-2 border-dashed rounded-2xl transition-all ${
                    isDragging
                        ? "border-accent bg-accent/10"
                        : "border-white/20 hover:border-white/40 bg-white/[0.02]"
                } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <div className="flex flex-col items-center text-center">
                    {isUploading ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full mb-4"
                        />
                    ) : (
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                            isDragging ? "bg-accent/20" : "bg-white/5"
                        }`}>
                            <Upload className={`w-8 h-8 ${isDragging ? "text-accent" : "text-white/40"}`} />
                        </div>
                    )}

                    <p className="text-white font-bold mb-2">
                        {isUploading 
                            ? "Analizando archivo..." 
                            : isDragging 
                                ? "Soltá el archivo aquí" 
                                : "Arrastrá tu archivo acá"
                        }
                    </p>
                    {!isUploading && (
                        <p className="text-sm text-white/40">
                            o hacé click para seleccionar
                        </p>
                    )}
                </div>
            </div>

            {/* Format note */}
            <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
                <AlertCircle className="w-4 h-4" />
                <span>Solo archivos .xlsx (máximo 5MB)</span>
            </div>
        </div>
    );
}
