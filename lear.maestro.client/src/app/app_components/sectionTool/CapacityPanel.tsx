import { SectionFlattened } from "@/app/types";

export default function CapacityPanel({ section }: { section: SectionFlattened }) {
  const items = [
    {
      label: "Total Capacity",
      value: section.totalCapacity,
      color: "text-cyan-400",
    },
    {
      label: "Used Capacity",
      value: section.stockedCapacity,
      color: "text-red-400",
    },
    {
      label: "Free Capacity",
      value: section.freeCapacity,
      color: "text-green-400",
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-1/2 justify-between">
      {items.map(({ label, value, color }, i) => (
        <div
          key={i}
          className="flex flex-col h-16 gap-1 border border-gray-700 rounded-md px-4 py-2 bg-gray-800"
        >
          <div className="text-xs tracking-widest uppercase text-gray-400">{label}</div>
          <div className={`text-lg font-bold ${color}`}>{value}</div>
        </div>
      ))}
    </div>
  );
}
