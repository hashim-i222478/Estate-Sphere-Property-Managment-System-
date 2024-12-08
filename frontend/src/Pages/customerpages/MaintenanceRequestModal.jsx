import React, { useState } from "react";
import axios from "axios";
import "../../Styles/customer/MaintenanceRequestModal.css"; // For styling the modal

const MaintenanceRequestModal = ({ propertyId, onClose, onRequestSubmitted }) => {
  const [requestText, setRequestText] = useState("");

  const handleRequestChange = (e) => {
    setRequestText(e.target.value);
  };

  const handleSubmitRequest = async () => {
    if (!requestText) {
      alert("Please enter your maintenance request.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to submit a maintenance request.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/maintenance/${propertyId}`,
        { requestText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Maintenance request submitted successfully!");
      onRequestSubmitted();  // Callback to update parent component (fetch data again)
      onClose();  // Close the modal after submitting
    } catch (error) {
      console.error("Error submitting maintenance request:", error);
      alert("Failed to submit maintenance request.");
    }
  };

  return (
    <div className="modal-overlay">
      
      <div className="modal-container">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Maintenance Request</h2>
        <textarea
          className="maintenance-textarea"
          placeholder="Enter your maintenance request..."
          value={requestText}
          onChange={handleRequestChange}
        ></textarea>
        <div className="modal-actions">
          <button onClick={handleSubmitRequest} className="submit-btn">
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceRequestModal;
