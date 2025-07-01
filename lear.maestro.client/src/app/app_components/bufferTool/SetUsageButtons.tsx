interface Props {
  bufferUsage: BufferUsage;
  setUsage: (usage: BufferUsage) => void;
}

export default function SetUsageButtons({ bufferUsage, setUsage }: Props) {
  const baseStyle =
    "w-full p-2 rounded-md border text-sm tracking-wide uppercase font-semibold transition-all duration-200 active:scale-95 cursor-pointer";
  return (
    <div className="flex gap-4 justify-end">
      {/* Load Button */}
      <button
        className={`${baseStyle} ${
          bufferUsage === "load"
            ? "bg-yellow-500 text-black border-yellow-600 ring-2 ring-yellow-400 shadow-md"
            : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-yellow-900 hover:border-yellow-600"
        }`}
        onClick={() => setUsage("load")}
      >
        Loading buffer
      </button>

      {/* Unload Button */}
      <button
        className={`${baseStyle} ${
          bufferUsage === "unload"
            ? "bg-blue-500 text-black border-blue-600 ring-2 ring-blue-400 shadow-md"
            : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-blue-900 hover:border-blue-600"
        }`}
        onClick={() => setUsage("unload")}
      >
        Unloading buffer
      </button>
    </div>
  );
}
