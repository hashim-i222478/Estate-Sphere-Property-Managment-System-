import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Styles/customer/CustStyle.css";
import Navbar from "../../components/Customercomponents/Navbar";
import Footer from "../../components/Customercomponents/footer";
import profileImage from "../../assets/profile-icon.png"; // Default profile image

const VendorProfile = () => {
  const [view, setView] = useState("profile"); // To toggle between views
  const [profilePic, setProfilePic] = useState("");
  const [originalProfile, setOriginalProfile] = useState({}); // Store original data
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");

  // For password update functionality
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [accountSettings, setAccountSettings] = useState({
    notifications: true,
    accountVisibility: "public", // Options: "public", "private"
    accountStatus: "active", // Options: "active", "disabled"
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not authorized. Please log in.");
      window.location.href = "/login";
    } else {
      // First check if there is saved profile data in localStorage
      const storedProfile = localStorage.getItem("userProfile");
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setOriginalProfile(parsedProfile);
        setEmail(parsedProfile.email); // Keep email non-editable
        setPhone(parsedProfile.phone);
        setName(parsedProfile.name);
        setUsername(parsedProfile.username);
        setProfilePic(parsedProfile.picture);
        setAddress(parsedProfile.address || "");
        setBio(parsedProfile.bio || "");
      } else {
        // If no profile data in localStorage, fetch from server
        axios
          .post(
            "http://localhost:5000/api/protected/verify-token",
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then((response) => {
            const user = response.data.user;
            setOriginalProfile(user);
            setEmail(user.email); // Keep email non-editable
            setPhone(user.phone);
            setName(user.name);
            setUsername(user.username);
            setProfilePic(user.picture);
            setAddress(user.address || "");
            setBio(user.bio || "");
            localStorage.setItem("userProfile", JSON.stringify(user)); // Store user profile in localStorage
          })
          .catch(() => {
            alert("Your session has expired. Please log in again.");
            localStorage.removeItem("token");
            window.location.href = "/login";
          });
      }
    }
  }, []);

  const isProfileChanged = () => {
    return (
      name !== originalProfile.name ||
      username !== originalProfile.username ||
      phone !== originalProfile.phone ||
      address !== originalProfile.address ||
      bio !== originalProfile.bio
    );
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("profilePic", file);
      formData.append("email", email);

      axios
        .post(
          "http://localhost:5000/api/vendor/userprofile/upload-profile-picture",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((response) => {
          setProfilePic(response.data.profilePicPath);
          // Update localStorage with the new profile picture
          const updatedProfile = { ...originalProfile, picture: response.data.profilePicPath };
          localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
        })
        .catch((error) => {
          console.error("Error uploading the image:", error);
        });
    }
  };

  const handleSaveChanges = () => {
    if (!isProfileChanged()) {
      alert("No changes detected!");
      return;
    }

    const updatedProfile = { name, username, email, phone, address, bio };

    axios
      .post(
        "http://localhost:5000/api/vendor/userprofile/update-profile",
        updatedProfile
      )
      .then(() => {
        alert("Profile updated successfully!");
        setOriginalProfile({
          ...originalProfile,
          name,
          username,
          phone,
          address,
          bio,
        }); // Update original data to reflect changes
        // Store updated profile in localStorage
        localStorage.setItem("userProfile", JSON.stringify({ ...originalProfile, name, username, phone, address, bio }));
      })
      .catch((error) => console.error("Error updating profile:", error));
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/vendor/userprofile/update-password",
        {
          currentPassword,
          newPassword,
          email,
        }
      );

      if (response.data.success) {
        alert("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setView("profile"); // Return to profile view after success
      } else {
        alert(response.data.message || "Password update failed.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password. Please try again.");
    }
  };

  // Reset password fields when the view changes
  useEffect(() => {
    if (view !== "update-password") {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [view]);

  const handleLogout = () => {
    // Ask for user confirmation
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("userProfile"); // Clear the profile data from localStorage
      window.location.href = "/login";
    }
  };

  const handleAccountSettingsChange = (key, value) => {
    setAccountSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  const handleSaveAccountSettings = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/vendor/userprofile/update-account-settings",
        { accountSettings, email }
      );
      if (response.data.success) {
        alert("Account settings updated successfully!");
      } else {
        alert("Failed to update account settings.");
      }
    } catch (error) {
      console.error("Error updating account settings:", error);
      alert("An error occurred while saving account settings.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="profile-container_1">
        <aside className="profile-sidebar">
          <h3>Profile Actions</h3>
          <ul>
            <li onClick={() => setView("profile")}>
              <a href="#">Profile Details</a>
            </li>
            <li onClick={() => setView("update-password")}>
              <a href="#">Update Password</a>
            </li>
            <li onClick={() => setView("account-settings")}>
              <a href="#">Account Settings</a>
            </li>
            <li onClick={handleLogout}>
              <a href="#">Logout</a>
            </li>
          </ul>
        </aside>
        <main className="profile-main">
          {view === "profile" && (
            <>
              <h2 className="profile-title">My Profile</h2>
              <div className="profile-header">
                <div className="upload-section">
                  <img
                    src={
                      profilePic
                        ? `http://localhost:5000/${profilePic}`
                        : profileImage
                    }
                    alt="Profile"
                    className="profile-image"
                  />
                  <label htmlFor="file-upload" className="upload-button">
                    Change Profile Picture
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleProfilePicChange}
                    className="file-input"
                    accept="image/*"
                  />
                </div>
                <div className="profile-details">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label>Username:</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <label>Email:</label>
                  <input type="email" value={email} disabled />
                  <label>Phone:</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <label>Address:</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <label>Bio:</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                  <button className="save-btn" onClick={handleSaveChanges}>
                    Save Changes
                  </button>
                </div>
              </div>
            </>
          )}
          {view === "update-password" && (
            <>
              <h2>Update Password</h2>
              <div className="password-fields">
                <label>Current Password:</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <label>New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <label>Confirm Password:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button className="save-btn" onClick={handleUpdatePassword}>
                  Update Password
                </button>
              </div>
            </>
          )}
          {view === "account-settings" && (
            <>
              <h2>Account Settings</h2>
              <div className="account-settings">
                <label>
                  Notifications:
                  <input
                    type="checkbox"
                    checked={accountSettings.notifications}
                    onChange={() =>
                      handleAccountSettingsChange(
                        "notifications",
                        !accountSettings.notifications
                      )
                    }
                  />
                </label>
                <label>
                  Account Visibility:
                  <select
                    value={accountSettings.accountVisibility}
                    onChange={(e) =>
                      handleAccountSettingsChange(
                        "accountVisibility",
                        e.target.value
                      )
                    }
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </label>
                <label>
                  Account Status:
                  <select
                    value={accountSettings.accountStatus}
                    onChange={(e) =>
                      handleAccountSettingsChange(
                        "accountStatus",
                        e.target.value
                      )
                    }
                  >
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </label>
                <button onClick={handleSaveAccountSettings}>
                  Save Account Settings
                </button>
              </div>
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default VendorProfile;
