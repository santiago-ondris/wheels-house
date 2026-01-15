import { useState, Fragment, useRef, useEffect } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

interface SuggestionInputProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    icon?: React.ReactNode;
    error?: string;
    autoFocus?: boolean;
}

export default function SuggestionInput({
    options,
    value,
    onChange,
    placeholder = "Escribir...",
    icon,
    error,
    autoFocus = false,
}: SuggestionInputProps) {
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            // Small delay to ensure DOM is ready after remount
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [autoFocus]);

    const filteredOptions =
        query === ""
            ? options
            : options.filter((option) =>
                option.toLowerCase().includes(query.toLowerCase())
            );

    return (
        <Combobox value={value} onChange={(val: string | null) => val !== null && onChange(val)}>
            <div className="relative">
                <div className="relative">
                    {icon && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 z-10 pointer-events-none">
                            {icon}
                        </span>
                    )}
                    <Combobox.Input
                        ref={inputRef}
                        className={`w-full bg-input-bg border ${error ? "border-danger" : "border-white/5"
                            } ${icon ? "pl-10" : "pl-4"} pr-10 py-2.5 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-base`}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            onChange(e.target.value);
                        }}
                        placeholder={placeholder}
                        displayValue={(val: string) => val}
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
                        {filteredOptions.length > 0 && (
                            filteredOptions.slice(0, 10).map((option) => (
                                <Combobox.Option
                                    key={option}
                                    value={option}
                                    className={({ active, selected }) =>
                                        `relative cursor-pointer select-none py-3 pl-4 pr-4 ${active ? "bg-accent/20 text-accent" : "text-white"
                                        } ${selected ? "bg-accent/10" : ""}`
                                    }
                                >
                                    {({ selected }) => (
                                        <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                            {option}
                                        </span>
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
