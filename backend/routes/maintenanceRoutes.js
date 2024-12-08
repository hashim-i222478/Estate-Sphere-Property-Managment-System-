const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const Property = require("../models/Properties");
const bodyParser = require("body-parser");
const twilio = require("twilio");

// Twilio Credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = new twilio(accountSid, authToken);


// Endpoint to create a maintenance request
router.post("/:propertyId", verifyToken, async (req, res) => {
  const { propertyId } = req.params;
  const { requestText } = req.body;
  const requestedBy = req.user._id;

  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    property.maintenanceRequests.push({ requestText, requestedBy, status: "Pending" });
    await property.save();

    res.status(200).json({ message: "Maintenance request submitted successfully", property });
    const user = req.user;
    const phoneNumber = user.phone;
    //change the phone number into the format that Twilio expects since my ph no is like 03175134074
    //and Twilio expects it to be like +923175134074
    number = "+92" + phoneNumber.slice(1); 
    
    const message = `Maintenance request submitted for property: ${property.title}. \nand for the request of: ${requestText} We will get back to you soon.`;
try {

    // Send SMS notification
    client.messages.create({
      body: message,
      to: number,
      from:'+17754299280',
    });
  }
  catch (error) {
    console.error("Error sending SMS:", error);
    res.status(500).json({ error: "Failed to send SMS notification" });
  }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit maintenance request" });
  }
});

module.exports = router;
