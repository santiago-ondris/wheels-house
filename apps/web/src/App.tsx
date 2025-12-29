import { motion } from "framer-motion";
import { Flame } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-background font-arvo flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center"
      >
        <Flame className="w-16 h-16 text-accent mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Wheels House</h1>
        <p className="text-white/60 uppercase tracking-widest text-sm">
          Collection Manager
        </p>
      </motion.div>
    </div>
  );
}

export default App;