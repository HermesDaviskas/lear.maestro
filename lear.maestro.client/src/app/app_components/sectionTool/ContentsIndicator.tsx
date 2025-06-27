import { SectionFlattened } from "@/app/types";

export default function ContentsIndicator({ section }: { section: SectionFlattened }) {
  return (
    <div className="flex flex-col gap-1 p-4 bg-gray-900/80 backdrop-blur-sm text-white rounded-l-2xl">
      {section.contents.map((value, rowIndex) => (
        <div
          key={rowIndex}
          className="flex flex-row-reverse gap-2 items-center justify-around p-2 border border-gray-700 rounded"
        >
          {calcStockPerPosition(
            value,
            section.positionMaxCapacity,
            section.rowLength
          ).map((posValue, posIndex) => (
            <div
              key={posIndex}
              className={`flex w-7 h-7 rounded-md items-center justify-center font-bold text-xs border transition-all duration-150 cursor-pointer ${
                posValue === 0
                  ? "bg-gray-800 border-gray-600 text-transparent"
                  : posValue < section.positionMaxCapacity
                  ? "bg-yellow-500 border-yellow-300 text-black"
                  : "bg-green-600 border-green-400 text-black"
              }`}
            >
              {posValue > 0 ? posValue : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function calcStockPerPosition(
  stock: number,
  maxPerPosition: number,
  rowLength: number
): number[] {
  const result: number[] = [];
  for (let i = 0; i < rowLength; i++) {
    const val = Math.min(stock, maxPerPosition);
    result.push(val);
    stock -= val;
  }
  return result;
}
