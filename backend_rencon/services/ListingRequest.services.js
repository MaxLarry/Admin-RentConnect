// services/ListingRequest.services.js
const mongoose = require("mongoose");
const { PendingRequest } = require("../models/Property_list.model");

// Service function to fetch all pending requests and their profile data using aggregation
const getAllPendingRequestsWithProfiles = async () => {
  try {
    const result = await PendingRequest.aggregate([
      {
        $lookup: {
          from: "pending_request_profile", // "profiles" just a trial and error
          localField: "userId",
          foreignField: "userId",
          as: "profile",
        },
      },
      {
        $unwind: {
          path: "$profile",
          preserveNullAndEmptyArrays: true, // Preserve documents with no matching profile
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true, // Preserve documents with no matching user
        },
      },
      {
        $project: {
          _id: 1,
          description: 1,
          status: 1,
          created_at: 1,
          profile: {
            email: "$user.email",
            fullName: {
              $concat: ["$profile.firstName", " ", "$profile.lastName"], // concat fname and lname
            },
            contactDetails: "$profile.contactDetails",
          },
        },
      },
    ]);

    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllPendingRequestsWithProfiles,
};
