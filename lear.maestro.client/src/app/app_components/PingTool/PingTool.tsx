"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

type PingToolProps = {
  ip: string;
  title: string;
  onUpdate: (newIp: string) => Promise<void>;
  onDelete?: () => void;
};

export default function PingTool({ ip, title, onUpdate, onDelete }: PingToolProps) {
  const [newIP, setNewIP] = useState(ip);
  const [status, setStatus] = useState<"up" | "down" | "unknown">("unknown");
  const [flightTime, setFlightTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const pingIp = async (ipToPing: string) => {
    if (!ipToPing) return;

    setLoading(true);
    setStatus("unknown");
    setFlightTime(null);

    try {
      const response = await axios.get(`/api/pingTool?ip=${ipToPing}`);
      const data = response.data;
      if (data.isUp) {
        setStatus("up");
        setFlightTime(data.flightTimeMs ?? null);
      } else {
        setStatus("down");
        setFlightTime(null);
      }
    } catch {
      setStatus("down");
      setFlightTime(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    pingIp(ip);
  }, [ip]);

  useEffect(() => {
    setNewIP(ip);
  }, [ip]);

  return (
    <div className="max-w-md border-2 border-gray-700 rounded-xl">
      <div className="flex items-center justify-between pt-2 pb-2 pl-4 pr-4 bg-gray-900 rounded-t-xl">
        <div className="flex items-center gap-4">
          <StatusIndicator status={status} loading={loading} />
          <span>{title}</span>
          <span className="text-gray-400">{ip}</span>
          {flightTime != null && (
            <span className="text-sm text-green-600">{flightTime.toFixed(1)} ms</span>
          )}
        </div>

        <button
          onClick={onDelete}
          disabled={loading}
          className="text-red-600 hover:text-red-500 disabled:opacity-50 text-sm"
          title="Delete server"
        >
          Delete
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-b-xl">
        <input
          type="text"
          value={newIP}
          onChange={(e) => setNewIP(e.target.value.trim())}
          className="border border-gray-400 rounded px-1 h-8 w-40 text-center"
          placeholder="Enter IP address"
        />
        <button
          onClick={() => pingIp(newIP)}
          disabled={loading || !newIP}
          className="bg-blue-900 px-4 rounded hover:bg-blue-700 disabled:opacity-50 text-white h-8"
        >
          {loading ? "Checking..." : "Check"}
        </button>
        <button
          onClick={() => onUpdate(newIP)}
          disabled={loading || !newIP || newIP === ip}
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
    ? "Pinging..."
    : status === "up"
    ? "Up"
    : status === "down"
    ? "Down"
    : "Unknown";

  return (
    <span
      title={title}
      className={`inline-block w-4 h-4 rounded-full ${bgClass}`}
      aria-label={`Status: ${title}`}
    />
  );
}
