import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSpreadsheet } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import { useNavigateBack } from "../../hooks/useNavigateBack";
import { useAuth } from "../../contexts/AuthContext";
import ImportStep1Upload from "../../components/import/ImportStep1Upload";
import ImportStep2Preview from "../../components/import/ImportStep2Preview";
import ImportStep3Result from "../../components/import/ImportStep3Result";
import { 
    ImportPreviewResponse, 
    ImportResult, 
    ImportCarRow 
} from "../../services/import.service";

type Step = 1 | 2 | 3;

export default function ImportCarsPage() {
    const { user } = useAuth();
    const handleBack = useNavigateBack(`/collection/${user?.username || ''}`);

    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [previewData, setPreviewData] = useState<ImportPreviewResponse | null>(null);
    const [importResult, setImportResult] = useState<ImportResult | null>(null);

    const handlePreviewReady = (data: ImportPreviewResponse) => {
        setPreviewData(data);
        setCurrentStep(2);
    };

    const handleImportComplete = (result: ImportResult) => {
        setImportResult(result);
        setCurrentStep(3);
    };

    const handleReset = () => {
        setCurrentStep(1);
        setPreviewData(null);
        setImportResult(null);
    };

    const getValidCars = (): ImportCarRow[] => {
        if (!previewData) return [];
        return previewData.preview
            .filter(row => row.isValid)
            .map(row => row.data);
    };

    return (
        <div className="min-h-screen pb-32 md:pb-8">
            <PageHeader
                title="Importar Colección"
                subtitle="Carga masiva desde Excel"
                icon={FileSpreadsheet}
                onBack={handleBack}
            />

            <div className="container mx-auto px-4 py-6">
                {/* Stepper */}
                <div className="max-w-3xl mx-auto mb-8">
                    <div className="flex items-center justify-center gap-2">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                        currentStep >= step
                                            ? "bg-accent text-white"
                                            : "bg-white/10 text-white/40"
                                    }`}
                                >
                                    {step}
                                </div>
                                {step < 3 && (
                                    <div
                                        className={`w-12 md:w-20 h-0.5 transition-all ${
                                            currentStep > step
                                                ? "bg-accent"
                                                : "bg-white/10"
                                        }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-white/40 uppercase tracking-wider">
                        <span className={currentStep >= 1 ? "text-accent" : ""}>Subir</span>
                        <span className={currentStep >= 2 ? "text-accent" : ""}>Revisar</span>
                        <span className={currentStep >= 3 ? "text-accent" : ""}>Resultado</span>
                    </div>
                </div>

                {/* Step content */}
                <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <ImportStep1Upload onPreviewReady={handlePreviewReady} />
                        </motion.div>
                    )}

                    {currentStep === 2 && previewData && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <ImportStep2Preview
                                data={previewData}
                                onImportComplete={handleImportComplete}
                                onBack={handleReset}
                                getValidCars={getValidCars}
                            />
                        </motion.div>
                    )}

                    {currentStep === 3 && importResult && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <ImportStep3Result
                                result={importResult}
                                onReset={handleReset}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
