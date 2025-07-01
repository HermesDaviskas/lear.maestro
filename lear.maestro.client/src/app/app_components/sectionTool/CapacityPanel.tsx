import { Plus, Minus } from "lucide-react";

interface Props {
  contents: number[];
  length: number;
  positionCapacity: number;
  usedCapacity: number;
  setUsedCapacity: (value: number) => void;
}

export default function CapacityPanel({
  contents,
  length,
  positionCapacity,
  usedCapacity,
  setUsedCapacity,
}: Props) {
  const totalCapacity = contents.length * length * positionCapacity;
  const freeCapacity = totalCapacity - usedCapacity;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 0 && val <= totalCapacity) {
      setUsedCapacity(val);
    }
  };

  const increase = () => {
    if (usedCapacity < totalCapacity) {
      setUsedCapacity(usedCapacity + 1);
    }
  };

  const decrease = () => {
    if (usedCapacity > 0) {
      setUsedCapacity(usedCapacity - 1);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 justify-between">
      {/* Total Capacity */}
      <div className="flex flex-col h-16 gap-1 border border-gray-700 rounded-md px-4 py-2 bg-gray-800 justify-between">
        <div className="text-xs tracking-widest uppercase text-gray-400">
          Total Capacity
        </div>
        <div className="text-lg font-bold text-cyan-400">{totalCapacity}</div>
      </div>

      {/* Used Capacity (Editable) */}
      <div className="flex flex-col h-16 gap-1 border border-gray-700 rounded-md px-4 py-2 bg-gray-800 justify-between">
        <div className="text-xs tracking-widest uppercase text-gray-400">
          Used Capacity
        </div>
        <div className="flex text-lg font-bold text-gray-400 lowercase">
          <input
            min={0}
            max={totalCapacity}
            value={usedCapacity}
            onChange={handleInputChange}
            className="w-18 h-6 text-center bg-gray-700 text-sm rounded-md px-2 text-white border-gray-400"
          />
          <div className="flex w-full px-1 gap-2 items-center justify-between">
            <Minus className="w-6 h-6 text-red-400 cursor-pointer" onClick={decrease} />
            <Plus className="w-6 h-6 text-green-400 cursor-pointer" onClick={increase} />
          </div>
        </div>
      </div>

      {/* Free Capacity */}
      <div className="flex flex-col h-16 gap-1 border border-gray-700 rounded-md px-4 py-2 bg-gray-800 justify-between">
        <div className="text-xs tracking-widest uppercase text-gray-400">
          Free Capacity
        </div>
        <div className="text-lg font-bold text-green-400">{freeCapacity}</div>
      </div>
    </div>
  );
}
