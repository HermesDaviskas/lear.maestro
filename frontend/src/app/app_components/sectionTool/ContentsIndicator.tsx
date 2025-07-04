interface Props {
  contents: SectionContents;
  length: SectionLength;
  positionCapacity: SectionPositionCapacity;
}

export default function ContentsIndicator({ contents, length, positionCapacity }: Props) {
  return (
    <div className="flex flex-col gap-1 h-full">
      {contents.map((value, rowIndex) => (
        <section
          key={rowIndex} // ✅ key belongs here
          className="flex w-full items-center justify-between border border-gray-700 rounded-md px-4 py-2 text-lg font-bold text-gray-400 lowercase"
        >
          {"<->"}
          <div className="flex flex-row-reverse gap-2">
            {calcStockPerPosition(value, positionCapacity, length).map(
              (posValue, posIndex) => (
                <div
                  key={posIndex}
                  className={`flex w-8 aspect-square rounded-md items-center justify-center font-bold text-xs border transition-all duration-150 cursor-pointer ${getIndicatorStyle(
                    posValue,
                    positionCapacity
                  )}`}
                >
                  {posValue > 0 ? posValue : null}
                </div>
              )
            )}
          </div>
        </section>
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

function getIndicatorStyle(posValue: number, maxPerPosition: number): string {
  if (posValue === 0) return "bg-gray-800 border-gray-600 text-transparent";
  if (posValue < maxPerPosition) return "bg-yellow-500 border-yellow-300 text-black";
  return "bg-green-600 border-green-400 text-black";
}
