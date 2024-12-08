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
import CustomerLandingpage from "./customerpages/CustomerLandingpage";
import ViewProperties from "./customerpages/ViewProperties";
import BookedProperties from "./customerpages/BookedProperties";
import FavoritesPage from "./customerpages/FavoritesPage";
import MaintenanceRequestModal from "./customerpages/MaintenanceRequestModal";
import CustomerProfile from "./customerpages/CustomerProfile";
import AboutUs from "./customerpages/AboutUs";
import ContactUs from "./customerpages/ContactUs";
import PaymentPage from "./customerpages/PaymentPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerLandingpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/vendorlandingpage" element={<VendorLandingpage />} />
        <Route path="/vendorproperty" element={<Vendorproperty />} />
        <Route path="/vendorprofile" element={<VendorProfile />} />
        <Route path="/customerlandingpage" element={<customerLandingpage />} />
        <Route path="/viewproperties" element={<ViewProperties />} />
        <Route path="/bookedproperties" element={<BookedProperties />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/maintenance/:propertyId" element={<MaintenanceRequestModal />} />
        <Route path="/customerprofile" element={<CustomerProfile />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>

    </BrowserRouter>
  );
}
export default App;
