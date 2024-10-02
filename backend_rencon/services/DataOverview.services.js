const { UserAccount } = require("../models/User.model");

const getAllUserCount = async () => {
  try {
    const result = await UserAccount.aggregate([
      {
        $facet: {
          LandlordCount: [
            { $match: { role: "landlord", isProfileComplete: true } },
            { $count: "count" },
          ],
          OccupantCount: [
            { $match: { role: "occupant", isProfileComplete: true } },
            { $count: "count" },
          ],
          UnverifiedCount: [
            { $match: { isProfileComplete: false } },
            { $count: "count" },
          ],
        },
      },
      {
        $project: {
          LandlordCount: { $arrayElemAt: ["$LandlordCount.count", 0] },
          OccupantCount: { $arrayElemAt: ["$OccupantCount.count", 0] },
          UnverifiedCount: { $arrayElemAt: ["$UnverifiedCount.count", 0] },
        },
      },
    ]);

    return result;
  } catch (error) {
    throw error;
  }
};

const userRegCountService = {
  async getUserCount(timeframe) {
    const currentDate = new Date();
    let counts = [];

    switch (timeframe) {
      case "24h":
        for (let i = 23; i >= 0; i -= 2) {
          // Step by 2 for two-hour intervals
          const startTime = new Date(currentDate);
          startTime.setHours(currentDate.getHours() - i, 0, 0, 0); // Start of the 2-hour window
          const endTime = new Date(startTime);
          endTime.setHours(endTime.getHours() + 2); // 2-hour interval

          const count = await UserAccount.countDocuments({
            created_at: { $gte: startTime, $lt: endTime },
          });

          const startHourLabel = startTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });

          const endHourLabel = endTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });

          counts.push({ hours: `${startHourLabel} - ${endHourLabel}`, count });
        }
        break;
      case "30d":
        for (let i = 30; i >= 0; i--) {
          const startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - i);
          startDate.setUTCHours(0, 0, 0, 0); // Set the time to 00:00:00 UTC

          const endDate = new Date(startDate);
          endDate.setUTCDate(endDate.getUTCDate() + 1); // Set endDate to the next day at midnight
          endDate.setUTCHours(0, 0, 0, 0); // Ensure endDate is also at 00:00:00 UTC

          const count = await UserAccount.countDocuments({
            created_at: {
              $gte: startDate,
              $lt: endDate,
            },
          });

          const dateLabel = startDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          counts.push({ date: dateLabel, count });
        }
        break;

      case "90d":
        for (let i = 9; i >= 0; i--) {
          const startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - i * 10); // Start every 10-day window
          startDate.setUTCHours(0, 0, 0, 0); // Set the time to 00:00:00 UTC

          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 10); // 10-day interval

          const count = await UserAccount.countDocuments({
            created_at: {
              $gte: startDate,
              $lt: endDate,
            },
          });

          const startLabel = startDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          const endLabel = endDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          counts.push({ days: `${startLabel} - ${endLabel}`, count });
        }
        break;

      case "1y":
        for (let i = 11; i >= 0; i--) {
          const month = new Date(currentDate);
          month.setMonth(currentDate.getMonth() - i, 1); // First day of the month
          const nextMonth = new Date(month);
          nextMonth.setMonth(month.getMonth() + 1); // Next month

          const count = await UserAccount.countDocuments({
            created_at: {
              $gte: month,
              $lt: nextMonth,
            },
          });

          const monthLabel = month.toLocaleString("en-US", { month: "long" });

          counts.push({ month: monthLabel, count });
        }
        break;

      case "all":
        // Retrieve the earliest registration date from the UserAccount collection
        const earliestUser = await UserAccount.findOne(
          {},
          { created_at: 1 }
        ).sort({ created_at: 1 });
        const startDate = earliestUser ? earliestUser.created_at : currentDate; // Use current date if no users exist

        // Iterate from the start date to the current date in 3-month increments
        let currentStartDate = new Date(startDate);
        const currentEndDate = new Date(currentDate);

        while (currentStartDate < currentEndDate) {
          const nextStartDate = new Date(currentStartDate);
          nextStartDate.setMonth(currentStartDate.getMonth() + 3); // Increment by 3 months

          const count = await UserAccount.countDocuments({
            created_at: {
              $gte: currentStartDate,
              $lt: nextStartDate,
            },
          });

          // Push the counts for each three-month period
          counts.push({
            date: `${currentStartDate.toLocaleString("default", {
              month: "long",
            })} ${currentStartDate.getFullYear()}`,
            count,
          });

          // Move to the next three-month period
          currentStartDate = nextStartDate;
        }
        break;

      default:
        throw new Error("Invalid timeframe");
    }

    return counts;
  },
};

