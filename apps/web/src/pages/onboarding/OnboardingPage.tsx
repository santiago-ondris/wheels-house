import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Rocket,
    Car,
    Layers,
    Star,
    ChevronRight,
    ChevronLeft,
    X
} from 'lucide-react';
import { useOnboarding } from '../../hooks/useOnboarding';
import OnboardingStep from '../../components/onboarding/OnboardingStep';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const STEPS = [
    {
        title: 'Colección_Iniciada',
        description: 'Bienvenido a Wheels House. Tu nuevo espacio para gestionar, organizar y compartir tu colección de vehículos a escala.',
        icon: Rocket,
    },
    {
        title: 'Tu_Colección',
        description: 'Agregá autos con fotos, marca, modelo, escala y todos los detalles que quieras documentar. Tu colección, tus reglas.',
        icon: Car,
    },
    {
        title: 'Tus_Grupos',
        description: 'Organizá tus autos en grupos personalizados: por serie, color, marca o cualquier criterio que imagines.',
        icon: Layers,
    },
    {
        title: 'Tu_Wishlist',
        description: 'Guardá los modelos que te faltan para no perderles el rastro. Cuando los consigas, pasalos directo a tu colección.',
        icon: Star,
    },
];

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const { completeOnboarding, skipOnboarding } = useOnboarding();
    useNavigate();
    useAuth();

    // Redirect if already completed
    // useEffect(() => {
    //     if (hasCompletedOnboarding()) {
    //         navigate(`/collection/${user?.username}`, { replace: true });
    //     }
    // }, [hasCompletedOnboarding, navigate, user]);

    const isLastStep = currentStep === STEPS.length - 1;
    const isFirstStep = currentStep === 0;

    const nextStep = () => {
        if (isLastStep) {
            completeOnboarding();
        } else {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        if (!isFirstStep) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const currentStepData = STEPS[currentStep];

    return (
        <div className="min-h-screen bg-[#0a0a0b] flex flex-col">
            {/* Header with Skip Button */}
            <header className="sticky top-0 z-50 bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.2em]">
                            ONBOARDING_ACTIVO
                        </span>
                    </div>
                    <button
                        onClick={skipOnboarding}
                        className="group flex items-center gap-2 px-3 py-1.5 text-white/40 hover:text-white font-mono text-[11px] uppercase tracking-widest transition-all hover:bg-white/5 rounded-lg"
                    >
                        <span>SALTAR</span>
                        <X className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col pt-1 md:pt-12">
                <AnimatePresence mode="wait">
                    <OnboardingStep
                        key={currentStep}
                        stepNumber={currentStep + 1}
                        totalSteps={STEPS.length}
                        title={currentStepData.title}
                        description={currentStepData.description}
                        icon={currentStepData.icon}
                    />
                </AnimatePresence>
            </main>

            {/* Footer Navigation */}
            <footer className="sticky bottom-0 bg-[#0a0a0b]/80 backdrop-blur-xl border-t border-white/5">
                <div className="container mx-auto px-4 py-6">
                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 mb-6">
                        {STEPS.map((_, idx) => (
                            <motion.button
                                key={idx}
                                onClick={() => setCurrentStep(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentStep
                                    ? 'bg-accent w-6'
                                    : idx < currentStep
                                        ? 'bg-accent/40'
                                        : 'bg-white/10'
                                    }`}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                            />
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-3">
                        {!isFirstStep && (
                            <motion.button
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={prevStep}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-mono text-sm uppercase tracking-widest rounded-xl border border-white/10 transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Anterior</span>
                            </motion.button>
                        )}

                        <motion.button
                            onClick={nextStep}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-mono text-sm uppercase tracking-widest rounded-xl transition-all ${isLastStep
                                ? 'bg-accent hover:bg-accent/80 text-white'
                                : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                                }`}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span>{isLastStep ? 'Comenzar' : 'Siguiente'}</span>
                            <ChevronRight className="w-4 h-4" />
                        </motion.button>
                    </div>

                    {/* Bottom Console Text */}
                    <div className="mt-6 flex justify-center">
                        <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-[0.2em]">
                            WHEELS_HOUSE © 2026 // BIENVENIDO
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
