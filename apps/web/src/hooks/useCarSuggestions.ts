import { useState, useEffect, useCallback } from "react";
import { getSuggestions, CarSuggestions } from "../services/car.service";

export function useCarSuggestions() {
    const [suggestions, setSuggestions] = useState<CarSuggestions>({
        names: [],
        series: [],
        designers: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSuggestions = async () => {
            try {
                const data = await getSuggestions();
                setSuggestions(data);
            } catch (error) {
                console.error("Error loading suggestions:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSuggestions();
    }, []);

    // Add a name to local suggestions without refetching from API
    // This is useful for quick-add flow where the same name might be entered multiple times
    const addLocalSuggestion = useCallback((name: string) => {
        if (!name.trim()) return;
        setSuggestions((prev) => {
            // Don't add duplicates
            if (prev.names.includes(name)) return prev;
            return {
                ...prev,
                names: [name, ...prev.names],
            };
        });
    }, []);

    return { suggestions, isLoading, addLocalSuggestion };
}
