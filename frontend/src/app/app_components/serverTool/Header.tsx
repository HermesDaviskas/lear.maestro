import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import HealthIndicator from "./HealthIndicator";

interface Props {
  serverStatus: "up" | "down" | "unknown";
  serverName: string;
  serverIP: string;
  serverReplyTime: number | null;
  loading: boolean;
  expanded: boolean;
  toggleExpanded: () => void;
}

export default function Header({
  serverStatus,
  serverName,
  serverIP,
  serverReplyTime,
  loading,
  expanded,
  toggleExpanded,
}: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
      <section className="flex gap-4 items-center">
        <HealthIndicator status={serverStatus} loading={loading} />
        <span className="text-sm font-bold tracking-widest text-cyan-400 uppercase">
          {serverName}
        </span>
        <span className="text-xs tracking-widest uppercase text-gray-400">
          {serverIP}
        </span>
        {serverReplyTime !== null && (
          <span className="flex items-center text-xs tracking-widest lowercase text-green-400">
            {serverReplyTime} ms
          </span>
        )}
      </section>

      <button
        onClick={toggleExpanded}
        className="text-gray-500 hover:text-cyan-400 transition"
        title="Toggle view"
      >
        {expanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
