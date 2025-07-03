"use client";

interface Props {
  currentServer: string;
  currentServerIP: string;
  setCurrentServerIP: (ip: string) => void;
}

export default function ServerSettings({
  currentServer,
  currentServerIP,
  setCurrentServerIP,
}: Props) {
  return (
    <section className="flex flex-col gap-4 w-full">
      <input
        type="text"
        value={currentServer}
        className="w-full h-9 px-4 bg-gray-900 text-gray-500 border border-gray-600 rounded-md"
        placeholder="Server name"
        title="Server name is fixed"
      />

      <input
        type="text"
        value={currentServerIP}
        onChange={(e) => setCurrentServerIP(e.target.value)}
        className="w-full h-9 px-4 bg-gray-800 text-white border border-gray-500 rounded-md"
        placeholder="Server IP"
      />
    </section>
  );
}
