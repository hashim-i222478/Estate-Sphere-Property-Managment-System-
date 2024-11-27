import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "../../components/AdminComponents/adminHeader";
import AdminFooter from "../../components/AdminComponents/adminFooter";
import UserForm from "../../components/AdminComponents/UserForm"; // Assume this handles both add and edit
import "../../Styles/adminpages/manageprofiles.css";

const ManageUserProfile = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  //create for view details
    const [viewDetails, setViewDetails] = useState(null);
    const [showForm, setShowForm] = useState(false);
const [formMode, setFormMode] = useState("add"); // Use this to toggle between 'add' and 'edit'


  useEffect(() => {
    const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not authorized. Please log in.");
        window.location.href = "/login";
        return;
      }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/vendor/userprofile/all-users");
        setUsers(response.data);
    } catch (error) {
        console.error("Failed to fetch users:", error);
    }
  };

  const handleAddUser = () => {
    setSelectedUser({
      username: "",
      email: "",
      role: ""
    });
    setFormMode("add");
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormMode("edit");
    setShowForm(true);
};
const handleSubmit = async (userData) => {
    try {
        const url = formMode === "edit" ? "http://localhost:5000/api/vendor/userprofile/update-profile" : "http://localhost:5000/api/admin/users";
        const method = axios[formMode === "edit" ? "post" : "post"]; // Assuming both use POST as your update endpoint uses POST

        const response = await method(url, userData);
        if (response.data.success || response.status === 200) { // Success handling might depend on your API response structure
            alert("User saved successfully.");
            setShowForm(false);
            fetchUsers(); // Re-fetch users to update the list with changes
        } else {
            alert(response.data.message || "Failed to save user.");
        }
    } catch (error) {
        console.error("Failed to save user:", error);
        alert("Failed to save user: " + error.message);
    }
};


  const handleDeleteUser = async (userEmail) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (isConfirmed) {
        try {
            const response = await axios.post("http://localhost:5000/api/vendor/userprofile/delete-user", { email: userEmail });
            if (response.data.success) {
                alert("User deleted successfully.");
                fetchUsers();
            } else {
                alert("Failed to delete user: " + response.data.message);
            }
        } catch (error) {
            alert("Failed to delete user. Error: " + error.message);
        }
    }
};

return (
    <>
        <AdminHeader />
        <div className="user-management-container">
        <h2 className="user-heading">Below are the users in the system</h2>
            <div className="add-button-container">
                <button className="add-button" onClick={handleAddUser}>Click Here to add new User</button>
            </div>
            <div className="user-list">
                
                {users.map(user => (
                    <div key={user._id} className="user-item">
                        <p>Email: {user.email}</p>
                        <p>Username: {user.username}</p>
                        <div className="action-buttons">
                            <button className="view-details-button" onClick={() => setViewDetails(user)}>View Details</button>
                            <button className="edit-button" onClick={() => handleEditUser(user)}>Edit</button>
                            <button className="delete-button" onClick={() => handleDeleteUser(user.email)}>Delete</button>
                            </div>
                    </div>
                ))}
            </div>
            {showForm && (
                <UserForm
                    user={selectedUser}
                    onClose={() => setShowForm(false)}
                    onSubmit={handleSubmit}
                    mode={formMode}
                />
            )}

            {viewDetails && (
                <div className="view-details-modal">
                    <div className="view-details-content">
                        <p>Email: {viewDetails.email}</p>
                        <p>Username: {viewDetails.username}</p>
                        <p>Role: {viewDetails.role}</p>
                        <button onClick={() => setViewDetails(null)}>Close</button>
                    </div>
                </div>
            )}

        </div>
        <AdminFooter />
    </>
);
};

export default ManageUserProfile;
