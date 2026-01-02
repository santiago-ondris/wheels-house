import { useState, Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";

interface SearchableSelectProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    icon?: React.ReactNode;
    error?: string;
}

export default function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = "Seleccionar...",
    icon,
    error,
}: SearchableSelectProps) {
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
        <Combobox value={value} onChange={handleChange}>
            <div className="relative">
                <div className="relative">
                    {icon && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 z-10 pointer-events-none">
                            {icon}
                        </span>
                    )}
                    <Combobox.Input
                        className={`w-full bg-input-bg border ${error ? "border-danger" : "border-white/5"
                            } ${icon ? "pl-10" : "pl-4"} pr-10 py-2.5 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm`}
                        displayValue={(option: string) => option}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={placeholder}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronDown className="w-4 h-4 text-white/40" aria-hidden="true" />
                    </Combobox.Button>
                </div>

                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery("")}
                >
                    <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-dark border border-white/10 py-1 text-sm shadow-xl focus:outline-none">
                        {query.length > 0 && filteredOptions.length === 0 ? (
                            <div className="px-4 py-3 text-white/40 text-center">
                                No se encontraron resultados
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <Combobox.Option
                                    key={option}
                                    value={option}
                                    className={({ active, selected }) =>
                                        `relative cursor-pointer select-none py-3 pl-10 pr-4 ${active ? "bg-accent/20 text-accent" : "text-white"
                                        } ${selected ? "bg-accent/10" : ""}`
                                    }
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                                {option}
                                            </span>
                                            {selected && (
                                                <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? "text-accent" : "text-accent"}`}>
                                                    <Check className="w-4 h-4" aria-hidden="true" />
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
    );
}
