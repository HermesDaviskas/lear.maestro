import { usage } from "./types";

interface SetUsageButtonsProps {
  usage: usage;
  setUsage: (usage: usage) => void;
}

export default function SetUsageButtons({ usage, setUsage }: SetUsageButtonsProps) {
  const baseStyle =
    "w-full py-2 rounded-md border text-sm tracking-wide uppercase font-semibold transition-all duration-200 active:scale-95 cursor-pointer";

  return (
    <div className="flex flex-col gap-2">
      {/* Load Button */}
      <button
        className={`${baseStyle} ${
          usage === "load"
            ? "bg-yellow-500 text-black border-yellow-600 ring-2 ring-yellow-400 shadow-md"
            : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-yellow-900 hover:border-yellow-600"
        }`}
        onClick={() => setUsage("load")}
      >
        Use buffer for loading
      </button>

      {/* Unload Button */}
      <button
        className={`${baseStyle} ${
          usage === "unload"
            ? "bg-blue-500 text-black border-blue-600 ring-2 ring-blue-400 shadow-md"
            : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-blue-900 hover:border-blue-600"
        }`}
        onClick={() => setUsage("unload")}
      >
        Use buffer for unloading
      </button>
    </div>
  );
}
