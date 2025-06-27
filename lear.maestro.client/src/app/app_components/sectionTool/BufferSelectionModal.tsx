import React from "react";

interface BufferRef {
  bufferGroupKey: string;
  bufferGroupName: string;
}

interface BufferSelectionModalProps {
  type: "load" | "unload";
  buffers: BufferRef[];
  onSelect: (bufferKey: string) => void;
  onClose: () => void;
}

export default function BufferSelectionModal({
  type,
  buffers,
  onSelect,
  onClose,
}: BufferSelectionModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className="rounded-lg shadow-lg w-96 p-6 backdrop-blur-md border border-white/10"
        style={{ backgroundColor: "rgba(31, 41, 55, 0.8)" }}
      >
        <h2 className="text-lg font-bold mb-4 capitalize text-white">
          Select buffer to {type}
        </h2>

        {buffers.length === 0 ? (
          <div className="text-sm text-gray-400">No buffers available.</div>
        ) : (
          <ul className="max-h-60 overflow-y-auto space-y-2">
            {buffers.map((b) => (
              <li
                key={b.bufferGroupKey}
                onClick={() => onSelect(b.bufferGroupKey)}
                className="cursor-pointer px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-sm transition"
              >
                {b.bufferGroupName}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 w-full bg-red-600 hover:bg-red-700 text-sm font-bold text-white rounded-md transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
