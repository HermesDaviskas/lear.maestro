import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  friendlyName: SectionFriendlyName;
  sectionActivity: SectionActivity;
  expanded: boolean;
  toggleExpanded: () => void;
}

export default function Header({
  friendlyName,
  sectionActivity,
  expanded,
  toggleExpanded,
}: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
      <span className="text-sm font-bold tracking-widest text-cyan-400 uppercase">
        {friendlyName}
      </span>

      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-500 tracking-widest uppercase">
          {sectionActivity ? sectionActivity : "No activity"}
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
