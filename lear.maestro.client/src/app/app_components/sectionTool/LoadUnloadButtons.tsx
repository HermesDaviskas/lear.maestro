import { useState } from "react";
import { Upload, Download } from "lucide-react";
import BufferSelectionModal from "./BufferSelectionModal";

interface Props {
  loadBuffers: BufferRef[];
  unloadBuffers: BufferRef[];
  onSelect: (bufferKey: string, type: "load" | "unload") => void;
}

export default function LoadUnloadButtons({
  loadBuffers,
  unloadBuffers,
  onSelect,
}: Props) {
  const [modalType, setModalType] = useState<"load" | "unload" | null>(null);

  const canLoad = loadBuffers.length > 0;
  const canUnload = unloadBuffers.length > 0;

  const handleOpenModal = (type: "load" | "unload") => {
    if ((type === "load" && canLoad) || (type === "unload" && canUnload)) {
      setModalType(type);
    }
  };

  const handleSelectBuffer = (selectedKey: string) => {
    if (modalType) {
      onSelect(selectedKey, modalType);
    }
    setModalType(null);
  };

  const activeBufferList = modalType === "load" ? loadBuffers : unloadBuffers;

  const baseStyle =
    "w-full py-2 rounded-md border text-sm tracking-wide uppercase font-semibold transition-all duration-200 active:scale-95 cursor-pointer";

  const getButtonStyle = (enabled: boolean, color: "yellow" | "blue") => {
    if (!enabled) {
      return "text-gray-500 border-gray-700 cursor-not-allowed opacity-50";
    }

    const colorMap = {
      yellow:
        "text-yellow-400 border-yellow-600 hover:bg-yellow-900 focus:ring-yellow-400",
      blue: "text-blue-400 border-blue-600 hover:bg-blue-900 focus:ring-blue-400",
    };

    return colorMap[color];
  };

  return (
    <>
      <div className="flex h-10 w-full gap-4 justify-between">
        {/* Load Button */}
        <button
          onClick={() => handleOpenModal("load")}
          disabled={!canLoad}
          className={`${baseStyle} ${getButtonStyle(canLoad, "yellow")}`}
        >
          <span className="flex items-center justify-center gap-2">
            <Upload className="w-4 h-4 inline lg:hidden xl:inline" />
            Load
          </span>
        </button>

        {/* Unload Button */}
        <button
          onClick={() => handleOpenModal("unload")}
          disabled={!canUnload}
          className={`${baseStyle} ${getButtonStyle(canUnload, "blue")}`}
        >
          <span className="flex items-center justify-center gap-2">
            <Download className="w-4 h-4 inline lg:hidden xl:inline" />
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
