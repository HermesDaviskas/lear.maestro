export default function CapacityPanel({
  totalCapacity,
  usedCapacity,
  freeCapacity,
}: {
  totalCapacity: number;
  usedCapacity: number;
  freeCapacity: number;
}) {
  const items = [
    {
      label: "Total Capacity",
      value: totalCapacity,
      color: "text-cyan-400",
    },
    {
      label: "Used Capacity",
      value: usedCapacity,
      color: "text-red-400",
    },
    {
      label: "Free Capacity",
      value: freeCapacity,
      color: "text-green-400",
    },
  ];

  return (
    <div className="flex flex-col gap-4 justify-between">
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
