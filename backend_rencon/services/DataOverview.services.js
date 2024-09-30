const { UserAccount } = require('../models/User.model'); 

const getAllUserCount = async () => {
  try {
    const result = await UserAccount.aggregate([
      {
        $facet: {
          LandlordCount: [
            { $match: { role: "landlord", isProfileComplete: true } },
            { $count: "count" }
          ],
          OccupantCount: [
            { $match: { role: "occupant", isProfileComplete: true } },
            { $count: "count" }
          ],
          UnverifiedCount: [
            { $match: { isProfileComplete: false } },
            { $count: "count" }
          ]
        }
      },
      {
        $project: {
          LandlordCount: { $arrayElemAt: ["$LandlordCount.count", 0] },
          OccupantCount: { $arrayElemAt: ["$OccupantCount.count", 0] },
          UnverifiedCount: { $arrayElemAt: ["$UnverifiedCount.count", 0] }
        }
      }
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
            case '24h':
                for (let i = 0; i < 24; i++) {
                    const startTime = new Date(currentDate);
                    startTime.setHours(currentDate.getHours() - i);
                    const endTime = new Date(startTime);
                    endTime.setHours(endTime.getHours() + 1); // 1 hour interval

                    const count = await UserAccount.countDocuments({
                        createdAt: { $gte: startTime, $lt: endTime },
                    });

                    counts.push({ hour: `${i} AM`, count });
                }
                break;

            case '30d':
                for (let i = 0; i < 6; i++) {
                    const date = new Date(currentDate);
                    date.setDate(date.getDate() - (5 * i)); // Interval of 5 days
                    const count = await UserAccount.countDocuments({
                        createdAt: {
                            $gte: date,
                            $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000), // Next day
                        },
                    });

                    counts.push({ date: date.toISOString().split('T')[0], count });
                }
                break;

            case '1y':
                for (let i = 0; i < 12; i++) {
                    const month = new Date(currentDate);
                    month.setMonth(currentDate.getMonth() - i);
                    month.setDate(1); // Get the first day of the month
                    const count = await UserAccount.countDocuments({
                        createdAt: {
                            $gte: month,
                            $lt: new Date(month.getTime() + 30 * 24 * 60 * 60 * 1000), // Approx 1 month later
                        },
                    });

                    counts.push({ month: month.toISOString().split('T')[0], count });
                }
                break;

            case 'all':
                for (let i = 0; i < 5; i++) {
                    const date = new Date(currentDate);
                    date.setFullYear(date.getFullYear() - (i * 30)); // Every 30 days
                    const count = await UserAccount.countDocuments({
                        createdAt: {
                            $gte: date,
                            $lt: new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000),
                        },
                    });

                    counts.push({ date: date.toISOString().split('T')[0], count });
                }
                break;

            default:
                throw new Error('Invalid timeframe');
        }

        return counts;
    },
};


module.exports = {
  getAllUserCount,
  userRegCountService,
};
