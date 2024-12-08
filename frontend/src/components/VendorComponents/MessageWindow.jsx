import React, { useState, useEffect } from "react";
import axios from "axios";

const MessageWindow = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true); // To track loading state
  const [error, setError] = useState(null); // To track errors
  const [propertyDetails, setPropertyDetails] = useState(null); // Store property details

  // Fetch messages when the chatId changes
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setPropertyDetails(null);
      return;
    }

    setLoading(true); // Start loading
    axios
      .get(`http://localhost:5000/api/vendor/messages/messages/${chatId}`)
      .then((response) => {
        setMessages(response.data.messages); // Update messages
        setPropertyDetails(response.data.propertyDetails); // Update property details
        console.log(response.data.propertyDetails);
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        setError("Error fetching messages");
        console.error("Error fetching messages:", error);
        setLoading(false); // Stop loading
      });
  }, [chatId]);

  // Handle sending a new message
  const sendMessage = () => {
    if (!newMessage.trim()) {
      return; // Prevent sending empty messages
    }

    axios
      .post("http://localhost:5000/api/vendor/messages/message", {
        chatId,
        senderName: "Vendor", // Replace "Vendor" with dynamic sender if needed
        message: newMessage,
      })
      .then((response) => {
        setMessages((prevMessages) => [...prevMessages, response.data]); // Add the new message to the list
        setNewMessage(""); // Clear the input field
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        setError("Error sending message");
      });
  };

  if (!chatId) {
    return (
      <div className="no-chat-selected">
        <p>No Chat Selected. Please select a chat to view messages.</p>
      </div>
    );
  }

  return (
    <>
      {/* Property Details Section */}
      {propertyDetails && (
        <div className="property-details">
          <div className="property-info">
            <h3 className="property-header">Property Details</h3>
            <p>
              <strong>Title:</strong> {propertyDetails.title}
            </p>
            <p>
              <strong>Address:</strong> {propertyDetails.address}
            </p>
            <p>
              <strong>Price:</strong> ${propertyDetails.price}
            </p>
            <p>
              <strong>Area:</strong> {propertyDetails.area} sqft
            </p>
          </div>
          <div className="property-image-container_1">
            <img
              src={`http://localhost:5000/uploads/${propertyDetails.picture}`}
              alt={propertyDetails.title}
              className="property-image_1"
            />
          </div>
        </div>
      )}

      <div className="chat-window">
        {/* Messages Section */}
        <div className="messages">
          {loading ? (
            <p>Loading messages...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`message ${
                  msg.senderName === "Vendor"
                    ? "vendor-message"
                    : "customer-message"
                }`}
              >
                <strong>{msg.senderName}:</strong> {msg.message}
              </div>
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </div>

        {/* Input and Send Button */}
        <div className="send-message">
          <div className="input-container">
            <input
              type="text"
              value={newMessage}
              placeholder="Type your message..."
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={sendMessage}>
              <i className="fa fa-arrow-right" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageWindow;
