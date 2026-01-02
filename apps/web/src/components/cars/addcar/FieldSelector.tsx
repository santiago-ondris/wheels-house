import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Combobox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import MobileBottomSheet from "../../ui/MobileBottomSheet";

interface FieldSelectorProps {
    label: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    icon?: React.ReactNode;
    error?: string;
    required?: boolean;
}

export default function FieldSelector({
    label,
    options,
    value,
    onChange,
    placeholder = "Seleccionar...",
    icon,
    error,
    required = false,
}: FieldSelectorProps) {
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [query, setQuery] = useState("");

    const filteredOptions =
        query === ""
            ? options
            : options.filter((option) =>
                option.toLowerCase().includes(query.toLowerCase())
            );

    const handleChange = (newValue: string | null) => {
        if (newValue !== null) {
            onChange(newValue);
        }
    };

    return (
        <div className="space-y-1.5">
            <label className={`block uppercase tracking-widest text-[10px] font-bold ml-1 ${required ? "text-accent" : "text-white/50"}`}>
                {label} {required && <span className="text-danger">*</span>}
            </label>

            <button
                type="button"
                onClick={() => setIsBottomSheetOpen(true)}
                className={`md:hidden w-full flex items-center justify-between bg-input-bg border ${error ? "border-danger" : "border-white/5"} px-4 py-3.5 rounded-xl text-left transition-all active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-accent/50`}
            >
                <div className="flex items-center gap-3">
                    {icon && <span className="text-white/40">{icon}</span>}
                    <span className={value ? "text-white" : "text-white/30"}>
                        {value || placeholder}
                    </span>
                </div>
                <ChevronDown className="w-4 h-4 text-white/40" />
            </button>

            <div className="hidden md:block">
                <Combobox value={value} onChange={handleChange}>
                    <div className="relative">
                        <div className="relative">
                            {icon && (
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 z-10 pointer-events-none">
                                    {icon}
                                </span>
                            )}
                            <Combobox.Input
                                className={`w-full bg-input-bg border ${error ? "border-danger" : "border-white/5"} ${icon ? "pl-12" : "pl-4"} pr-12 py-3.5 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-base`}
                                displayValue={(option: string) => option}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={placeholder}
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <ChevronDown className="w-5 h-5 text-white/40" aria-hidden="true" />
                            </Combobox.Button>
                        </div>

                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            afterLeave={() => setQuery("")}
                        >
                            <Combobox.Options className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-xl bg-dark border border-white/10 py-2 text-base shadow-2xl focus:outline-none">
                                {query.length > 0 && filteredOptions.length === 0 ? (
                                    <div className="px-4 py-4 text-white/40 text-center">
                                        No se encontraron resultados
                                    </div>
                                ) : (
                                    filteredOptions.map((option) => (
                                        <Combobox.Option
                                            key={option}
                                            value={option}
                                            className={({ active, selected }) =>
                                                `relative cursor-pointer select-none py-3.5 pl-12 pr-4 transition-colors ${active ? "bg-accent/20 text-accent" : "text-white"} ${selected ? "bg-accent/10" : ""}`
                                            }
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <span className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}>
                                                        {option}
                                                    </span>
                                                    {selected && (
                                                        <span className={`absolute inset-y-0 left-0 flex items-center pl-4 ${active ? "text-accent" : "text-accent"}`}>
                                                            <Check className="w-5 h-5" aria-hidden="true" />
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </Combobox.Option>
                                    ))
                                )}
                            </Combobox.Options>
                        </Transition>
                    </div>
                </Combobox>
            </div>

            {error && <p className="text-danger text-[10px] ml-1">{error}</p>}

            <MobileBottomSheet
                isOpen={isBottomSheetOpen}
                onClose={() => setIsBottomSheetOpen(false)}
                title={label}
                options={options}
                value={value}
                onChange={onChange}
                icon={icon}
            />
        </div>
    );
}
