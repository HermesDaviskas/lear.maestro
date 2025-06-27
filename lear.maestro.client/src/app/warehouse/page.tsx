// --- WarehousePage.tsx ---

"use client";

import { useWarehouseData } from "./useWarehouseData";
import BufferTool from "../app_components/bufferTool";
import SectionTool from "../app_components/sectionTool";

export default function WarehousePage() {
  const { buffers, sections, updateBufferUsage, loadBuffers, unloadBuffers } =
    useWarehouseData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 p-4 gap-8 w-full h-full">
      {/* Buffer Column */}
      <div className="flex flex-col gap-10 h-full">
        {buffers.map((buffer) => (
          <BufferTool
            key={buffer.bufferGroupKey}
            buffer={buffer}
            usage={buffer.usage}
            setUsage={(usage) => updateBufferUsage(buffer.bufferGroupKey, usage)}
          />
        ))}
      </div>

      {/* Section Column */}
      <div className="flex flex-col gap-10 h-full">
        {sections.map((section) => (
          <SectionTool
            key={section.sectionKey}
            section={section}
            loadBuffers={loadBuffers}
            unloadBuffers={unloadBuffers}
          />
        ))}
      </div>
    </div>
  );
}
