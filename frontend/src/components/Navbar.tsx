// src/components/Navbar.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="bg-primary text-white px-4 py-3 flex justify-between items-center">
      <div className="text-lg font-semibold">PVMS</div>
      <div>
        <Button variant="ghost" className="text-white">
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
