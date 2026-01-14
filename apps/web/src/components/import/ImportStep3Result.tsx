import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertTriangle, RotateCcw, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { ImportResult } from "../../services/import.service";
import { useAuth } from "../../contexts/AuthContext";

interface ImportStep3ResultProps {
    result: ImportResult;
    onReset: () => void;
}

export default function ImportStep3Result({ result, onReset }: ImportStep3ResultProps) {
    const navigate = useNavigate();
    const { user } = useAuth();

    const isFullSuccess = result.success && result.failed === 0;
    const isPartialSuccess = result.imported > 0 && result.failed > 0;

    return (
        <div className="max-w-xl mx-auto text-center">
            {/* Icon */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                    isFullSuccess ? "bg-green-500/20" : "bg-amber-500/20"
                }`}
            >
                {isFullSuccess ? (
                    <CheckCircle className="w-10 h-10 text-green-400" />
                ) : (
                    <AlertTriangle className="w-10 h-10 text-amber-400" />
                )}
            </motion.div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-2">
                {isFullSuccess 
                    ? "¡Importación exitosa!" 
                    : isPartialSuccess 
                        ? "Importación parcial"
                        : "Hubo errores"
                }
            </h2>

            {/* Description */}
            <p className="text-white/60 mb-6">
                {isFullSuccess 
                    ? `Se importaron ${result.imported} autos a tu colección.`
                    : isPartialSuccess
                        ? `Se importaron ${result.imported} de ${result.imported + result.failed} autos.`
                        : "No se pudo importar ningún auto."
                }
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-8">
                <div className="text-center">
                    <p className="text-3xl font-bold text-green-400">{result.imported}</p>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Importados</p>
                </div>
                {result.failed > 0 && (
                    <div className="text-center">
                        <p className="text-3xl font-bold text-red-400">{result.failed}</p>
                        <p className="text-xs text-white/40 uppercase tracking-wider">Fallidos</p>
                    </div>
                )}
            </div>

            {/* Error details */}
            {result.errors && result.errors.length > 0 && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-left max-h-40 overflow-y-auto">
                    <p className="text-sm font-bold text-red-400 mb-2">Errores:</p>
                    <ul className="text-xs text-red-300 space-y-1">
                        {result.errors.slice(0, 10).map((err, i) => (
                            <li key={i}>• {err.name}: {err.error}</li>
                        ))}
                        {result.errors.length > 10 && (
                            <li className="text-white/40">...y {result.errors.length - 10} más</li>
                        )}
                    </ul>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                    onClick={() => navigate(`/collection/${user?.username}`)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-accent/80 rounded-xl transition-all"
                >
                    <ExternalLink className="w-4 h-4" />
                    <span className="font-bold text-white">Ver mi colección</span>
                </button>
                <button
                    onClick={onReset}
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-all"
                >
                    <RotateCcw className="w-4 h-4" />
                    <span className="font-bold text-white">Importar más</span>
                </button>
            </div>
        </div>
    );
}
