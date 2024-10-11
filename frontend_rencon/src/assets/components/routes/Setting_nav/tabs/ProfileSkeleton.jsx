import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

function ProfileSkeleton() {
  return (
    <div className="block pb-5 translate-all duration-300">
      <div className="flex justify-between items-center p-4">
        <div>
          <Skeleton className="w-32 h-9 mb-2" />
          <Skeleton className="w-52 h-5" />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 py-4">
        <div className="w-full lg:w-1/4 p-4 rounded-md flex flex-col items-center">
          {/* Profile Picture Skeleton */}
          <Skeleton className="w-36 h-36 rounded-full mb-4" />

          {/* Profile Picture Actions */}
          <Skeleton className="w-32 h-5 mb-2" />
          <Skeleton className="w-24 h-5" />
        </div>

        {/* Form Skeleton */}
        <div className="w-full lg:w-2/3 p-4 rounded-md space-y-4">
          <div className="flex space-x-4">
            {/* First Name & Last Name Skeleton */}
            <div className="flex-1">
              <Skeleton className="w-24 h-5 mb-3" />
              <Skeleton className=" h-10" />
            </div>
            <div className="flex-1">
              <Skeleton className="w-24 h-5 mb-3" />
              <Skeleton className=" h-10" />
            </div>
          </div>
          <div className="flex space-x-4 py-4">
            {/* Email & Phone Number Skeleton */}
            <div className="flex-1">
              <Skeleton className="w-24 h-5 mb-3" />
              <Skeleton className=" h-10" />
            </div>
            <div className="flex-1">
              <Skeleton className="w-24 h-5 mb-3" />
              <Skeleton className=" h-10" />
            </div>
          </div>
          {/* Button Skeleton */}
          <Skeleton className="w-24 h-10 ml-auto" />
        </div>
      </div>
    </div>
  );
}

export default ProfileSkeleton;
