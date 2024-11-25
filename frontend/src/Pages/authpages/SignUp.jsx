// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "../../Styles/authpages/SignUp.css";
// import axios from "axios";

// const SignUp = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [cpassword, setCPassword] = useState("");
//   const [phone, setphone] = useState("");
//   const navigate = useNavigate(); // Initialize useNavigate

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//     if (!passwordRegex.test(password)) {
//       alert(
//         "Password must meet the following requirements:\n" +
//           "- At least 8 characters long\n" +
//           "- Contain at least one uppercase letter\n" +
//           "- Contain at least one lowercase letter\n" +
//           "- Contain at least one number\n" +
//           "- Contain at least one special character"
//       );

//       return;
//     }

//     if (password !== cpassword) {
//       alert("Passwords do not match.");
//       return;
//     }

//     axios
//       .post("http://localhost:5000/api/auth/signup", {
//         name,
//         email,
//         password,
//         phone,
//       })
//       .then((result) => {
//         console.log(result);
//         if (result.data === "Success") {
//           alert("This Email Already Exist.");
//           navigate("/login");
//           return;
//         } else {
//           alert("You are successfully register!");
//           navigate("/login");
//         }
//       });
//   };

//   return (
//     <div className="signup-container">
//       <form onSubmit={handleSubmit} className="signup-form">
//         <h2>Sign Up</h2>
//         <input
//           type="text"
//           name="fullName"
//           placeholder="Full Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="full-width"
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="full-width"
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="full-width"
//           required
//         />
//         <input
//           type="password"
//           name="confirmPassword"
//           placeholder="Confirm Password"
//           value={cpassword}
//           onChange={(e) => setCPassword(e.target.value)}
//           className="full-width"
//           required
//         />
//         <input
//           type="text"
//           name="phone"
//           placeholder="Phone Number"
//           value={phone}
//           onChange={(e) => setphone(e.target.value)}
//           className="full-width"
//           required
//         />
//         <button type="submit">Sign Up</button>
//         <p className="login-prompt">
//           Already have an account?{" "}
//           <Link to="/login" className="login-link">
//             Login
//           </Link>{" "}
//         </p>
//       </form>
//     </div>
//   );
// };

// export default SignUp;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles/authpages/SignUp.css"; // Ensure this path matches where you place your SignUp.css
import axios from "axios";
import "../../Styles/responsive.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          alert("You are successfully registered!");
          navigate("/login");
        }
      });
  };

  return (
    <div className="signup-container">
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
            {showPassword ? "👁️" : "🙈"}
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
            {showConfirmPassword ? "👁️" : "🙈"}
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
        <p className="login-prompt">
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
