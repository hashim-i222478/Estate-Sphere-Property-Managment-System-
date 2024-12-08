import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Customercomponents/Navbar";
import Footer from "../../components/Customercomponents/footer";
import "../../Styles/customer/Favorites.css"; // Include custom CSS for the favorites page
import pic from "./prop.jpg";
import { useNavigate } from "react-router-dom";
import background from "./prop.jpg";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  

  const token = localStorage.getItem("token");

  // Fetch favorite properties
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Handle Booking Property
  const handleBookProperty = (property) => {
    if (!token) {
      alert("You need to be logged in to book a property.");
      window.location.href = "/login";
      return;
    }

    // Navigate to the payment page with property details
    navigate("/payment", { state: { property } });
  };

  // Handle Remove from Favorites
  const handleRemoveFromFavorites = async (propertyId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/favorites/remove/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${token}`  // Send the token for authorization
        }
      });
  
      // Check response status and update state
      if (response.status === 200) {
        alert(response.data.message);
        setFavorites((prevFavorites) =>
          prevFavorites.filter((property) => property._id !== propertyId)
        ); // Remove the property from the local state
      } else {
        throw new Error("Failed to remove property from favorites.");
      }
    } catch (error) {
      console.error("Error removing property from favorites:", error);
      alert("Failed to remove property. Please try again.");
    }
  };

  // Filter favorite properties based on search query
  const filteredFavorites = favorites.filter((property) =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",

        
      }}>
      <div className="favorites-container" style={{
        backgroundImage: `url(${background})`,
      }}>
        <h1 className="favorites-title">Your Favorite Properties</h1>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search your favorite properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading your favorite properties...</p>
        ) : filteredFavorites.length > 0 ? (
          <div className="properties-grid">
            {filteredFavorites.map((property) => (
              <div key={property._id} className="property-card">
                <img
                  src={pic}
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
                      onClick={() => handleBookProperty(property)}
                      className="book-button"
                      disabled={!property.availability}
                    >
                      {property.availability ? "Book Now" : "Not Available"}
                    </button>
                    <button
                      onClick={() => handleRemoveFromFavorites(property._id)}
                      className="remove-button"
                    >
                      Remove from Favorites
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-favorites-message">
            <h2>You have no favorite properties.</h2>
            <p>Start exploring and adding properties to your favorites!</p>
          </div>
        )}
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default FavoritesPage;
