import Link from "next/link";
import React from "react";
import RightSidebar from "./RightSidebar";

const Navbar = () => {
  return (
    <nav className="p-3 glass">
      <Link
        href={"/"}
        className="text-xl md:text-2xl h-16 font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-500"
      >
        TubeGrab Pro
      </Link>
    </nav>
  );
};

export default Navbar;
