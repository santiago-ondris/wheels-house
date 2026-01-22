import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Search, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
    icon?: React.ReactNode;
    clearable?: boolean;
}

export default function MobileBottomSheet({
    isOpen,
    onClose,
    title,
    options,
    value,
    onChange,
    icon,
    clearable = false,
}: MobileBottomSheetProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSearchQuery("");
            setIsExpanded(false);
        }
    }, [isOpen]);

    const filteredOptions = searchQuery === ""
        ? options
        : options.filter((option) =>
            option.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const handleSelect = (option: string) => {
        onChange(option);
        onClose();
    };

    const handleClear = () => {
        onChange("");
        onClose();
    };

    const handleFocus = () => {
        setIsExpanded(true);
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-50">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/70" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className={`flex min-h-full justify-center ${isExpanded ? 'items-start' : 'items-end'}`}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom={isExpanded ? "opacity-0" : "translate-y-full"}
                            enterTo={isExpanded ? "opacity-100" : "translate-y-0"}
                            leave="ease-in duration-200"
                            leaveFrom={isExpanded ? "opacity-100" : "translate-y-0"}
                            leaveTo={isExpanded ? "opacity-0" : "translate-y-full"}
                        >
                            <Dialog.Panel
                                className={`w-full bg-dark border-t border-white/10 flex flex-col overflow-hidden transition-all duration-300 ease-in-out
                                ${isExpanded
                                        ? 'h-dvh rounded-none'
                                        : 'max-h-[85vh] rounded-t-3xl'
                                    }`}
                            >
                                {/* Drag handle - only show when NOT expanded */}
                                {!isExpanded && (
                                    <div className="flex justify-center pt-3 pb-2" onClick={() => onClose()}>
                                        <div className="w-10 h-1 bg-white/20 rounded-full" />
                                    </div>
                                )}

                                {/* Header */}
                                <div className={`flex items-center justify-between px-5 pb-4 ${isExpanded ? 'pt-4' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        {icon && (
                                            <span className="text-accent">
                                                {icon}
                                            </span>
                                        )}
                                        <Dialog.Title className="text-lg font-bold text-white">
                                            {title}
                                        </Dialog.Title>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {clearable && value && (
                                            <button
                                                type="button"
                                                onClick={handleClear}
                                                className="px-3 py-1.5 text-sm text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5 active:scale-95"
                                            >
                                                Limpiar
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="p-2 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/5 active:scale-95"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Search Bar */}
                                <div className="px-5 pb-4">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="text"
                                            placeholder="Buscar..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onFocus={handleFocus}
                                            className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-3.5 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-base"
                                            autoFocus={false}
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto px-3 pb-8">
                                    <AnimatePresence mode="wait">
                                        {filteredOptions.length === 0 ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="py-12 text-center text-white/40"
                                            >
                                                No se encontraron resultados
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="space-y-1"
                                            >
                                                {filteredOptions.map((option, index) => {
                                                    const isSelected = option === value;
                                                    return (
                                                        <motion.button
                                                            key={option}
                                                            type="button"
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.02 }}
                                                            onClick={() => handleSelect(option)}
                                                            className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all active:scale-[0.98] ${isSelected
                                                                ? "bg-accent/20 text-accent"
                                                                : "text-white hover:bg-white/5"
                                                                }`}
                                                        >
                                                            <span className={`text-base ${isSelected ? "font-semibold" : ""}`}>
                                                                {option}
                                                            </span>
                                                            {isSelected && (
                                                                <motion.span
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    className="flex items-center justify-center w-6 h-6 bg-accent rounded-full"
                                                                >
                                                                    <Check className="w-4 h-4 text-white" />
                                                                </motion.span>
                                                            )}
                                                        </motion.button>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}