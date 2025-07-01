interface Props {
  sectionActivity: SectionActivity;
}

export default function StatusPanel({ sectionActivity }: Props) {
  const isResettable = true;

  return (
    <div className="flex flex-col h-full gap-4 justify-between">
      <div className="flex flex-col h-16 gap-1 border border-gray-700 rounded-md px-4 py-2 bg-gray-800 justify-between">
        <div className="text-xs tracking-widest uppercase text-gray-400">Status</div>
        <div className="text-lg font-bold text-gray-400 lowercase">
          {sectionActivity ? sectionActivity : "No activity"}
        </div>
      </div>

      {/* <div className="flex flex-col h-16 gap-1 border border-gray-700 rounded-md px-4 py-2 bg-gray-800">
        <div className="text-xs tracking-widest uppercase text-gray-400">Last Update</div>
        <div className="text-lg font-bold text-gray-300 uppercase">{lastUpdated}</div>
      </div> */}

      <button
        disabled={!isResettable}
        className={`flex flex-col h-16 gap-1 border border-gray-700 rounded-md px-4 py-2 bg-gray-800 justify-center text-white cursor-pointer transition
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
