"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, Settings, User } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
  { label: "Warehouse", href: "/warehouse", icon: <Layers className="w-4 h-4" /> },
  { label: "Vehicles", href: "/vehicles", icon: <Layers className="w-4 h-4" /> },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 text-white sticky top-18 z-50 px-4 py-2 h-11">
      <div className="flex gap-4">{renderNavButtons(navItems, pathname)}</div>
    </nav>
  );
}

function renderNavButtons(items: NavItem[], pathname: string) {
  return items.map((item) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-2 text-sm px-3 py-1 rounded transition ${
          isActive ? "bg-gray-700" : "hover:bg-gray-700"
        }`}
      >
        {item.icon}
        <span>{item.label}</span>
      </Link>
    );
  });
}
