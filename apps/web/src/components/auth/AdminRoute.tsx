import ForbiddenPage from "../../pages/errors/ForbiddenPage";
import { useAuth } from "../../contexts/AuthContext";

interface AdminRouteProps {
    children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    if (!isAuthenticated || !user?.isAdmin) {
        return <ForbiddenPage />;
    }

    return <>{children}</>;
}
