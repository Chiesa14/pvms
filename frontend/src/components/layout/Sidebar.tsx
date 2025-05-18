"use client";
import React, { useState } from "react";
import {
  FiHome,
  FiTruck,
  FiCalendar,
  FiBell,
  FiMenu,
  FiUser,
} from "react-icons/fi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    icon: FiHome,
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: FiTruck,
    title: "Vehicles",
    href: "/vehicles",
  },
  {
    icon: FiCalendar,
    title: "Reservations",
    href: "/reservations",
  },
  {
    icon: FiBell,
    title: "Notifications",
    href: "/notifications",
  },
  {
    icon: FiUser,
    title: "Profile",
    href: "/profile",
  },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "relative z-10 transition-all duration-300 ease-in-out flex-shrink-0",
        isSidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="h-full bg-white backdrop-blur-md p-4 flex flex-col border-r border-gray-200">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors max-w-fit cursor-pointer text-gray-600"
        >
          <FiMenu size={24} />
        </button>

        <nav className="mt-8 flex-grow space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.title} href={item.href}>
                <div
                  className={cn(
                    "flex items-center p-3 my-4 text-sm font-medium rounded-lg",
                    "hover:bg-gray-100 transition-colors text-gray-700",
                    isActive && "bg-gray-100 font-medium"
                  )}
                >
                  <Icon
                    size={20}
                    className={cn(
                      "flex-shrink-0 text-gray-500",
                      isActive && "text-gray-900"
                    )}
                  />
                  {isSidebarOpen && (
                    <span className="ml-3 whitespace-nowrap">{item.title}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
