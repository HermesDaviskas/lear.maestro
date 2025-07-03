import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import HealthIndicator from "./HealthIndicator";

interface Props {
  serviceStatus: "up" | "down" | "unknown";
  serviceName: string;
  server: string;
  servicePort: number;
  loading: boolean;
  expanded: boolean;
  toggleExpanded: () => void;
}

export default function Header({
  serviceStatus,
  serviceName,
  server,
  servicePort,
  loading,
  expanded,
  toggleExpanded,
}: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
      <section className="flex w-full gap-4 items-center">
        <HealthIndicator status={serviceStatus} loading={loading} />
        <span className="text-sm font-bold tracking-widest text-cyan-400 uppercase">
          {serviceName}
        </span>
        <span className="flex items-center text-xs tracking-widest uppercase text-gray-400">
          {server} : {servicePort}
        </span>
      </section>
      <button
        onClick={toggleExpanded}
        className="text-gray-500 hover:text-cyan-400 transition cursor-pointer"
        title="Toggle View"
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
