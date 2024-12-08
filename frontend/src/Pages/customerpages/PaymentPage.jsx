import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation and useNavigate
import "./PaymentPage.css";
import propimg from "./prop.jpg";
import axios from "axios";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { property } = location.state || {}; // Get the property data\
  const token = localStorage.getItem("token");


  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [errors, setErrors] = useState({});
 


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const validateFields = () => {
    const newErrors = {};

    if (!/^\d{16}$/.test(paymentDetails.cardNumber)) {
      newErrors.cardNumber = "Card number must be 16 digits";

    }
    if (!/^\d{2}\/\d{2}$/.test(paymentDetails.expiryDate)) {
      newErrors.expiryDate = "Expiry date must be in the format MM/YY";


    }
    if (!/^\d{3,4}$/.test(paymentDetails.cvv)) {
      newErrors.cvv = "CVV must be 3 or 4 digits";


    }
    if (!paymentDetails.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";

    }

    setErrors(newErrors);
    
    alert(Object.values(newErrors).join("\n"));
    return Object.keys(newErrors).length === 0; // Valid if no errors
  };

  const handleConfirmPayment = async () => {

    if (!token) {
      alert("You need to be logged in to book a property.");
      window.location.href = "/login";
      return;
    }


    if (!validateFields()) {
      return;
    }

    console.log("authToken", token);
    console.log("property", property.title);
    console.log(property._id);



    try {
      const response = await axios.post(
          `http://localhost:5000/api/bookings/${property._id}/book`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.message);
      navigate("/ViewProperties");
      
    } catch (error) {
      console.error("Error booking property:", error);
      alert("Failed to book property. Please try again.");
    }

  };

  return (
    <div
      className="payment-page-container"
      style={{
        backgroundImage: `url(${propimg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="payment-card">
        <button className="close-button" onClick={() => navigate("/ViewProperties")}>
          &times;
        </button>
        <h2 className="payment-heading">Confirm Payment</h2>
        <div className="property-summary">
          <h3>{property?.title}</h3>
          <p>{property?.address}</p>
          <p>Price: ${property?.price}</p>
        </div>
        <form className="payment-form">
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={paymentDetails.cardNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              placeholder="MM/YY"
              value={paymentDetails.expiryDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              type="password"
              id="cvv"
              name="cvv"
              placeholder="***"
              value={paymentDetails.cvv}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cardholderName">Cardholder Name</label>
            <input
              type="text"
              id="cardholderName"
              name="cardholderName"
              placeholder="John Doe"
              value={paymentDetails.cardholderName}
              onChange={handleInputChange}
            />
          </div>
        </form>
        <button className="confirm-button" onClick={handleConfirmPayment}>
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
