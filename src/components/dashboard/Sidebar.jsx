"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <aside className="h-full w-60 bg-white/80 border-r border-[#EDE6DF] backdrop-blur-md shadow-sm p-4 flex flex-col">
      
      {/* Logo */}
      <div className="text-2xl font-semibold text-[#6C5F57] mb-8">
        MyFeed
      </div>

      {/* Menu List */}
      <nav className="flex flex-col gap-2">
        {menu.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
                ${
                  active
                    ? "bg-[#6C5F57] text-white shadow"
                    : "text-[#6C5F57] hover:bg-[#EDE6DF]"
                }
              `}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      {/* Footer */}
      <div className="text-xs text-[#9A8F88]">
        © {new Date().getFullYear()} MyFeed
      </div>
    </aside>
  );
}
