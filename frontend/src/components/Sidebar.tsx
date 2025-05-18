// src/components/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  return (
    <aside className="bg-secondary text-white w-64 min-h-screen p-4">
      <nav className="flex flex-col space-y-2">
        <Link href="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link href="/dashboard/vehicles" className="hover:underline">
          Vehicles
        </Link>
        <Link href="/dashboard/reports" className="hover:underline">
          Reports
        </Link>
        {/* Add more links as needed */}
      </nav>
    </aside>
  );
};

export default Sidebar;
