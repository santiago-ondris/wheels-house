import { LayoutGrid, List } from "lucide-react";

interface ViewSwitcherProps {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export default function ViewSwitcher({ view, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="flex bg-white/5 rounded-lg p-1">
      <button
        onClick={() => onViewChange("grid")}
        className={`p-2 rounded-md transition-colors ${
          view === "grid" ? "bg-accent text-white" : "text-white/50 hover:text-white"
        }`}
      >
        <LayoutGrid className="w-5 h-5" />
      </button>
      <button
        onClick={() => onViewChange("list")}
        className={`p-2 rounded-md transition-colors ${
          view === "list" ? "bg-accent text-white" : "text-white/50 hover:text-white"
        }`}
      >
        <List className="w-5 h-5" />
      </button>
    </div>
  );
}