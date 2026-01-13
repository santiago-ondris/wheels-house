import { Outlet, ScrollRestoration } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/**
 * Root layout component that provides:
 * - AuthProvider context (must be inside RouterProvider for useNavigate to work)
 * - ScrollRestoration for automatic scroll position management
 * - Main layout structure (Navbar, content, Footer)
 * - Toast notifications
 */
export default function RootLayout() {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-background font-arvo flex flex-col">
                <Navbar />
                <main className="flex-1">
                    <Outlet />
                </main>
                <Footer />
            </div>
            
            {/* ScrollRestoration handles scroll position on navigation */}
            {/* Default behavior: stores scroll by navigation key, restores on back */}
            <ScrollRestoration />
            
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
        </AuthProvider>
    );
}
