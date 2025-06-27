import { useState } from "react";
import { Upload, Download } from "lucide-react";
import BufferSelectionModal from "./BufferSelectionModal";

interface BufferRef {
  bufferGroupKey: string;
  bufferGroupName: string;
}

interface LoadUnloadButtonsProps {
  loadBuffers: BufferRef[];
  unloadBuffers: BufferRef[];
}

export default function LoadUnloadButtons({
  loadBuffers,
  unloadBuffers,
}: LoadUnloadButtonsProps) {
  const [modalType, setModalType] = useState<"load" | "unload" | null>(null);

  const canLoad = loadBuffers.length > 0;
  const canUnload = unloadBuffers.length > 0;

  const handleOpenModal = (type: "load" | "unload") => {
    if ((type === "load" && canLoad) || (type === "unload" && canUnload)) {
      setModalType(type);
    }
  };

  const handleSelectBuffer = (selectedKey: string) => {
    console.log(`Performing ${modalType} with buffer:`, selectedKey);
    setModalType(null);
  };

  const activeBufferList = modalType === "load" ? loadBuffers : unloadBuffers;

  return (
    <>
      <div className="flex gap-4 px-4 justify-center">
        <button
          onClick={() => handleOpenModal("load")}
          disabled={!canLoad}
          className={`relative w-full group px-5 py-2 text-xs font-extrabold uppercase tracking-widest
            border rounded-md bg-gray-900 transition-all duration-200 active:scale-95 focus:ring-2
            ${
              canLoad
                ? "text-yellow-400 border-yellow-600 hover:bg-yellow-900 focus:ring-yellow-400"
                : "text-gray-500 border-gray-700 cursor-not-allowed opacity-50"
            }`}
        >
          <span className="absolute -inset-1 rounded-md border border-yellow-800 opacity-30 group-hover:opacity-60 pointer-events-none" />
          <span className="flex items-center justify-center gap-2">
            <Upload className="w-4 h-4" />
            Load
          </span>
        </button>

        <button
          onClick={() => handleOpenModal("unload")}
          disabled={!canUnload}
          className={`relative w-full group px-5 py-2 text-xs font-extrabold uppercase tracking-widest
            border rounded-md bg-gray-900 transition-all duration-200 active:scale-95 focus:ring-2
            ${
              canUnload
                ? "text-blue-400 border-blue-600 hover:bg-blue-900 focus:ring-blue-400"
                : "text-gray-500 border-gray-700 cursor-not-allowed opacity-50"
            }`}
        >
          <span className="absolute -inset-1 rounded-md border border-blue-800 opacity-30 group-hover:opacity-60 pointer-events-none" />
          <span className="flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Unload
          </span>
        </button>
      </div>

      {modalType && (
        <BufferSelectionModal
          type={modalType}
          buffers={activeBufferList}
          onSelect={handleSelectBuffer}
          onClose={() => setModalType(null)}
        />
      )}
    </>
  );
}
