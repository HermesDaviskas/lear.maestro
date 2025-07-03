"use client";

interface Props {
  serverOptions: string[];
  currentServer: string;
  setCurrentServer: (s: string) => void;
  currentPort: string;
  setCurrentPort: (p: string) => void;
}

export default function AddressSettings({
  serverOptions,
  currentServer,
  setCurrentServer,
  currentPort,
  setCurrentPort,
}: Props) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <select
        value={currentServer}
        onChange={(e) => setCurrentServer(e.target.value)}
        className="w-full h-9 px-4 bg-gray-800 text-gray-400 rounded-md border border-gray-400"
      >
        <option value="">Select server</option>
        {serverOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={currentPort}
        onChange={(e) => setCurrentPort(e.target.value)}
        className="w-full h-9 px-4 bg-gray-800 text-gray-400 rounded-md border border-gray-400"
        placeholder="Port"
      />
    </div>
  );
}
