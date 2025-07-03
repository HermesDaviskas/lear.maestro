/*
 * Simplified buffer contents indicator for fixed 1x1 layout.
 * Expects a single stock value in buffer.contents[0] (0 or 1).
 */

interface Props {
  contents: BufferContents;
  bufferUsage: BufferUsage;
}

export default function ContentsIndicator({ contents, bufferUsage }: Props) {
  const { indicatorStyle, label } = getIndicatorStyle(contents[0], bufferUsage);

  return (
    <div className="flex flex-col h-full p-4 border border-gray-700 rounded-md">
      <div
        className={`flex w-full h-full min-h-10 rounded-md items-center justify-center 
          font-bold text-xs border transition-all duration-150 cursor-pointer ${indicatorStyle}`}
      >
        {label}
      </div>
    </div>
  );
}

function getIndicatorStyle(
  contents: number,
  bufferUsage: BufferUsage
): { indicatorStyle: string; label: string } {
  if (bufferUsage === "load") {
    return contents === 0
      ? { indicatorStyle: "bg-red-600 border-red-400 text-black", label: "Empty" }
      : { indicatorStyle: "bg-green-600 border-green-400 text-black", label: "Full" };
  }

  if (bufferUsage === "unload") {
    return contents === 0
      ? {
          indicatorStyle: "bg-green-600 border-green-400 text-black",
          label: "Empty",
        }
      : { indicatorStyle: "bg-red-600 border-red-400 text-black", label: "Full" };
  }

  return {
    indicatorStyle: "bg-gray-600 border-gray-500 text-white",
    label: "N/A",
  };
}