const getActiveUserCount = async (timeframe) => {
  const currentDate = new Date();
  let counts = [];

  switch (timeframe) {
    case "24hr":
      for (let i = 23; i >= 0; i -= 2) { // Every hour for the last 2 hours
        const startTime = new Date(currentDate);
        startTime.setHours(currentDate.getHours() - i, 0, 0, 0);
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 1); // End of the hour

        const count = await UserAccount.countDocuments({
          last_login: { $gte: startTime, $lt: endTime },
        });

        counts.push({ hour: startTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }), count });
      }
      break;

    case "7d":
      for (let i = 6; i >= 0; i--) { // Daily counts for the last 7 days
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - i);
        startDate.setUTCHours(0, 0, 0, 0);

        const count = await UserAccount.countDocuments({
          last_login: {
            $gte: startDate,
            $lt: new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000), // Next day
          },
        });

        counts.push({ date: startDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }), count });
      }
      break;

    case "30d":
      for (let i = 29; i >= 0; i--) { // Daily counts for the last 30 days
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - i);
        startDate.setUTCHours(0, 0, 0, 0);

        const count = await UserAccount.countDocuments({
          last_login: {
            $gte: startDate,
            $lt: new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000), // Next day
          },
        });

        counts.push({ date: startDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }), count });
      }
      break;

    case "90d":
      for (let i = 89; i >= 0; i--) { // Daily counts for the last 90 days
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - i);
        startDate.setUTCHours(0, 0, 0, 0);

        const count = await UserAccount.countDocuments({
          last_login: {
            $gte: startDate,
            $lt: new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000), // Next day
          },
        });

        counts.push({ date: startDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }), count });
      }
      break;

    case "1y":
      for (let i = 11; i >= 0; i--) { // Monthly counts for the last 12 months
        const month = new Date(currentDate);
        month.setMonth(currentDate.getMonth() - i, 1); // First day of the month
        const nextMonth = new Date(month);
        nextMonth.setMonth(month.getMonth() + 1); // Next month

        const count = await UserAccount.countDocuments({
          last_login: {
            $gte: month,
            $lt: nextMonth,
          },
        });

        const monthLabel = month.toLocaleString("en-US", { month: "long" });

        counts.push({ month: monthLabel, count });
      }
      break;

    case "all":
      // Retrieve the earliest login date from the UserAccount collection
      const earliestUser = await UserAccount.findOne({}, { last_login: 1 }).sort({ last_login: 1 });
      const startDate = earliestUser ? earliestUser.last_login : currentDate; // Use current date if no users exist

      // Iterate from the start date to the current date in 3-month increments
      let currentStartDate = new Date(startDate);
      const currentEndDate = new Date(currentDate);

      while (currentStartDate < currentEndDate) {
        const nextStartDate = new Date(currentStartDate);
        nextStartDate.setMonth(currentStartDate.getMonth() + 3); // Increment by 3 months

        const count = await UserAccount.countDocuments({
          last_login: {
            $gte: currentStartDate,
            $lt: nextStartDate,
          },
        });

        // Push the counts for each three-month period
        counts.push({
          date: `${currentStartDate.toLocaleString("default", { month: "long" })} ${currentStartDate.getFullYear()}`,
          count,
        });

        // Move to the next three-month period
        currentStartDate = nextStartDate;
      }
      break;

    default:
      throw new Error("Invalid timeframe");
  }

  return counts;
};

module.exports = {
  getAllUserCount,
  userRegCountService,
  getActiveUserCount
};
