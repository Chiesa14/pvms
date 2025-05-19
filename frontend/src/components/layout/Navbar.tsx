"use client";

import { FiBell, FiUser, FiMenu } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { cn } from "@/lib/utils";

const getTitleFromPath = (path: string) => {
  const parts = path.split("/");
  return (
    parts[parts.length - 1].charAt(0).toUpperCase() +
    parts[parts.length - 1].slice(1)
  );
};

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const title = getTitleFromPath(pathname);

  return (
    <header className="w-full bg-white px-4 lg:px-6 py-4 shadow-sm flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FiMenu className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg lg:text-xl font-semibold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <button className="text-gray-600 hover:text-gray-900 transition-colors">
          <FiBell className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>

        <div className="flex items-center gap-2">
          {user?.profileImage ? (
            <Image
              src={user.profileImage}
              alt="Profile"
              width={36}
              height={36}
              className="rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="p-2 bg-gray-100 rounded-full">
              <FiUser className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
