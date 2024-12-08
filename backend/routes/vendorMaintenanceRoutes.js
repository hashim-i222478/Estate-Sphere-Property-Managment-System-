const express = require("express");
const Property = require("../models/Properties");
const Member = require("../models/Members");
const dotenv = require("dotenv");

const router = express.Router();

const accountSid = process.env.sid;
const authToken = process.env.token;
const client = require("twilio")(accountSid, authToken);

// Get all properties with maintenance requests for a specific owner
router.get("/maintenance-requests/:vendorId", async (req, res) => {
  try {
    const ownerId = req.params.vendorId; // Get the ownerId from the query parameters
    console.log(ownerId);
    // Validate if ownerId is provided
    if (!ownerId) {
      return res.status(400).json({
        success: false,
        message:
          "Owner ID is required to fetch properties with maintenance requests.",
      });
    }

    // Find properties for the given owner that have at least one maintenance request
    const properties = await Property.find({
      owner: ownerId, // Filter by ownerId
      "maintenanceRequests.0": { $exists: true }, // Ensure the property has at least one maintenance request
    })
      .populate("maintenanceRequests.requestedBy", "name email") // Populate the requestedBy field with the name and email
      .select("title address price area maintenanceRequests picture"); // Select relevant fields

    // If no properties are found
    if (properties.length === 0) {
      return res.json({
        success: false,
        message:
          "No properties found for this owner with maintenance requests.",
      });
    }

    res.status(200).json(properties); // Return the properties with maintenance requests
  } catch (error) {
    console.error("Error fetching maintenance requests:", error);
    res.status(500).json({ success: false, message: "Server error." }); // Handle server error
  }
});

// Update status of a specific maintenance request
router.put(
  "/maintenance-requests/:propertyId/request/:requestId/status",
  async (req, res) => {
    try {
      const { propertyId, requestId } = req.params;
      const { status } = req.body; // Get the new status

      // Check if the status is valid
      if (!status || !["Pending", "In Progress", "Resolved"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value.",
        });
      }

      // Find the property by ID
      const property = await Property.findById(propertyId);

      if (!property) {
        return res
          .status(404)
          .json({ success: false, message: "Property not found." });
      }

      // Find the maintenance request within the property
      const maintenanceRequest = property.maintenanceRequests.id(requestId);

      if (!maintenanceRequest) {
        return res.status(404).json({
          success: false,
          message: "Maintenance request not found.",
        });
      }

      // Update the status of the request
      maintenanceRequest.status = status;

      // Save the property with the updated request
      await property.save();

      // Send SMS notification to the customer

      const member = await Member.findById(maintenanceRequest.requestedBy);

      const customerPhoneNumber = member.phone; // Assuming 'phone' field exists on the requestedBy object
      const customerName = member.name;

      const messageBody = `Hello ${customerName},\nYour maintenance request for property: ${property.title} has been updated to "${status}" status. Thank you for your patience.`;

      // Send the SMS via Twilio

      client.messages.create({
        body: messageBody,
        messagingServiceSid: process.env.ssid,
        to: customerPhoneNumber,
      });

      res.status(200).json({
        success: true,
        message: "Maintenance request status updated successfully.",
        property,
      });
    } catch (error) {
      console.error("Error updating maintenance request status:", error);
      res.status(500).json({ success: false, message: "Server error." });
    }
  }
);

module.exports = router;
