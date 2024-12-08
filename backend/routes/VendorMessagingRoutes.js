const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");

const Message = require("../models/VendorMessage");
const Chat = require("../models/VendorcChats");
const Property = require("../models/Properties");

router.post("/chat", async (req, res) => {
  const { propertyId, customerName, vendorId } = req.body;

  try {
    let chat = await Chat.findOne({ propertyId, customerName, vendorId });

    if (!chat) {
      chat = new Chat({ propertyId, customerName, vendorId });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Error creating chat", error });
  }
});

router.get("/chats/:vendorId", async (req, res) => {
  try {
    const chats = await Chat.find({ vendorId: req.params.vendorId }).sort({
      lastUpdated: -1,
    });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chats", error });
  }
});

router.post("/message", async (req, res) => {
  const { chatId, senderName, message } = req.body;

  try {
    const newMessage = new Message({ chatId, senderName, message });
    await newMessage.save();

    await Chat.findByIdAndUpdate(
      chatId,
      { lastMessage: message, lastUpdated: Date.now() },
      { new: true }
    );

    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
});

router.get("/messages/:chatId", async (req, res) => {
  try {
    // Fetch the chat along with its property details
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Fetch messages for the given chatId
    const messages = await Message.find({ chatId: req.params.chatId }).sort({
      timestamp: 1,
    });

    //get property details
    const property = await Property.findById(chat.propertyId);

    res.status(200).json({
      propertyDetails: property, // Include the associated property details
      messages, // Include the messages
    });
  } catch (error) {
    console.error("Error fetching messages with property details:", error);
    res.status(500).json({ message: "Error fetching messages", error });
  }
});

module.exports = router;
