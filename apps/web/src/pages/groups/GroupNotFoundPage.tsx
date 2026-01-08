import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { FolderX, Home, User, ArrowLeft } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function GroupNotFoundPage() {
    const { username } = useParams<{ username: string }>();
    const { user } = useAuth();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col items-center justify-center p-8"
        >
            <div className="bg-white/5 rounded-full p-6 mb-6">
                <FolderX className="w-16 h-16 text-accent/60" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">
                Grupo no encontrado
            </h1>
            <p className="text-white/60 mt-2 text-center max-w-md">
                El grupo que buscás no existe o fue eliminado.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link
                    to="/"
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-white/10 text-white rounded-xl hover:bg-white/5 transition-all"
                >
                    <Home className="w-4 h-4" />
                    Ir al inicio
                </Link>

                {user && (
                    <Link
                        to={`/collection/${user.username}`}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-accent/80 text-white rounded-xl transition-all"
                    >
                        <User className="w-4 h-4" />
                        Mi colección
                    </Link>
                )}

                {username && username !== user?.username && (
                    <Link
                        to={`/collection/${username}`}
                        className="flex items-center justify-center gap-2 px-6 py-3 border border-accent/50 text-accent rounded-xl hover:bg-accent/10 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver a @{username}
                    </Link>
                )}
            </div>
        </motion.div>
    );
}
