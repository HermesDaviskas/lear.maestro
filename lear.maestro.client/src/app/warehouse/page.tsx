"use client";

import { useState } from "react";
import BufferTool from "../app_components/bufferTool";
import SectionTool from "../app_components/sectionTool";
import { useWarehouseData } from "./useWarehouseData";

interface BufferState {
  usage: BufferUsage;
  quantity: number;
}

export default function WarehousePage() {
  const { data, loading, error } = useWarehouseData();
  const [bufferStates, setBufferStates] = useState<Record<string, BufferState>>({});

  // Initialize bufferStates once data is loaded
  if (data && Object.keys(bufferStates).length === 0) {
    const initialStates: Record<string, BufferState> = {};
    data.buffers.forEach((entry) => {
      const [key, value] = Object.entries(entry)[0];
      initialStates[key] = { usage: value.usage, quantity: 0 };
    });
    setBufferStates(initialStates);
  }

  const loadBuffers = Object.entries(bufferStates)
    .filter(([, s]) => s.usage === "load")
    .map(([key]) => ({
      bufferGroupKey: key,
      bufferGroupName:
        data?.buffers.find((b) => Object.keys(b)[0] === key)?.[key].nameStr || key,
    }));

  const unloadBuffers = Object.entries(bufferStates)
    .filter(([, s]) => s.usage === "unload")
    .map(([key]) => ({
      bufferGroupKey: key,
      bufferGroupName:
        data?.buffers.find((b) => Object.keys(b)[0] === key)?.[key].nameStr || key,
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 p-4 gap-8 w-full h-full">
      {/* Buffers */}
      <div className="flex flex-col gap-10 h-full">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {data?.buffers.map((entry) => {
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
              setUsage={(newUsage) =>
                setBufferStates((prev) => ({
                  ...prev,
                  [key]: { ...prev[key], usage: newUsage },
                }))
              }
              setQuantity={(newQuantity) =>
                setBufferStates((prev) => ({
                  ...prev,
                  [key]: { ...prev[key], quantity: newQuantity },
                }))
              }
            />
          );
        })}
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-10 h-full">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {data?.outerSections.map((entry) => {
          const [key, section]: [string, RawSection] = Object.entries(entry)[0];

          return (
            <SectionTool
              key={key}
              sectionKey={key}
              section={section}
              loadBuffers={loadBuffers}
              unloadBuffers={unloadBuffers}
              getBufferQuantity={(bufferKey) => bufferStates[bufferKey]?.quantity ?? 0}
            />
          );
        })}
      </div>
    </div>
  );
}
