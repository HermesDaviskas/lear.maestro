import { ChevronDown, ChevronUp } from "lucide-react";
import { sectionStatus } from "./types";

interface Props {
  sectionName: string;
  status: sectionStatus;
  lastUpdated: string;
  expanded: boolean;
  toggleExpanded: () => void;
}

export default function Header({
  sectionName,
  status,
  lastUpdated,
  expanded,
  toggleExpanded,
}: Props) {
  const statusColor =
    status === "waiting"
      ? "bg-gray-500"
      : status === "loading"
      ? "bg-yellow-400 animate-pulse"
      : status === "unloading"
      ? "bg-blue-400 animate-pulse"
      : "bg-green-400";

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
      <span className="text-sm font-bold tracking-widest text-cyan-400 uppercase">
        {sectionName}
      </span>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${statusColor}`} />
          <span className="text-xs text-gray-400 tracking-widest uppercase">
            {status}
          </span>
        </div>
        <span className="text-xs text-gray-500 tracking-widest uppercase">
          {lastUpdated !== "–" ? `Last: ${lastUpdated}` : "No activity"}
        </span>
        <button
          onClick={toggleExpanded}
          className="text-gray-500 hover:text-cyan-400 transition cursor-pointer"
          title="Toggle View"
        >
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
