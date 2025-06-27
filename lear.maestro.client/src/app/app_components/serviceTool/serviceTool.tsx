"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

type ServiceToolProps = {
  name: string;
  server: string;
  port: number;
  username?: string;
  password?: string;
  healthUrl?: string;
  onDelete?: () => void;
  onUpdate: (updatedData: any) => void;
};

export default function ServiceTool({
  name,
  server,
  port,
  username,
  password,
  healthUrl,
  onDelete,
  onUpdate,
}: ServiceToolProps) {
  const [currentServer, setCurrentServer] = useState(server);
  const [currentPort, setCurrentPort] = useState(port.toString());
  const [currentHealthUrl, setCurrentHealthUrl] = useState(healthUrl ?? "");
  const [status, setStatus] = useState<"up" | "down" | "unknown">("unknown");
  const [loading, setLoading] = useState(false);
  const [serverOptions, setServerOptions] = useState<string[]>([]);
  const [serverMap, setServerMap] = useState<Record<string, { ip: string }>>({});

  const checkHealth = async () => {
    if (
      !currentHealthUrl ||
      !currentServer ||
      !currentPort ||
      !serverMap[currentServer]?.ip
    )
      return;

    const url = `http://${serverMap[currentServer].ip}:${currentPort}/${currentHealthUrl}`;
    setLoading(true);
    setStatus("unknown");

    try {
      const res = await axios.get(url);
      setStatus(res.status === 200 ? "up" : "down");
    } catch {
      setStatus("down");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const res = await axios.get(
          `/api/jsonHandler?file=/src/app/settings&key=servers`
        );
        const servers = res.data ?? {};
        setServerOptions(Object.keys(servers));
        setServerMap(servers);
      } catch (err) {
        console.error("Failed to load server options", err);
      }
    };
    fetchServers();
  }, []);

  useEffect(() => {
    if (Object.keys(serverMap).length > 0) {
      checkHealth();
    }
  }, [serverMap]);

  const handleUpdate = () => {
    onUpdate({
      server: currentServer,
      port: parseInt(currentPort),
      username,
      password,
      healthUrl: currentHealthUrl,
    });
    checkHealth();
  };

  return (
    <div className="max-w-md border-2 border-gray-700 rounded-xl">
      <div className="flex items-center justify-between pt-2 pb-2 pl-4 pr-4 bg-gray-900 rounded-t-xl">
        <div className="flex items-center gap-4">
          <StatusIndicator status={status} loading={loading} />
          <span>{name}</span>
          <span className="text-gray-400">
            {server} : {port}
          </span>
        </div>
        {onDelete && (
          <button
            onClick={onDelete}
            disabled={loading}
            className="text-red-600 hover:text-red-500 disabled:opacity-50 text-sm"
            title="Delete service"
          >
            Delete
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items sm:justify-between p-4 bg-gray-800 rounded-b-xl gap-4 flex-wrap">
        <section className="flex flex-col gap-2">
          <select
            value={currentServer}
            onChange={(e) => setCurrentServer(e.target.value)}
            className="border border-gray-400 rounded px-4 h-8 w-40 text-left bg-gray-800"
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
            className="border border-gray-400 rounded px-4 h-8 w-40 text-left"
            placeholder="Port"
          />
        </section>

        <button
          onClick={checkHealth}
          disabled={loading || !currentHealthUrl || !currentServer || !currentPort}
          className="bg-blue-900 px-4 rounded hover:bg-blue-700 disabled:opacity-50 text-white h-8"
        >
          {loading ? "Checking..." : "Check"}
        </button>
        <button
          onClick={handleUpdate}
          disabled={loading || (currentServer == server && parseInt(currentPort) == port)}
          className="bg-green-700 px-4 rounded hover:bg-green-600 disabled:opacity-50 text-white h-8"
        >
          Update
        </button>
      </div>
    </div>
  );
}

function StatusIndicator({
  status,
  loading,
}: {
  status: "up" | "down" | "unknown";
  loading: boolean;
}) {
  const bgClass = loading
    ? "bg-yellow-500 animate-pulse"
    : status === "up"
    ? "bg-green-500"
    : status === "down"
    ? "bg-red-500"
    : "bg-gray-300";

  const title = loading
    ? "Checking..."
    : status === "up"
    ? "Healthy"
    : status === "down"
    ? "Unhealthy"
    : "Unknown";

  return (
    <span
      title={title}
      className={`inline-block w-4 h-4 rounded-full ${bgClass}`}
      aria-label={`Status: ${title}`}
    />
  );
}
