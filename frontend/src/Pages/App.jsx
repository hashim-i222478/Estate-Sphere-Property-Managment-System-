import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import SignUp from "./authpages/SignUp";
import Login from "./authpages/Login";
import ForgotPassword from "./authpages/ForgotPassword";
import Verification from "./authpages/Verification";
import ResetPassword from "./authpages/ResetPassword";
import VendorLandingpage from "./vendorpages/VendorLandingpage";
import Vendorproperty from "./vendorpages/Vendorproperty";
import VendorProfile from "./vendorpages/VendorProfile";
import AdminLandingpage from "./adminPages/AdminLandingpage";
import AdminProfile from "./adminPages/AdminProfile";
import ManageProperty from "./adminPages/ManageProperty";
import ManageUserProfile from "./adminPages/ManageUserProfile";
import UserForm from "../components/AdminComponents/UserForm";
import ManageReviews from "./adminPages/ManageReviews";
import PropertyAnalytics from "./adminPages/PropertyAnalytics";
import Reports from "./adminPages/Reports";
import About from "./adminPages/About";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/vendorlandingpage" element={<VendorLandingpage />} />
        <Route path="/vendorproperty" element={<Vendorproperty />} />
        <Route path="/vendorprofile" element={<VendorProfile />} />
        <Route path="/adminLandingPage" element={<AdminLandingpage />} />
        <Route path="/adminprofile" element={<AdminProfile />} />
        <Route path="/propertymanagement" element={<ManageProperty />} />
        <Route path="/usermanagement" element={<ManageUserProfile />} />
        <Route path="/userform" element={<UserForm />} />
        <Route path="/Reviews" element={<ManageReviews />} />
        <Route path="/PropertyAnalytics" element={<PropertyAnalytics />} />
        <Route path="/Reports" element={<Reports />} />
        <Route path="/about" element={<About />} />

      </Routes>
    </BrowserRouter>
  );
}
export default App;
