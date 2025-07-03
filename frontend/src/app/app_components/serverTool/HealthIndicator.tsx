interface Props {
  status: "up" | "down" | "unknown";
  loading: boolean;
}

export default function HealthIndicator({ status, loading }: Props) {
  let bgColor = "bg-gray-300";
  let label = "Unknown";

  if (loading) {
    bgColor = "bg-yellow-500 animate-pulse";
    label = "Checking...";
  } else if (status === "up") {
    bgColor = "bg-green-500";
    label = "Healthy";
  } else if (status === "down") {
    bgColor = "bg-red-500";
    label = "Unhealthy";
  }

  return (
    <span
      title={label}
      aria-label={`Status: ${label}`}
      className={`inline-block w-4 h-4 rounded-full ${bgColor}`}
    />
  );
}
