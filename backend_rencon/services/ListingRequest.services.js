// services/ListingRequest.services.js
const mongoose = require("mongoose");
const { PropertyList } = require("../models/Property_list.model");

// Service function to fetch all pending requests and their profile data using aggregation
const getAllPendingRequestsWithProfiles = async () => {
  try {
    const result = await PropertyList.aggregate([
      {
        $match: {
          status: { $in: ["Waiting", "Under Review"] }, // Using $in to match multiple status values
        },
      },
      {
        $lookup: {
          from: "pending_request_profile", // Ensure this collection matches your database
          localField: "userId",
          foreignField: "userId",
          as: "profile",
        },
      },
      {
        $unwind: {
          path: "$profile",
          preserveNullAndEmptyArrays: true, // Preserve listings without a matching profile
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
          preserveNullAndEmptyArrays: true, // Preserve listings without a matching user
        },
      },
      {
        $lookup: {
          from: "pending_request_room", // Ensure this collection matches your database
          localField: "_id", // Use the property ID to look up related rooms
          foreignField: "propertyId",
          as: "rooms",
        },
      },
      {
        $unwind: {
          path: "$rooms",
          preserveNullAndEmptyArrays: true, // Preserve listings without matching rooms
        },
      },
      {
        $project: {
          _id: 1,
          description: 1,
          status: 1,
          created_at: 1,
          typeOfProperty: 1,
          location:1,
          address: {
            $concat: ["$street", ", ", "$barangay", ", ", "$city"], // Concatenate firstName and lastName
          },
          amenities: {
            $cond: {
              if: { $isArray: "$amenities" },
              then: "$amenities",
              else: [],
            },
          },
          property_photo: {
            $filter: {
              input: ["$photo", "$photo2", "$photo3"],
              as: "photo",
              cond: { $ne: ["$$photo", null] }, // Exclude null photos
            },
          }, // Project property photos
          legal_docs: ["$legalDocPhoto", "$legalDocPhoto2", "$legalDocPhoto3"], // Project legal document photos
          profile: {
            email: "$user.email",
            fullName: {
              $concat: ["$profile.firstName", " ", "$profile.lastName"], // Concatenate firstName and lastName
            },
            contactDetails: "$profile.contactDetails",
          },
          rooms: {
            roomId: "$rooms._id", // Project room details
            roomNumber: "$rooms.roomNumber",
            roomPhoto: {
              $filter: {
                input: ["$rooms.photo1", "$rooms.photo2", "$rooms.photo3"],
                as: "roomPhoto",
                cond: { $ne: ["$$roomPhoto", null] }, // Exclude null room photos
              },
            },
            capacity: "$rooms.capacity",
            price: "$rooms.price",
            deposit:"$rooms.deposit",
            advance:"$rooms.advance",
            availability: "$rooms.availability",
          },
        },
      },
      {
        $group: {
          _id: "$_id", // Group by property ID to combine rooms into an array
          description: { $first: "$description" },
          amenities: { $first: "$amenities" },
          status: { $first: "$status" },
          location:{$first: "$location"},
          created_at: { $first: "$created_at" },
          typeOfProperty: { $first: "$typeOfProperty" },
          property_photo: { $first: "$property_photo" }, // Group property photos
          legal_docs: { $first: "$legal_docs" }, // Group legal document photos
          address: { $first: "$address" },
          profile: { $first: "$profile" },
          rooms: { $push: "$rooms" }, // Push all rooms into an array
        },
      },
    ]);

    return result;
  } catch (error) {
    throw error;
  }
};

// Service function to fetch all Approved requests and their profile data using aggregation
const getAllApprovedListing = async () => {
  try {
    const result = await PropertyList.aggregate([
      {
        $match: {
          status: "Approved", // Filter for Approved listings
        },
      },
      {
        $lookup: {
          from: "pending_request_profile", // Ensure this collection matches your database
          localField: "userId",
          foreignField: "userId",
          as: "profile",
        },
      },
      {
        $unwind: {
          path: "$profile",
          preserveNullAndEmptyArrays: true, // Preserve listings without a matching profile
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
          preserveNullAndEmptyArrays: true, // Preserve listings without a matching user
        },
      },
      {
        $lookup: {
          from: "pending_request_room", // Ensure this collection matches your database
          localField: "_id", // Use the property ID to look up related rooms
          foreignField: "propertyId",
          as: "rooms",
        },
      },
      {
        $unwind: {
          path: "$rooms",
          preserveNullAndEmptyArrays: true, // Preserve listings without matching rooms
        },
      },
      {
        $project: {
          _id: 1,
          description: 1,
          status: 1,
          created_at: 1,
          typeOfProperty: 1,
          property_photo: {
            $filter: {
              input: ["$photo", "$photo2", "$photo3"],
              as: "photo",
              cond: { $ne: ["$$photo", null] }, // Exclude null photos
            },
          }, // Project property photos
          legal_docs: ["$legalDocPhoto", "$legalDocPhoto2", "$legalDocPhoto3"], // Project legal document photos
          profile: {
            email: "$user.email",
            fullName: {
              $concat: ["$profile.firstName", " ", "$profile.lastName"], // Concatenate firstName and lastName
            },
            contactDetails: "$profile.contactDetails",
          },
          rooms: {
            roomId: "$rooms._id", // Project room details
            roomNumber: "$rooms.roomNumber",
            roomPhoto: {
              $filter: {
                input: ["$rooms.photo1", "$rooms.photo2", "$rooms.photo3"],
                as: "roomPhoto",
                cond: { $ne: ["$$roomPhoto", null] }, // Exclude null room photos
              },
            },
            capacity: "$rooms.capacity",
            price: "$rooms.price",
            availability: "$rooms.availability",
          },
        },
      },
      {
        $group: {
          _id: "$_id", // Group by property ID to combine rooms into an array
          description: { $first: "$description" },
          status: { $first: "$status" },
          created_at: { $first: "$created_at" },
          typeOfProperty: { $first: "$typeOfProperty" },
          property_photo: { $first: "$property_photo" }, // Group property photos
          legal_docs: { $first: "$legal_docs" }, // Group legal document photos
          profile: { $first: "$profile" },
          rooms: { $push: "$rooms" }, // Push all rooms into an array
        },
      },
    ]);

    return result;
  } catch (error) {
    throw error;
  }
};

// Service function to update the status of a request
const updateRequestStatus = async (id, status) => {
  if (!status) {
    throw new Error("Status is required");
  }

  const request = await PropertyList.findByIdAndUpdate(
    id,
    { status },
    { new: true } // Return the updated document
  );

  if (!request) {
    throw new Error("Request not found");
  }

  return request;
};

module.exports = {
  getAllPendingRequestsWithProfiles,
  updateRequestStatus,
  getAllApprovedListing,
};
