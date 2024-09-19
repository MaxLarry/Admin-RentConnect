import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { HiLogout } from "react-icons/hi";
import { TiUser } from "react-icons/ti";
import { FiChevronDown } from "react-icons/fi";
import useAuth from "../auth/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 py-1 px-3  hover:text-gray-700  dark:hover:text-white focus:outline-none">
          <Avatar>
          {user?.profilePicture ? (
              <AvatarImage src={user.profilePicture} alt="admin_photo" />
            ) : (
              <AvatarFallback>
                <FaUserCircle />
              </AvatarFallback>
            )}
          </Avatar>
          <span className=" flex-1 tracking-s font-medium text-sm">
          {user?.name || "Guest" }{/*this approach will make sure that help the frontent to load and prevent error*/}
          </span>
          <FiChevronDown className="text-xl" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <TiUser className="mr-2" />
          My Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MdManageAccounts className="mr-2" />
          Account Setting
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-500"
          onSelect={logout}
        >
          <HiLogout className="mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
