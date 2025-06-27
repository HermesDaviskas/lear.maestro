import { BufferGroupFlattened } from "@/app/types";
import { usage } from "./types";

interface Props {
  buffer: BufferGroupFlattened;
  usage: usage;
}

/*
 * Simplified buffer contents indicator for fixed 1x1 layout.
 * Expects a single stock value in buffer.contents[0] (0 or 1).
 */
export default function ContentsIndicator({ buffer, usage }: Props) {
  const stock = buffer.contents[0];
  const { coloringClasses, label } = getIndicatorState(usage, stock);

  return (
    <div className="flex flex-col gap-1 p-4 bg-gray-900/80 backdrop-blur-sm text-white rounded-l-2xl">
      <div className="flex gap-2 items-center justify-around p-4 border border-gray-700 rounded bg-gray-900/80 backdrop-blur-sm text-white">
        <div
          className={`flex w-45 h-15 rounded-md items-center justify-center font-bold text-xs border transition-all duration-150 cursor-pointer ${coloringClasses}`}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

function getIndicatorState(
  usage: usage,
  stock: number
): { coloringClasses: string; label: string } {
  if (usage === "load") {
    return stock === 0
      ? { coloringClasses: "bg-red-600 border-red-400 text-black", label: "Empty" }
      : { coloringClasses: "bg-green-600 border-green-400 text-black", label: "Full" };
  }

  if (usage === "unload") {
    return stock === 0
      ? {
          coloringClasses: "bg-green-600 border-green-400 text-black",
          label: "Empty",
        }
      : { coloringClasses: "bg-red-600 border-red-400 text-black", label: "Full" };
  }

  return {
    coloringClasses: "bg-gray-600 border-gray-500 text-white",
    label: "N/A",
  };
}
