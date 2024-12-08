import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Customercomponents/Navbar";
import Footer from "../../components/Customercomponents/footer";
import "../../Styles/customer/ViewProperties.css";
import propimg from "./prop.jpg";
import { useNavigate } from "react-router-dom";
const geminiApiKey = "AIzaSyCJ38Mk1dl2jdWeYR7LaM5bI4y9YZz_c9M";


//boolean value to check if the user is logged in or not
const token = localStorage.getItem("token");
let isLoggedIn = false;

if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    isLoggedIn = !isExpired; //this will return true if the token is not expired
  } catch (error) {
    console.error("Error decoding token:", error);
  }
}

console.log("Is user logged in?", isLoggedIn);


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
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
  });

  const [token, setToken] = useState(localStorage.getItem('token'));

  // Fetch properties from the API
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { location, minPrice, maxPrice } = filters;

      const response = await axios.get("http://localhost:5000/api/properties", {
        params: { location, minPrice, maxPrice },
      });
      const availableProperties = response.data.filter(property => property.availability);
      setProperties(availableProperties);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setLoading(false);
    }
  };
  
  const handleBookProperty = (property) => {
    if (!isLoggedIn) {
      alert("You need to be logged in to book a property.");
      window.location.href = "/login";
      return;
    }

    // Navigate to the payment page with property details
    navigate("/payment", { state: { property } });
  };


  useEffect(() => {
    fetchProperties();
  }, []); // Empty dependency array to run only once on component load


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = () => {
    fetchProperties();
  };


  useEffect(() => {
    const fetchFavorites = async () => {
      if (isLoggedIn) {
        try {
          const favoritesResponse = await axios.get('http://localhost:5000/api/favorites', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFavorites(favoritesResponse.data.map(property => property._id));

        } catch (error) {
          console.error("Failed to fetch favorites:", error);
        }
      }
    };

    fetchProperties();
    fetchFavorites();
  }, [token]); // Run this effect whenever the token changes and on component load

  
  const handleToggleFavorite = async (propertyId) => {
    const isFavorite = favorites.includes(propertyId);  // Check if the property is already in favorites

    // Check if the user is logged in and has a valid token
    if (!isLoggedIn || !token) {
      alert("You need to be logged in to add to favorites.");
      window.location.href = "/login";  // Redirect to login page
      return;
    }

    try {
      let response;
      
      // Handle "Remove from favorites"
      if (isFavorite) {
        const response = await axios.delete(`http://localhost:5000/api/favorites/remove/${propertyId}`, {
          headers: {
            Authorization: `Bearer ${token}`  // Send the token for authorization
          }
        });
        
        // If successful, update the favorites list by removing the property ID
        setFavorites(prevFavorites => prevFavorites.filter(id => id !== propertyId));

      } else {
        // Handle "Add to favorites"
        response = await axios.post(`http://localhost:5000/api/favorites/add/${propertyId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`  // Send the token for authorization
          }
        });
        
        // If successful, add the property ID to the favorites list
        setFavorites(prevFavorites => [...prevFavorites, propertyId]);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      alert("Failed to update favorites. Please try again.");
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
    <div style={{backgroundImage: `url(${propimg})`,
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
                {/* apply the import image */}
                <img
                  src={propimg}
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
                      onClick={() => handleBookProperty(property)}
                      className={`book-button ${
                        !property.availability ? "disabled" : ""
                      }`}
                      disabled={!property.availability}
                    >
                      {property.availability ? "Book Now" : "Not Available"}
                    </button>
                  {/*button to add to favourites width*/}
                    <button
                      onClick={() => handleToggleFavorite(property._id)}
                      className="favorite-button"
                    >
                      {favorites.includes(property._id) ? "❤️" : "🤍"}
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
