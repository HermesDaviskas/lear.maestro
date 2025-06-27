"use client";

import { useState } from "react";
import { SectionFlattened } from "@/app/types";
import Header from "./Header";
import ContentsIndicator from "./ContentsIndicator";
import LoadUnloadButtons from "./LoadUnloadButtons";
import CapacityPanel from "./CapacityPanel";
import StatusPanel from "./StatusPanel";
import { sectionStatus } from "./types";

interface BufferRef {
  bufferGroupKey: string;
  bufferGroupName: string;
}

interface SectionToolProps {
  section: SectionFlattened;
  loadBuffers: BufferRef[];
  unloadBuffers: BufferRef[];
}

export default function SectionTool({
  section,
  loadBuffers,
  unloadBuffers,
}: SectionToolProps) {
  const [status, setStatus] = useState<sectionStatus>("waiting");
  const [lastUpdated, setLastUpdated] = useState("–");
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="w-full max-w-3xl border-2 border-gray-700 rounded-2xl font-mono text-white overflow-hidden">
      <Header
        sectionName={section.sectionName}
        status={status}
        lastUpdated={lastUpdated}
        expanded={expanded}
        toggleExpanded={() => setExpanded(!expanded)}
      />
      {expanded && (
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col p-4 gap-4 bg-gray-900 border-r border-gray-800 justify-between">
            <ContentsIndicator section={section} />
            <LoadUnloadButtons loadBuffers={loadBuffers} unloadBuffers={unloadBuffers} />
          </div>
          <div className="flex w-full gap-4 p-4 bg-gray-900 text-white justify-between">
            <CapacityPanel section={section} />
            <StatusPanel status={status} lastUpdated={lastUpdated} />
          </div>
        </div>
      )}
    </div>
  );
}
