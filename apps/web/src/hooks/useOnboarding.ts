import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const STORAGE_KEY = 'wheelshouse_onboarding_completed';

export function useOnboarding() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const hasCompletedOnboarding = useCallback(() => {
        return localStorage.getItem(STORAGE_KEY) === 'true';
    }, []);

    const completeOnboarding = useCallback(() => {
        localStorage.setItem(STORAGE_KEY, 'true');
        if (user?.username) {
            navigate(`/collection/${user.username}`, { replace: true });
        } else {
            navigate('/', { replace: true });
        }
    }, [navigate, user]);

    const skipOnboarding = useCallback(() => {
        // Same behavior as completing - marks as done and navigates
        completeOnboarding();
    }, [completeOnboarding]);

    return {
        hasCompletedOnboarding,
        completeOnboarding,
        skipOnboarding,
    };
}
