import React from "react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import RentLogo from "../img/rentconff1.svg";
import RentLogoWhite from "../img/rentconff1_white.svg";

const Header = ({ toggleSidebar }) => {
  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-zinc-900 dark:border-gray-600">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              className="inline-flex items-center mx-2
text-sm text-gray-500 rounded-sm sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus: ring-gray-200
dark:text-gray-400 dark:hover:bg-gray-70 dark: focus:ring-sky-900"
              onClick={toggleSidebar}
            >
              <HiOutlineMenuAlt2 className="text-2xl" />
            </button>
            <a href="#" className="flex ms-2 md:me-24">
              <img
                alt="Rent-Connect"
                src={RentLogo}
                className="mx-auto h-9 w-auto dark:hidden"
              />
              <img
                alt="Rent-Connect"
                src={RentLogoWhite}
                className="mx-auto h-9 w-auto hidden dark:block"
              />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
