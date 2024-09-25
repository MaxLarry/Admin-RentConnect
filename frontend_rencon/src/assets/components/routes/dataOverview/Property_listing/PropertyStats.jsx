import * as React from "react";
import UserCount from "./PropertyListedCount";
import PropertylistingStatus from "./PropertylistingStatus"
import PropertyCountBarangay from "./PropertyCountBarangay";
import PropertyListedCount from "./PropertyListedCount";
import ListedPropertyRemove from "./ListedProperty-Delete-stack";
import AveragePrice from "./AveragePrice";

function UserStats() {
  return (
    <>
      <div className="flex justify-between items-center px-5 mt-10">
        <h1 className="font-bold text-xl pb-5">Property Listing</h1>
      </div>
      <div className="grid p-4 gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-9 grid-rows-subgrid max-w-full mx-auto">
        <PropertyListedCount />
        <PropertylistingStatus/>
        <ListedPropertyRemove/>
        <AveragePrice/>
        <PropertyCountBarangay/>
        
      </div>
    </>
  );
}

export default UserStats;
