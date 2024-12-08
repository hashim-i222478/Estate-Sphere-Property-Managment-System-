import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import VendorChats from "../../components/VendorComponents/VendorChats";
import MessageWindow from "../../components/VendorComponents/MessageWindow";
import "../../Styles/vendorpages/vendormessaging.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
const VendorMessaging = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  // Extract vendorId from query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const vendorId = queryParams.get("vendorId");

  // Check if vendorId is present
  if (!vendorId) {
    return <p>Error: Vendor ID is missing. Please check the URL.</p>;
  }

  return (
    <>
      <Header />
      <div className="messaging-system">
        {/* Chat List Section */}
        <div className="chat-list-section">
          <VendorChats vendorId={vendorId} onSelectChat={setSelectedChat} />
        </div>

        {/* Chat Window Section */}
        <div className="chat-window-section">
          {selectedChat ? (
            <MessageWindow chatId={selectedChat._id} />
          ) : (
            <div className="no-chat-selected">
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VendorMessaging;
