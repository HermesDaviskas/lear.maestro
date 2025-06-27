/*
 ** Component name: BufferTool
 ** File name: index.tsx
 */

"use client";

import { useState } from "react";
import { BufferGroupFlattened } from "@/app/types";
import Header from "./Header";
import ContentsIndicator from "./ContentsIndicator";
import CapacityPanel from "./CapacityPanel";
import SetUsageButtons from "./SetUsageButtons";
import StatusPanel from "./StatusPanel";
import { bufferStatus, usage } from "./types";
import { motion, AnimatePresence } from "framer-motion";

interface BufferToolProps {
  buffer: BufferGroupFlattened;
  usage: usage;
  setUsage: (usage: usage) => void;
}

export default function BufferTool({ buffer, usage, setUsage }: BufferToolProps) {
  const [status, setStatus] = useState<bufferStatus>("waiting");
  const [lastUpdated, setLastUpdated] = useState("–");
  const [expanded, setExpanded] = useState(true);
  const [quantity, setQuantity] = useState(0);

  const totalCapacity = buffer.contents.length;
  const usedCapacity = buffer.contents.reduce((sum, val) => sum + val, 0);
  const freeCapacity = totalCapacity - usedCapacity;

  return (
    <div className="w-full max-w-3xl overflow-x-auto border-2 border-gray-700 rounded-2xl bg-gray-950/90 backdrop-blur-md font-mono text-white">
      <Header
        bufferName={buffer.bufferGroupName}
        usage={usage}
        lastUpdated={lastUpdated}
        expanded={expanded}
        toggleExpanded={() => setExpanded(!expanded)}
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
              <div className="flex flex-col w-full md:w-1/2 xl:w-1/3 p-4 gap-4 bg-gray-900 border-r border-gray-800">
                <ContentsIndicator buffer={buffer} usage={usage} />
                <SetUsageButtons usage={usage} setUsage={setUsage} />
              </div>

              {/* Right Panel */}
              <div className="flex w-full md:w-1/2 xl:w-2/3 p-4 gap-4 bg-gray-900 text-white">
                <div className="flex flex-col w-full lg:w-1/2 gap-4">
                  <CapacityPanel
                    totalCapacity={totalCapacity}
                    usedCapacity={usedCapacity}
                    freeCapacity={freeCapacity}
                  />
                </div>
                <div className="flex flex-col w-full lg:w-1/2 gap-4">
                  <StatusPanel
                    usage={usage}
                    lastUpdated={lastUpdated}
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
