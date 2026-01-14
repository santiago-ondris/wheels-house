import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

/**
 * Hook for safe "back" navigation with a fallback path.
 * 
 * Solves the problem where navigate(-1) might exit the app
 * if there's no previous history in the same session.
 * 
 * @param fallbackPath - Path to navigate to if there's no history
 * @returns A function that navigates back or to the fallback
 * 
 * @example
 * const navigateBack = useNavigateBack("/collection/john");
 * // Later...
 * <button onClick={navigateBack}>Cancel</button>
 */
export function useNavigateBack(fallbackPath: string = "/") {
    const navigate = useNavigate();

    return useCallback(() => {
        // window.history.length includes the current page
        // A value of 1 or 2 means we're at the start of navigation
        // (1 = only current page, 2 = one page before current)
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            // No meaningful history, go to fallback
            navigate(fallbackPath, { replace: true });
        }
    }, [navigate, fallbackPath]);
}
