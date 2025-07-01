"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Header from "./Header";
import ContentsIndicator from "./ContentsIndicator";
import SetUsageButtons from "./SetUsageButtons";
import CapacityPanel from "./CapacityPanel";
import StatusPanel from "./StatusPanel";

interface Props {
  bufferKey: string;
  buffer: RawBuffer;
  usage: BufferUsage;
  quantity: number;
  setUsage: (u: BufferUsage) => void;
  setQuantity: (q: number) => void;
}

export default function BufferTool({
  bufferKey,
  buffer,
  usage,
  quantity,
  setUsage,
  setQuantity,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const bufferActivity: BufferActivity = null;

  return (
    <div className="w-full overflow-x-auto border-2 border-gray-700 rounded-2xl bg-gray-950/90 backdrop-blur-md font-mono text-white">
      <Header
        friendlyName={buffer.nameStr}
        bufferUsage={usage}
        bufferActivity={bufferActivity}
        expanded={expanded}
        toggleExpanded={() => setExpanded((prev) => !prev)}
      />

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="expandedPanel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col md:flex-row flex-wrap">
              {/* Left Panel */}
              <div className="flex flex-col w-full md:w-1/2 lg:w-1/3 xl:w-1/2 p-4 gap-4 bg-gray-900 border-r border-gray-800">
                <ContentsIndicator contents={buffer.contents} bufferUsage={usage} />
                <SetUsageButtons bufferUsage={usage} setUsage={setUsage} />
              </div>

              {/* Right Panel */}
              <div className="flex w-full h-full md:w-1/2 lg:w-2/3 xl:w-1/2 p-4 gap-4 bg-gray-900">
                <div className="flex flex-col w-full lg:w-1/2 gap-4 justify-between">
                  <CapacityPanel contents={buffer.contents} />
                </div>
                <div className="flex flex-col w-full lg:w-1/2 gap-4">
                  <StatusPanel
                    bufferActivity={bufferActivity}
                    bufferUsage={usage}
                    quantity={quantity}
                    setQuantity={setQuantity}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
