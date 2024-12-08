import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles/authpages/SignUp.css"; // Ensure this path matches where you place your SignUp.css
import axios from "axios";
import "../../Styles/responsive.css";
import { OAuth } from "../../components/OAuth";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false); // For controlling the modal visibility
  const [role, setRole] = useState(""); // To store the role selected by the user

  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      alert(
        "Password must meet the following requirements:\n" +
          "- At least 8 characters long\n" +
          "- Contain at least one uppercase letter\n" +
          "- Contain at least one lowercase letter\n" +
          "- Contain at least one number\n" +
          "- Contain at least one special character"
      );

      return;
    }

    if (password !== cpassword) {
      alert("Passwords do not match.");
      return;
    }

    axios
      .post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
        phone,
      })
      .then((result) => {
        console.log(result);
        if (result.data === "Success") {
          alert("This Email Already Exist.");
          navigate("/login");
          return;
        } else {
          // Show the role selection modal after successful registration
          setShowRoleModal(true);
        }
      });
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole); // Set the selected role

    // Save role to the database
    axios
      .post("http://localhost:5000/api/auth/set-role", {
        email,
        role: selectedRole, // Send role to be saved in the backend
      })
      .then(() => {
        alert(`You are successfully registered as a ${selectedRole}!`);
        setShowRoleModal(false); // Close the modal
        navigate("/login"); // Navigate to login page
      })
      .catch((err) => {
        console.error("Error saving role:", err);
        alert("There was an issue saving your role.");
      });
  };

  return (
    <div className="signup-container">
      <div className="logo">
        <img
          src="https://www.realproperty.pk/assets/4eda390c/rp-whit-n-green-logo.png"
          alt="RealProperty Logo"
        />
      </div>
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Sign Up</h2>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="full-width"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="full-width"
          required
        />
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="full-width"
            required
          />
          <span
            className="toggle-password-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "👁️‍🗨️" : "🙈"}
          </span>
        </div>
        <div className="password-input-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={cpassword}
            onChange={(e) => setCPassword(e.target.value)}
            className="full-width"
            required
          />
          <span
            className="toggle-password-icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "👁️‍🗨️" : "🙈"}
          </span>
        </div>
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="full-width"
          required
        />
        <button type="submit">Sign Up</button>
        <OAuth />
        <p className="login-prompt">
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Login
          </Link>
        </p>
      </form>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="role-modal-overlay">
          <div className="role-modal">
            <h3>What is your role?</h3>
            <div>
              <button onClick={() => handleRoleSelect("customer")}>
                Customer
              </button>
              <button onClick={() => handleRoleSelect("vendor")}>Vendor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
