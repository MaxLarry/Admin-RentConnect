import React, { useEffect, useState } from "react";
import { GoUnverified } from "react-icons/go";
import axios from "axios";
import { BsPeopleFill } from "react-icons/bs";
import { Card, CardContent } from "@/components/ui/card";

function ActiveUser() {
  const [userCount, setUserCount] = useState({
    LandlordCount: 0,
    OccupantCount: 0,
    UnverifiedCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      setLoading(true);

      try {
        const response = await axios.get("/data/user-count");
        if (response.data && response.data.length > 0) {
          // Access the first element of the array
          setUserCount(response.data[0]);
        } else {
          setUserCount({
            LandlordCount: 0,
            OccupantCount: 0,
            UnverifiedCount: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching the User Count:", error);
        setError("Failed to fetch User Count");
        setUserCount({
          LandlordCount: 0,
          OccupantCount: 0,
          UnverifiedCount: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  const totalUser = React.useMemo(() => {
    return (
      userCount.LandlordCount +
      userCount.OccupantCount +
      userCount.UnverifiedCount
    );
  }, [userCount]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Card className="px-10 py-5 rounded-md shadow-md block items-center col-start-1 md:col-end-3 lg:col-end-4 tracking-tighter noselect">
      <CardContent className="p-5">
        <div className="text-2xl font-bold text-zinc-900 dark:text-white">
          {totalUser}
        </div>
        <span className="text-xl font-medium text-gray-500 dark:text-gray-200">
          Active Users
        </span>
        <div className="flex justify-between mt-4">
          <div className="block">
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              {userCount.LandlordCount}
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
              {userCount.OccupantCount}
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
              {userCount.UnverifiedCount}
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
