import React, { useState, useEffect } from "react";

import "../../Styles/vendorpages/VendorProperty.css";

const VendorPropertyForm = ({
  show,
  handleClose,
  handleSubmit,
  property,
  setProperty,
}) => {
  const [picturePreview, setPicturePreview] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  // When the form opens, we should set the preview of the existing picture
  useEffect(() => {
    if (property.picture) {
      const reader = new FileReader();
      reader.onload = () => {
        setPicturePreview(reader.result);
      };
      reader.readAsDataURL(property.picture);
    } else {
      setPicturePreview(null); // Reset if no picture
    }
  }, [property.picture]); // Re-run when property.picture changes

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProperty({ ...property, picture: file });

      // Preview the selected image
      const reader = new FileReader();
      reader.onload = () => {
        setPicturePreview(reader.result);
      };
      reader.onerror = () => {
        console.error("Error loading image.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    setPicturePreview(null);
    setProperty({ ...property, picture: null }); // Clear the picture state
  };

  return (
    show && (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close-button" onClick={handleClose}>
            ×
          </button>
          <form onSubmit={handleSubmit} className="property-form">
            <h2 className="form-heading">
              {property._id ? "Edit" : "Add"} Property
            </h2>
            <label className="form-label">
              Title:
              <input
                type="text"
                value={property.title}
                onChange={(e) =>
                  setProperty({ ...property, title: e.target.value })
                }
                required
                className="form-input"
              />
            </label>
            <label className="form-label">
              Description:
              <textarea
                value={property.description}
                onChange={(e) =>
                  setProperty({ ...property, description: e.target.value })
                }
                required
                className="form-textarea"
              />
            </label>
            <label className="form-label">
              Price:
              <input
                type="number"
                value={property.price}
                onChange={(e) =>
                  setProperty({ ...property, price: e.target.value })
                }
                required
                className="form-input"
              />
            </label>
            <label className="form-label">
              Address:
              <textarea
                value={property.address}
                onChange={(e) =>
                  setProperty({ ...property, address: e.target.value })
                }
                required
                className="form-textarea"
              />
            </label>
            <label className="form-label">
              Area (sqft or sqm):
              <input
                type="number"
                value={property.area}
                onChange={(e) =>
                  setProperty({ ...property, area: e.target.value })
                }
                required
                className="form-input"
              />
            </label>
            <label className="form-label">
              Picture:
              <input
                type="file"
                onChange={handlePictureChange}
                className="file-input"
              />
            </label>
            {picturePreview && (
              <div className="picture-preview">
                <img
                  src={picturePreview}
                  alt="Selected Property"
                  className="picture-preview-image"
                />
                <button
                  type="button"
                  onClick={handleRemovePicture}
                  className="remove-picture-button"
                >
                  Remove Picture
                </button>
              </div>
            )}
            {loading && <p>Loading image...</p>} {/* Show loading state */}
            <button
              type="submit"
              className="form-submit-button"
              disabled={loading} // Disable button during image loading
            >
              {loading ? "Uploading..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default VendorPropertyForm;
