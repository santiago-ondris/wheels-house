import { useState } from "react";
import { Check, X, AlertTriangle, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { 
    ImportPreviewResponse, 
    ImportResult, 
    ImportCarRow,
    confirmImport 
} from "../../services/import.service";
import toast from "react-hot-toast";

interface ImportStep2PreviewProps {
    data: ImportPreviewResponse;
    onImportComplete: (result: ImportResult) => void;
    onBack: () => void;
    getValidCars: () => ImportCarRow[];
}

export default function ImportStep2Preview({ 
    data, 
    onImportComplete, 
    onBack,
    getValidCars 
}: ImportStep2PreviewProps) {
    const [isImporting, setIsImporting] = useState(false);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    const handleImport = async () => {
        const validCars = getValidCars();
        if (validCars.length === 0) {
            toast.error("No hay autos válidos para importar");
            return;
        }

        setIsImporting(true);
        try {
            const result = await confirmImport(validCars);
            onImportComplete(result);
        } catch (error: any) {
            toast.error(error.message || "Error al importar");
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Summary */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-white">{data.totalRows}</p>
                        <p className="text-xs text-white/40">Total</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">{data.validRows}</p>
                        <p className="text-xs text-white/40">Válidos</p>
                    </div>
                    {data.invalidRows > 0 && (
                        <div className="text-center">
                            <p className="text-2xl font-bold text-red-400">{data.invalidRows}</p>
                            <p className="text-xs text-white/40">Con errores</p>
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onBack}
                        disabled={isImporting}
                        className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg bg-red-400 hover:bg-red-500 transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="text-sm font-bold">Cancelar</span>
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={isImporting || data.validRows === 0}
                        className="flex items-center gap-2 px-6 py-2 bg-accent hover:bg-accent/80 rounded-lg transition-all disabled:opacity-50"
                    >
                        {isImporting ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            />
                        ) : (
                            <Check className="w-4 h-4" />
                        )}
                        <span className="text-sm font-bold text-white">
                            {isImporting 
                                ? "Importando..." 
                                : data.invalidRows > 0 
                                    ? `Importar ${data.validRows} válidos`
                                    : `Importar ${data.validRows} autos`
                            }
                        </span>
                    </button>
                </div>
            </div>

            {/* Warning if there are invalid rows */}
            {data.invalidRows > 0 && (
                <div className="mb-4 flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="text-amber-200 font-medium">
                            {data.invalidRows} fila{data.invalidRows > 1 ? 's' : ''} con errores
                        </p>
                        <p className="text-amber-200/70 mt-1">
                            Estas filas no se importarán. Podés corregir el archivo y volver a subirlo.
                        </p>
                    </div>
                </div>
            )}

            {/* Preview table */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
                <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-[#0a0a0b] border-b border-white/10">
                            <tr>
                                <th className="px-3 py-3 text-left text-white/40 font-mono text-[10px] uppercase tracking-wider">#</th>
                                <th className="px-3 py-3 text-left text-white/40 font-mono text-[10px] uppercase tracking-wider">Nombre</th>
                                <th className="px-3 py-3 text-left text-white/40 font-mono text-[10px] uppercase tracking-wider hidden md:table-cell">Fabricante</th>
                                <th className="px-3 py-3 text-left text-white/40 font-mono text-[10px] uppercase tracking-wider hidden md:table-cell">Marca</th>
                                <th className="px-3 py-3 text-left text-white/40 font-mono text-[10px] uppercase tracking-wider hidden lg:table-cell">Escala</th>
                                <th className="px-3 py-3 text-left text-white/40 font-mono text-[10px] uppercase tracking-wider hidden lg:table-cell">Color</th>
                                <th className="px-3 py-3 text-center text-white/40 font-mono text-[10px] uppercase tracking-wider">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.preview.map((row, index) => (
                                <tr 
                                    key={row.row}
                                    onClick={() => !row.isValid && setExpandedRow(expandedRow === index ? null : index)}
                                    className={`border-b border-white/5 transition-colors ${
                                        !row.isValid ? "bg-red-500/5 cursor-pointer hover:bg-red-500/10" : ""
                                    }`}
                                >
                                    <td className="px-3 py-2.5 text-white/40 font-mono">{row.row}</td>
                                    <td className="px-3 py-2.5 text-white font-medium truncate max-w-[200px]">
                                        {row.data.name || <span className="text-red-400 italic">vacío</span>}
                                    </td>
                                    <td className="px-3 py-2.5 text-white/70 hidden md:table-cell">{row.data.manufacturer}</td>
                                    <td className="px-3 py-2.5 text-white/70 hidden md:table-cell">{row.data.brand}</td>
                                    <td className="px-3 py-2.5 text-white/70 hidden lg:table-cell">{row.data.scale}</td>
                                    <td className="px-3 py-2.5 text-white/70 hidden lg:table-cell">{row.data.color}</td>
                                    <td className="px-3 py-2.5 text-center">
                                        {row.isValid ? (
                                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-500/20 rounded-full">
                                                <Check className="w-3.5 h-3.5 text-green-400" />
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500/20 rounded-full">
                                                <X className="w-3.5 h-3.5 text-red-400" />
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Expanded error details */}
            {expandedRow !== null && !data.preview[expandedRow].isValid && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                    <p className="text-sm font-bold text-red-400 mb-2">
                        Errores en fila {data.preview[expandedRow].row}:
                    </p>
                    <ul className="text-sm text-red-300 space-y-1">
                        {data.preview[expandedRow].errors.map((error, i) => (
                            <li key={i}>• {error}</li>
                        ))}
                    </ul>
                </motion.div>
            )}
        </div>
    );
}
