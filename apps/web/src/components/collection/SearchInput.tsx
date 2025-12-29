import { Search } from "lucide-react";

export default function SearchInput() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
      <input
        type="text"
        placeholder="Buscar en mi colección..."
        className="w-full bg-input-bg pl-11 pr-4 py-3 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </div>
  );
}