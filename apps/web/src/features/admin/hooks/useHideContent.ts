import { useState } from 'react';
import { apiRequest } from '../../../services/api';

interface HideContentResult {
    success: boolean;
}

export function useHideContent() {
    const [isLoading, setIsLoading] = useState(false);

    const hideCar = async (carId: number, reason: string) => {
        setIsLoading(true);
        try {
            await apiRequest<HideContentResult>(`/admin/cars/${carId}/hide`, {
                method: 'PATCH',
                body: JSON.stringify({ reason }),
            });
            return true;
        } catch (error) {
            console.error('Error hiding car:', error);
            return false; // or rethrow
        } finally {
            setIsLoading(false);
        }
    };

    const hideGroup = async (groupId: number, reason: string) => {
        setIsLoading(true);
        try {
            await apiRequest<HideContentResult>(`/admin/groups/${groupId}/hide`, {
                method: 'PATCH',
                body: JSON.stringify({ reason }),
            });
            return true;
        } catch (error) {
            console.error('Error hiding group:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { hideCar, hideGroup, isLoading };
}
