import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "../../components/AdminComponents/adminHeader";
import AdminFooter from "../../components/AdminComponents/adminFooter";
import PropertyDetails from "../../components/VendorComponents/PropertyDetails";
import PropertyEditForm from "../../components/AdminComponents/EditPropertyForm"; // Import the edit form component
import "../../Styles/adminpages/manageproperty.css";

const ManageProperty = () => {
    const [properties, setProperties] = useState([]);
    const [viewDetails, setViewDetails] = useState(null);
    const [editProperty, setEditProperty] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false); // To toggle the edit form

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not authorized. Please log in.");
        window.location.href = "/login";
        return;
      }

      fetchProperties();
    }, []);

    const fetchProperties = async () => {
      try {
        const result = await axios.get("http://localhost:5000/api/vendor/properties/get_properties");
        setProperties(result.data);
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    };

    const handleDelete = async (id) => {
      const isConfirmed = window.confirm("Are you sure you want to delete this property?");
      if (isConfirmed) {
        try {
          await axios.post("http://localhost:5000/api/vendor/properties/delete-property", { _id: id });
          alert("Property deleted successfully.");
          fetchProperties();
        } catch (err) {
          console.error("Error deleting property:", err);
          alert("Failed to delete property.");
        }
      }
    };

    const handleEdit = (property) => {
      setEditProperty(property);
      setShowEditForm(true); // Show the edit form
    };

    const handleUpdateProperty = async (formData) => {
        try {
          const response = await axios.post(`http://localhost:5000/api/vendor/properties/edit-property`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          alert("Property updated successfully!");
          setShowEditForm(false);
          fetchProperties();
        } catch (error) {
          console.error("Failed to update the property:", error);
          alert("Failed to update the property.");
        }
      };
      

    const closeEditForm = () => {
      setShowEditForm(false);
    };

    return (
      <>
        <AdminHeader />
        <div className="properties-container">
          <p className="properties-heading">Manage Properties</p>
          <div className="property-grid">
            {properties.map((prop) => (
              <div key={prop._id} className="property-card">
                <img src={`http://localhost:5000/uploads/1732280416746-image-768x508.png`} alt={prop.title} className="modal-image" />
                <h3 className="property-title">{prop.title}</h3>
                <p className="property-location">{prop.address}</p>
                <div className="action-buttons">
                  <button onClick={() => setViewDetails(prop)} className="view-details-button">View Details</button>
                  <button onClick={() => handleEdit(prop)} className="edit-button">Edit</button>
                  <button onClick={() => handleDelete(prop._id)} className="delete-button">Delete</button>
                </div>
              </div>
            ))}
            {!properties.length && <p className="no-properties">No properties available.</p>}
          </div>

          {/* Property Edit Form Modal */}
          {showEditForm && editProperty && (
            <PropertyEditForm property={editProperty} onClose={closeEditForm} onSubmit={handleUpdateProperty} />
          )}

          {/* View Details Modal */}
          {viewDetails && (
            <PropertyDetails property={viewDetails} onClose={() => setViewDetails(null)} />
          )}
        </div>
        <AdminFooter />
      </>
    );
};

export default ManageProperty;
