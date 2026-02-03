import { useEffect, useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoginModal from "../components/auth/LoginModal";
import { useAuth } from "../contexts/AuthContext";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
});

/**
 * Root layout component that provides:
 * - AuthProvider context (must be inside RouterProvider for useNavigate to work)
 * - QueryClientProvider for React Query
 * - ScrollRestoration for automatic scroll position management
 * - Main layout structure (Navbar, content, Footer)
 * - Toast notifications
 */
export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <LayoutContent />
            </AuthProvider>
        </QueryClientProvider>
    );
}

function LayoutContent() {
    const { pathname } = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const { isLoginModalOpen, loginModalMessage, closeLoginModal } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Force scroll to top for specific pages that should always start at the beginning
    useEffect(() => {
        const resetScrollPaths = [
            '/',
            '/collection/add',
            '/collection/quick-add',
            '/wishlist/add',
            '/collection/group/new',
            '/onboarding',
            '/settings',
            '/import'
        ];

        const isActionPath = pathname.includes('/edit/') || pathname.includes('/manage/');

        if (resetScrollPaths.includes(pathname) || isActionPath) {
            window.scrollTo(0, 0);
        }
    }, [pathname]);

    return (
        <>
            <div
                className="min-h-screen bg-background font-arvo flex flex-col"
                style={{
                    '--navbar-height': isScrolled ? '72px' : '88px',
                    transition: 'padding-top 0.5s ease-in-out'
                } as React.CSSProperties}
            >
                {pathname !== '/onboarding' && <Navbar isScrolled={isScrolled} />}
                <main
                    className={`flex-1 ${pathname === '/onboarding' ? 'pt-0' : 'pt-[var(--navbar-height)]'}`}
                >
                    <Outlet />
                </main>
                {pathname !== '/onboarding' && <Footer />}
            </div>

            {/* ScrollRestoration handles scroll position on navigation */}
            {/* For collection pages, we disable auto-restoration since we handle it manually */}
            {/* after async content loads via useCollectionScrollRestore hook */}
            <ScrollRestoration
                getKey={(location) => {
                    const { pathname } = location;

                    // Manual restoration only for ProfilePage and GroupDetailPage list views.
                    // These pages handle their own scroll via useCollectionScrollRestore hook.
                    // We exclude action sub-paths to avoid "scroll inheritance".

                    const isManualProfile = /^\/collection\/[^/]+$/.test(pathname) &&
                        pathname !== '/collection/add' &&
                        pathname !== '/collection/quick-add';

                    const isManualGroup = /^\/collection\/[^/]+\/group\/[^/]+$/.test(pathname) &&
                        !pathname.includes('/edit') &&
                        !pathname.includes('/manage');

                    if (isManualProfile || isManualGroup) {
                        return 'collection-manual';
                    }

                    // For other pages, use pathname + search for proper restoration
                    return pathname + location.search;
                }}
            />

            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white',
                        fontFamily: 'Arvo, serif',
                    },
                    success: {
                        iconTheme: {
                            primary: '#D9731A',
                            secondary: 'white',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#BF3939',
                            secondary: 'white',
                        },
                    },
                }}
            />

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={closeLoginModal}
                message={loginModalMessage}
            />
        </>
    );
}
