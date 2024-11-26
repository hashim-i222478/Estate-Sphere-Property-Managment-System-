import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Customercomponents/Navbar";
import Footer from "../../components/Customercomponents/footer";
import "./ViewProperties.css";
const geminiApiKey = "AIzaSyCJ38Mk1dl2jdWeYR7LaM5bI4y9YZz_c9M";

async function queryGeminiApi(userInput) {
  const API_KEY = geminiApiKey;  
  const MODEL_NAME = 'gemini-1.5-flash-latest'; 

  const requestBody = {
      contents: [
          {
              parts: [
                  {
                      text: userInput  
                  }
              ]
          }
      ]
  };

  try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
      });

      // Check if the response is OK (status 200-299)
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to fetch response');
      }

      const data = await response.json();

      // Log the full response for debugging
      console.log('Gemini API Response:', data);

      // Check if candidates are available in the response
      if (data.candidates && data.candidates.length > 0) {
          // Extracting the relevant content
          const contentText = data.candidates[0].content.parts[0].text;
          return contentText;
      } else {
          throw new Error('Unexpected response structure: No candidates found');
      }
  } catch (error) {
      console.error('Error querying Gemini API:', error);
      return 'Sorry, something went wrong while generating a response. Please try again.';
  }
}


const ViewProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch properties from the API
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { location, minPrice, maxPrice } = filters;

      const response = await axios.get("http://localhost:5000/api/properties", {
        params: { location, minPrice, maxPrice },
      });
      setProperties(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setLoading(false);
    }
  };
  


  useEffect(() => {
    fetchProperties();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = () => {
    fetchProperties();
  };

  const handleBookProperty = async (propertyId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return alert("Please log in to book a property.");
      }

      await axios.post(
        `http://localhost:5000/api/properties/book/${propertyId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Property booked successfully!");
      fetchProperties(); // Refresh properties to update availability
    } catch (error) {
      console.error("Error booking property:", error);
      alert(error.response?.data?.error || "Failed to book property.");
    }
  };

  const handleWeather = async (address) => {
    console.log("Fetching weather for:", address);

    // calling gemini api
    const response = await queryGeminiApi(address + "give me one word location from the address like city");
    console.log("Response from gemini api:", response);

    try {
      const encodedAddress = encodeURIComponent(response || address);
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodedAddress}&appid=3682d6f4e7416d8470ab9b0e3a110748&units=metric`
      );

      const { main, weather } = weatherResponse.data;
      alert(
        `Weather at ${address}: ${weather[0].description}, Temperature: ${main.temp}°C`
      );
    } catch (error) {
      console.error("Error fetching weather:", error);
      alert("Failed to fetch weather for the selected location.");
    }
  };

  return (
    <div style={{backgroundImage: 'url("https://th.bing.com/th/id/OIP.gl1fdFXzkgcSwyYSa_U07QHaE8?w=640&h=427&rs=1&pid=ImgDetMain")',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'}}>


      <Navbar />
      <div className="view-properties-container">
        {/* Filters Section */}
        <div className="filters">
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />
          <button onClick={handleSearch}>Apply Filters</button>
        </div>

        {/* Properties Section */}
        <div className="properties">
          {loading ? (
            <p>Loading properties...</p>
          ) : properties.length > 0 ? (
            properties.map((property) => (
              <div key={property._id} className="property-card">
                <img
                  src={`http://localhost:5000/uploads/${property.picture}`}
                  alt={property.title}
                  className="property-image"
                />
                <div className="property-details">
                  <h3>{property.title}</h3>
                  <p className="property-location">{property.address}</p>
                  <p className="property-price">Price: ${property.price}</p>
                  <p className="property-area">Area: {property.area} sqft</p>
                  <p className="property-rating">
                    Avg. Rating: {property.avgRatings}/5
                  </p>
                  <div className="property-actions">
                    <button
                      onClick={() => handleWeather(property.address)}
                      className="weather-button"
                    >
                      View Weather
                    </button>
                    <button
                      onClick={() => handleBookProperty(property._id)}
                      className={`book-button ${
                        !property.availability ? "disabled" : ""
                      }`}
                      disabled={!property.availability}
                    >
                      {property.availability ? "Book Now" : "Not Available"}
                    </button>
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews">
                  <h4>Reviews:</h4>
                  {property.reviews.length > 0 ? (
                    property.reviews.map((review, index) => (
                      <div key={index} className="review">
                        <p>
                          <strong>{review.customerName}:</strong>{" "}
                          {review.reviewText}
                        </p>
                        <p>Rating: {review.rating}/5</p>
                      </div>
                    ))
                  ) : (
                    <p>No reviews yet.</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No properties found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewProperties;
