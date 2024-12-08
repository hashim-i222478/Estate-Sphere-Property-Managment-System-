import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom"; // Import useLocation
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PropertyForm from "../../components/VendorComponents/VendorPropertyForm";
import PropertyDetails from "../../components/VendorComponents/PropertyDetails"; // Import PropertyDetails
import "../../Styles/vendorpages/VendorProperty.css";

const VendorProperty = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const vendorId = queryParams.get("vendorId");

  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [viewDetails, setViewDetails] = useState(null); // Store the property details
  const [editProperty, setEditProperty] = useState(null); // Edit Property functionality
  const [_id, setId] = useState(vendorId);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  const [property, setProperty] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    area: "",
    picture: null,
    availability: true,
  });

  const fetchProperties = async () => {
    console.log(vendorId);
    try {
      const result = await axios.get(
        `http://localhost:5000/api/vendor/properties/get_properties/${vendorId}`
      );
      setProperties(result.data.properties);
      setFeaturedProducts(result.data.properties);
    } catch (err) {
      console.error("Error fetching properties:", err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentProductIndex(
        (prevIndex) => (prevIndex + 1) % featuredProducts.length
      );
    }, 5000); // Change featured event every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [featuredProducts.length, currentProductIndex]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(property).forEach((key) => formData.append(key, property[key]));
    formData.append("_id", _id);
    formData.append("editProperty", editProperty);

    try {
      const url = editProperty
        ? "http://localhost:5000/api/vendor/properties/edit-property"
        : "http://localhost:5000/api/vendor/properties/add-property";

      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(response.data.message);
      fetchProperties();
      setShowForm(false);
      setEditProperty(null); // Reset editing state
    } catch (err) {
      console.error("Error saving property:", err);
      alert("Failed to save property.");
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (isConfirmed) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/vendor/properties/delete-property",
          { _id: id }
        );
        alert(response.data.message);
        fetchProperties();
      } catch (err) {
        console.error("Error deleting property:", err);
        alert("Failed to delete property.");
      }
    } else {
      alert("Property deletion cancelled.");
    }
  };

  const handleEdit = (prop) => {
    setProperty({
      title: prop.title,
      description: prop.description,
      price: prop.price,
      address: prop.address,
      area: prop.area,
      picture: null,
      availability: prop.availability,
    });
    setEditProperty(prop._id);
    setShowForm(true);
  };

  return (
    <>
      <Header />
      {featuredProducts.length > 0 && (
        <div className="featured-products">
          <div className="featured-product">
            <img
              src={`http://localhost:5000/uploads/${featuredProducts[currentProductIndex]?.picture}`}
              alt={featuredProducts[currentProductIndex]?.name}
              className="featured-image"
            />
            <div className="featured-info">
              <h1>Title: {featuredProducts[currentProductIndex]?.title}</h1>
              <p className="description">
                <strong>Description:</strong>{" "}
                <span>
                  {featuredProducts[currentProductIndex]?.description}
                </span>
              </p>
              <p>
                <strong>Price:</strong>{" "}
                <span>${featuredProducts[currentProductIndex]?.price}</span>
              </p>
              <p>
                <strong>🌏 Address:</strong>{" "}
                <span>{featuredProducts[currentProductIndex]?.address}</span>
              </p>
              <p>
                <strong>Area:</strong>{" "}
                <span>{featuredProducts[currentProductIndex]?.area}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="properties-container">
        <div className="content-header">
          <button
            onClick={() => {
              setShowForm(true);
              setProperty({
                title: "",
                description: "",
                price: "",
                address: "",
                area: "",
                picture: null,
                availability: true,
              });
              setEditProperty(null); // Reset edit state when adding a new property
            }}
            className="add-property-button"
          >
            Add Property
          </button>
        </div>
        <div className="property-grid">
          {properties.length > 0 ? (
            properties.map((prop) => (
              <div key={prop._id} className="property-card">
                <img
                  src={`http://localhost:5000/uploads/${prop.picture}`}
                  alt={prop.title}
                  className="modal-image"
                />
                <h3 className="property-title">{prop.title}</h3>
                <p className="property-location">{prop.address}</p>
                <div className="action-buttons">
                  <button
                    onClick={() => setViewDetails(prop)}
                    className="view-details-button"
                  >
                    View Details
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(prop)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(prop._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-properties">No properties available.</p>
          )}
        </div>

        {/* Add/Edit Property Form */}
        {showForm && (
          <PropertyForm
            show={showForm}
            handleClose={() => setShowForm(false)}
            handleSubmit={handleSubmit}
            property={property}
            setProperty={setProperty}
          />
        )}

        {/* View Details Modal - using PropertyDetails Component */}
        {viewDetails && (
          <PropertyDetails
            property={viewDetails}
            onClose={() => setViewDetails(null)} // Close the modal when clicking outside
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default VendorProperty;
