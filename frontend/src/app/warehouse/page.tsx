"use client";

import { useWarehouseData } from "./useWarehouseData";
import BufferTool from "../app_components/bufferTool";
import SectionTool from "../app_components/sectionTool";

export default function WarehousePage() {
  const {
    data,
    bufferStates,
    loadBuffers,
    unloadBuffers,
    setBufferUsage,
    setBufferQuantity,
    getBufferQuantity,
  } = useWarehouseData();

  if (!data || Object.keys(bufferStates).length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 p-4 gap-8 w-full h-full">
      {/* Buffers */}
      <div className="flex flex-col gap-10 h-full">
        {data.buffers.map((entry) => {
          const [key, buffer]: [string, RawBuffer] = Object.entries(entry)[0];
          const state = bufferStates[key];
          if (!state) return null;

          return (
            <BufferTool
              key={key}
              bufferKey={key}
              buffer={buffer}
              usage={state.usage}
              quantity={state.quantity}
              setUsage={(usage) => setBufferUsage(key, usage)}
              setQuantity={(quantity) => setBufferQuantity(key, quantity)}
            />
          );
        })}
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-10 h-full">
        {data.outerSections.map((entry) => {
          const [key, section]: [string, RawSection] = Object.entries(entry)[0];

          return (
            <SectionTool
              key={key}
              sectionKey={key}
              section={section}
              loadBuffers={loadBuffers}
              unloadBuffers={unloadBuffers}
              getBufferQuantity={getBufferQuantity}
            />
          );
        })}
      </div>
    </div>
  );
}
