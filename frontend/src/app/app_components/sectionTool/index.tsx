"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Header from "./Header";
import ContentsIndicator from "./ContentsIndicator";
import LoadUnloadButtons from "./LoadUnloadButtons";
import CapacityPanel from "./CapacityPanel";
import StatusPanel from "./StatusPanel";

interface Props {
  sectionKey: string;
  section: RawSection;
  loadBuffers: BufferRef[];
  unloadBuffers: BufferRef[];
  getBufferQuantity: (bufferKey: string) => number;
  // submitMission: (mission: {
  //   missionType: "batch";
  //   from: string;
  //   to: string;
  //   quantity: number;
  // }) => void;
}

export default function SectionTool({
  sectionKey,
  section,
  loadBuffers,
  unloadBuffers,
  getBufferQuantity,
}: // submitMission,
Props) {
  const [expanded, setExpanded] = useState(true);

  const rowCount = section.contents.length;
  const colCount = section.length;
  const positionCapacity = section.positionCapacity;

  const [usedCapacity, setUsedCapacity] = useState(() =>
    section.contents.reduce((sum, val) => sum + val, 0)
  );

  useEffect(() => {
    const total = section.contents.reduce((sum, val) => sum + val, 0);
    setUsedCapacity(total);
  }, [section.contents]);

  const sectionActivity: SectionActivity = null;

  const syntheticContents = generateSyntheticContents(
    usedCapacity,
    rowCount,
    colCount,
    positionCapacity
  );

  return (
    <div className="w-full overflow-x-auto border-2 border-gray-700 rounded-2xl bg-gray-950/90 backdrop-blur-md font-mono text-white">
      <Header
        friendlyName={section.nameStr}
        sectionActivity={sectionActivity}
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
                <ContentsIndicator
                  contents={syntheticContents}
                  length={colCount}
                  positionCapacity={positionCapacity}
                />
                <LoadUnloadButtons
                  loadBuffers={loadBuffers}
                  unloadBuffers={unloadBuffers}
                  onSelect={(bufferKey, type) => {
                    const quantity =
                      type === "unload" ? usedCapacity : getBufferQuantity(bufferKey);

                    console.log(
                      `${sectionKey} is ${type}ing ${quantity} pcs using ${bufferKey}`
                    );

                    // submitMission({
                    //   missionType: "batch",
                    //   from: type === "load" ? bufferKey : sectionKey,
                    //   to: type === "load" ? sectionKey : bufferKey,
                    //   quantity,
                    // });
                  }}
                />
              </div>

              {/* Right Panel */}
              <div className="flex w-full md:w-1/2 lg:w-1/3 xl:w-1/2 p-4 gap-4 bg-gray-900 border-r border-gray-800">
                <div className="flex flex-col w-full lg:w-1/2 gap-4 justify-between">
                  <CapacityPanel
                    contents={section.contents}
                    length={colCount}
                    positionCapacity={positionCapacity}
                    usedCapacity={usedCapacity}
                    setUsedCapacity={setUsedCapacity}
                  />
                </div>
                <div className="flex flex-col w-full lg:w-1/2 gap-4">
                  <StatusPanel sectionActivity={sectionActivity} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function generateSyntheticContents(
  totalUsed: number,
  rowCount: number,
  colCount: number,
  positionCapacity: number
): number[] {
  const matrix: number[][] = Array.from({ length: rowCount }, () =>
    Array(colCount).fill(0)
  );

  outer: for (let col = 0; col < colCount; col++) {
    for (let row = 0; row < rowCount; row++) {
      for (let fill = 0; fill < positionCapacity; fill++) {
        if (totalUsed <= 0) break outer;
        if (matrix[row][col] < positionCapacity) {
          matrix[row][col]++;
          totalUsed--;
        }
      }
    }
  }

  return matrix.map((row) => row.reduce((sum, val) => sum + val, 0));
}
