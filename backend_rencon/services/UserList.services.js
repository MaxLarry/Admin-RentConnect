
const { UserProfileRequest } = require("../models/User.model");


const getAllUserRequests = async () => {
  try {
    const result = await UserProfileRequest.aggregate([
      {
        $lookup: {
          from: "users", // The name of the collection to join with
          localField: "userId", // Field from the UserProfileRequest collection
          foreignField: "_id", // Field from the users collection
          as: "user", // Name of the new array field to add
        },
      },
      {
        $unwind: {
          path: "$user", // Unwind the user array
          preserveNullAndEmptyArrays: true, // Keep documents without a matching user
        },
      },
      {
        $project: {
          _id: 1,
          contactDetails: 1,
          created_at: 1,
          firstName: 1,
          gender: 1,
          lastName: 1,
          profileStatus: 1,
          updated_at: 1,
          valid_id: 1,
          email: "$user.email", // Include the email field from the user document
        },
      },
    ]);

    return result;
  }catch (error) {
    throw error;
  }
};

module.exports = {
  getAllUserRequests,
};
