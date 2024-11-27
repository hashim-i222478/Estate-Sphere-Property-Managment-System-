import "../../Styles/adminpages/userform.css";
import React, { useState, useEffect } from 'react';

function UserForm({ user, onClose, onSubmit, mode }) {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        address: '',
        bio: ''
    });

    // Load user data into the form when editing
    useEffect(() => {
        if (mode === 'edit' && user) {
            setFormData({
                name: user.name || '',
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                bio: user.bio || ''
            });
        }
    }, [user, mode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="user-form-modal">
            <form onSubmit={handleSubmit} className="user-form">
                <label htmlFor="name">Name:</label>
                <input id="name" name="name" value={formData.name} onChange={handleChange} required />

                <label htmlFor="username">Username:</label>
                <input id="username" name="username" value={formData.username} onChange={handleChange} required />

                <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />

                <label htmlFor="phone">Phone:</label>
                <input id="phone" name="phone" value={formData.phone} onChange={handleChange} />

                <label htmlFor="address">Address:</label>
                <input id="address" name="address" value={formData.address} onChange={handleChange} />

                <label htmlFor="bio">Bio:</label>
                <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} />

                <div className="form-actions">
                    <button type="submit">{mode === 'edit' ? 'Update' : 'Add'}</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default UserForm;
