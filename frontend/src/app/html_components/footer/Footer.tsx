"use client";

import { useRouter } from "next/navigation";
import { Settings, Info, HelpCircle } from "lucide-react";

type Button = {
  label: string;
  path: string; // changed from onClick to path string
};

type FooterProps = {
  title?: string;
  subtitle?: string;
  buttons?: Button[];
};

const defaultButtons: Button[] = [
  { label: "Settings", path: "/settings" },
  { label: "Help", path: "/help" },
  { label: "About", path: "/about" },
];

export default function Footer({
  title,
  subtitle,
  buttons = defaultButtons,
}: FooterProps) {
  const router = useRouter();

  const title_html = <span className="text-sm font-mono text-gray-400">{title}</span>;
  const subtitle_html = <div className="text-xs text-gray-500">{subtitle}</div>;

  // Pass router to renderButtons so buttons can navigate
  const buttons_html = <div className="flex gap-2">{renderButtons(buttons, router)}</div>;

  return (
    <footer className="bg-gray-900 text-white flex justify-between items-center fixed bottom-0 w-full px-4 py-2 z-50 h-14">
      <div className="text-center sm:text-left">
        {title && title_html}
        {subtitle && subtitle_html}
      </div>
      {buttons.length > 0 && buttons_html}
    </footer>
  );
}

function renderButtons(buttons: Button[], router: ReturnType<typeof useRouter>) {
  const iconMap: Record<string, React.ReactNode> = {
    Settings: <Settings className="w-4 h-4" />,
    About: <Info className="w-4 h-4" />,
    Help: <HelpCircle className="w-4 h-4" />,
  };

  return buttons.map((btn, index) => (
    <button
      key={index}
      onClick={() => router.push(btn.path)}
      className="bg-gray-700 hover:bg-gray-600 text-white text-sm w-25 px-2 py-1 rounded flex items-center justify-center gap-2"
    >
      {iconMap[btn.label] || null}
      {btn.label}
    </button>
  ));
}
