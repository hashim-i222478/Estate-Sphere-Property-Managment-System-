import { Button } from "flowbite-react";
import React, { useState } from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const OAuth = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const auth = getAuth(app);
  const [password, setPassword] = useState("12345678");

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);

      const user = result.user;

      axios
        .post("http://localhost:5000/api/auth/signup", {
          name: user.displayName,
          email: user.email,
          password,
          phone: user.phoneNumber,
        })
        .then((result) => {
          console.log(result);
          if (result.data === "Success") {
            alert("This Email Already Exist.");
            navigate("/login");
            return;
          } else {
            const isConfirmed = window.confirm(
              "You want to register as Vendor"
            );
            if (isConfirmed) {
              axios
                .post("http://localhost:5000/api/auth/set-role", {
                  email: user.email,
                  role: "vendor", // Send role to be saved in the backend
                })
                .then(() => {
                  alert(`You are successfully registered as a vendor!`);
                  navigate("/login"); // Navigate to login page
                })
                .catch((err) => {
                  console.error("Error saving role:", err);
                  alert("There was an issue saving your role.");
                });
            } else {
              alert(`You are successfully registered as a customer!`);
              navigate("/login"); // Navigate to login page
            }
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      onClick={handleGoogleClick}
      type="button"
      gradientDuoTone="GreenToGrey"
      outline
    >
      <AiFillGoogleCircle />
      Continue with Google
    </Button>
  );
};
