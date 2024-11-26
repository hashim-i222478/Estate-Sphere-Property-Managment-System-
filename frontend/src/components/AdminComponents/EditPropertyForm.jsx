import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Styles/adminpages/editpropertform.css";

const EditPropertyForm = ({ property, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: property.title,
        description: property.description,
        price: property.price,
        address: property.address,
        area: property.area,
        availability: property.availability.toString(),
        picture: null
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      };
    
      const handleFileChange = (e) => {
        setFormData(prev => ({
          ...prev,
          picture: e.target.files[0]
        }));
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          if (key === 'picture' && formData[key] !== null) {
            dataToSend.append(key, formData[key], formData[key].name);
          } else {
            dataToSend.append(key, formData[key]);
          }
        });
    
        // Append property ID for the update
        dataToSend.append('editProperty', property._id);
    
        onSubmit(dataToSend);
      };

  return (
    <div className="modal">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} />

          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} />

          <label htmlFor="price">Price</label>
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} />

          <label htmlFor="address">Address</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} />

          <label htmlFor="area">Area</label>
          <input type="text" id="area" name="area" value={formData.area} onChange={handleChange} />

          <label htmlFor="availability">Availability</label>
          <select id="availability" name="availability" value={formData.availability} onChange={handleChange}>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>

          <label htmlFor="picture">Picture</label>
          <input type="file" id="picture" name="picture" onChange={handleFileChange} />

          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditPropertyForm;
