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
          from: "rooms", // Ensure this collection matches your database
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
          location: 1,
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
          legal_docs: {
            $filter: {
              input: ["$legalDocPhoto", "$legalDocPhoto2", "$legalDocPhoto3"],
              as: "legaldocsPhoto",
              cond: { $ne: ["$$legaldocsPhoto", null] }, // Exclude null room photos
            }, // Project legal document photos
          },
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
            deposit: "$rooms.deposit",
            advance: "$rooms.advance",
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
          location: { $first: "$location" },
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
          status: "Approved",
        },
      },
      {
        $lookup: {
          from: "pending_request_profile",
          localField: "userId",
          foreignField: "userId",
          as: "profile",
        },
      },
      {
        $unwind: {
          path: "$profile",
          preserveNullAndEmptyArrays: true,
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
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "rooms",
          localField: "_id",
          foreignField: "propertyId",
          as: "rooms",
        },
      },
      {
        $project: {
          _id: 1,
          description: 1,
          status: 1,
          created_at: 1,
          typeOfProperty: 1,
          location: 1,
          address: {
            $concat: ["$street", ", ", "$barangay", ", ", "$city"],
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
              cond: { $ne: ["$$photo", null] },
            },
          },
          legal_docs: {
            $filter: {
              input: ["$legalDocPhoto", "$legalDocPhoto2", "$legalDocPhoto3"],
              as: "legaldocsPhoto",
              cond: { $ne: ["$$legaldocsPhoto", null] },
            },
          },
          profile: {
            email: "$user.email",
            fullName: {
              $concat: ["$profile.firstName", " ", "$profile.lastName"],
            },
            contactDetails: "$profile.contactDetails",
          },
          rooms: {
            roomId: "$rooms._id",
            roomNumber: "$rooms.roomNumber",
            roomPhoto: {
              $filter: {
                input: ["$rooms.photo1", "$rooms.photo2", "$rooms.photo3"],
                as: "roomPhoto",
                cond: { $ne: ["$$roomPhoto", null] },
              },
            },
            capacity: "$rooms.capacity",
            price: "$rooms.price",
            deposit: "$rooms.deposit",
            advance: "$rooms.advance",
            availability: "$rooms.availability",
          },
          roomCount: { $size: "$rooms" }, // Count the number of rooms in the array
        },
      },
      {
        $group: {
          _id: "$_id",
          description: { $first: "$description" },
          amenities: { $first: "$amenities" },
          status: { $first: "$status" },
          location: { $first: "$location" },
          created_at: { $first: "$created_at" },
          typeOfProperty: { $first: "$typeOfProperty" },
          property_photo: { $first: "$property_photo" },
          legal_docs: { $first: "$legal_docs" },
          address: { $first: "$address" },
          profile: { $first: "$profile" },
          rooms: { $push: "$rooms" },
          roomCount: { $max: "$roomCount" }, // Ensure roomCount is calculated correctly
        },
      },
      {
        $project: {
          description: 1,
          amenities: 1,
          status: 1,
          location: 1,
          created_at: 1,
          typeOfProperty: 1,
          property_photo: 1,
          legal_docs: 1,
          address: 1,
          profile: 1,
          rooms: 1,
          roomCount: 1,
        },
      },
    ]);

    return result;
  } catch (error) {
    throw error;
  }
};

const getAllRejectedRequest = async () => {
  try {
    const result = await PropertyList.aggregate([
      {
        $match: {
          status: "Rejected", // Using $in to match multiple status values
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
          from: "rooms", // Ensure this collection matches your database
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
          location: 1,
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
          legal_docs: {
            $filter: {
              input: ["$legalDocPhoto", "$legalDocPhoto2", "$legalDocPhoto3"],
              as: "legaldocsPhoto",
              cond: { $ne: ["$$legaldocsPhoto", null] }, // Exclude null room photos
            }, // Project legal document photos
          },
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
            deposit: "$rooms.deposit",
            advance: "$rooms.advance",
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
          location: { $first: "$location" },
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
  getAllApprovedListing,
  getAllRejectedRequest,
  updateRequestStatus,
};
