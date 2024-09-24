import React from "react";
import { GoUnverified } from "react-icons/go";
import { BsPeopleFill } from "react-icons/bs";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

function ActiveUser() {
  return (
    <Card className="  px-10 py-5 rounded-md shadow-md block items-center col-start-1 md:col-end-3 lg:col-end-4 tracking-tighter noselect">
      <CardContent className="p-5">
        <div className="text-2xl font-bold text-zinc-900 dark:text-white">
          120
        </div>
        <span className="text-xl font-medium text-gray-500  dark:text-gray-200">
          Active User
        </span>
        <div className="flex justify-between mt-4">
          <div className="block">
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              90
            </div>
            <div className="flex justify-center items-center space-x-2">
              <BsPeopleFill className="text-lg" />
              <span className="text-lg font-medium text-gray-500 dark:text-gray-200">
                Landlords
              </span>
            </div>
          </div>
          <div className="block">
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              12
            </div>
            <div className="flex justify-center items-center space-x-2">
              <BsPeopleFill className="text-lg" />
              <span className="text-lg font-medium text-gray-500 dark:text-gray-200">
                Occupants
              </span>
            </div>
          </div>
          <div className="block">
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              18
            </div>
            <div className="flex justify-center items-center space-x-2">
              <GoUnverified className="text-lg" />
              <span className="text-lg font-medium text-gray-500 dark:text-gray-200">
                Unverified
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ActiveUser;
