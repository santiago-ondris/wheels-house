import { useState, useEffect } from "react";
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

    return { suggestions, isLoading };
}
