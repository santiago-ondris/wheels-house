import { useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const SCROLL_STORAGE_KEY = 'collection_scroll_positions';

/**
 * Obtiene la clave de almacenamiento para la ubicación actual
 */
function getScrollKey(pathname: string, search: string): string {
    return `${pathname}${search}`;
}

/**
 * Guarda la posición de desplazamiento en sessionStorage
 */
function saveScrollToStorage(key: string, position: number): void {
    try {
        const stored = sessionStorage.getItem(SCROLL_STORAGE_KEY);
        const positions = stored ? JSON.parse(stored) : {};
        positions[key] = position;
        sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(positions));
    } catch (e) {
        // Ignora errores de almacenamiento
    }
}

/**
 * Obtiene la posición de desplazamiento guardada en sessionStorage
 */
function getScrollFromStorage(key: string): number | null {
    try {
        const stored = sessionStorage.getItem(SCROLL_STORAGE_KEY);
        if (!stored) return null;
        const positions = JSON.parse(stored);
        return positions[key] ?? null;
    } catch (e) {
        return null;
    }
}

/**
 * Elimina la posición de desplazamiento de sessionStorage
 */
function clearScrollFromStorage(key: string): void {
    try {
        const stored = sessionStorage.getItem(SCROLL_STORAGE_KEY);
        if (!stored) return;
        const positions = JSON.parse(stored);
        delete positions[key];
        sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(positions));
    } catch (e) {
        // Ignora errores de almacenamiento
    }
}

/**
 * Hook que guarda la posición de desplazamiento antes de navegar lejos y restaura
 * cuando regresa a la página (después de que el contenido asincrónico se haya cargado).
 * 
 * @param isContentLoaded - Si el contenido asincrónico está completamente cargado
 */
export function useCollectionScrollRestore(isContentLoaded: boolean) {
    const location = useLocation();
    const navigationType = useNavigationType();
    const scrollKey = getScrollKey(location.pathname, location.search);

    // Trackea si ya se restauró la posición de desplazamiento para esta ubicación
    const hasRestoredRef = useRef<string | null>(null);

    // Restaura la posición de desplazamiento cuando el contenido se carga y se navega hacia atrás
    useEffect(() => {
        // Solo restaura en navegación POP (atrás/adelante) cuando el contenido se carga
        if (!isContentLoaded) return;
        if (navigationType !== 'POP') return;
        if (hasRestoredRef.current === scrollKey) return; // Already restored

        const savedPosition = getScrollFromStorage(scrollKey);
        if (savedPosition !== null && savedPosition > 0) {
            // Use requestAnimationFrame to ensure DOM is ready
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: savedPosition,
                    behavior: 'instant'
                });
            });
            hasRestoredRef.current = scrollKey;
            clearScrollFromStorage(scrollKey);
        }
    }, [isContentLoaded, navigationType, scrollKey]);

    // Resetea el flag de restauración cuando la ubicación cambia
    useEffect(() => {
        if (hasRestoredRef.current !== scrollKey) {
            hasRestoredRef.current = null;
        }
    }, [scrollKey]);

    // Guarda la posición de desplazamiento actual antes de navegar lejos
    const saveScrollPosition = useCallback(() => {
        saveScrollToStorage(scrollKey, window.scrollY);
    }, [scrollKey]);

    return { saveScrollPosition };
}
