import { sectionStatus } from "./types";

interface Props {
  status: sectionStatus;
  lastUpdated: string;
}

export default function StatusPanel({ status, lastUpdated }: Props) {
  const isResettable = status === "complete" || status === "waiting";

  return (
    <div className="flex flex-col gap-4 w-1/2 justify-between">
      <div className="flex flex-col h-16 gap-1 border border-gray-700 rounded-md px-4 py-2 bg-gray-800">
        <div className="text-xs tracking-widest uppercase text-gray-400">Status</div>
        <div
          className={`text-lg font-bold lowercase ${
            status === "waiting"
              ? "text-gray-400"
              : status === "loading"
              ? "text-yellow-400"
              : status === "unloading"
              ? "text-blue-400"
              : "text-green-400"
          }`}
        >
          {status}
        </div>
      </div>

      {/* <div className="flex flex-col h-16 gap-1 border border-gray-700 rounded-md px-4 py-2 bg-gray-800">
        <div className="text-xs tracking-widest uppercase text-gray-400">Last Update</div>
        <div className="text-lg font-bold text-gray-300 uppercase">{lastUpdated}</div>
      </div> */}

      <button
        disabled={!isResettable}
        className={`flex items-center justify-center h-16 p-4 text-md font-bold uppercase tracking-widest border-2 rounded-md  border-gray-400 text-white cursor-pointer transition
          ${
            isResettable
              ? "animate-pulse bg-green-900 border-green-500"
              : "opacity-30 bg-transparent cursor-not-allowed pointer-events-none"
          }`}
      >
        Reset Section
      </button>
    </div>
  );
}
