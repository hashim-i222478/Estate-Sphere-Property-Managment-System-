import React from "react";
import Navbar from "../../components/Customercomponents/Navbar"; // Path to Navbar
import Footer from "../../components/Customercomponents/footer"; // Path to Footer
import "./LandingPage.css"; // Include the CSS file for styling
import backgroundImage from "../../assets/a.webp"; // Path to your background image
import hashim from "../../assets/hpic.jpg"; // Path to image
import shoukat from "../../assets/mpic.jpg";
import areeba from "../../../../backend/uploads/a.jpg";
const CustomerLandingpage = () => {
  const customerStories = [
    {
      id: 1,
      name: "Hashim ahmad",
      image: hashim,
      story: "PropertyZone helped me find my dream home effortlessly!",
    },
    {
      id: 2,
      name: "Shoukat khan",
      image: shoukat,
      story: "Amazing service and user-friendly platform.",
    },
    {
      id: 3,
      name: "Areeba nisar khan",
      image: areeba,
      story: "Highly recommend PropertyZone for anyone looking for properties.",
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${backgroundImage})` , backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', width: '100vw', height: '100vh'
        }}
      >
        <div className="hero-container">
          <h1>
            We've Helped Over <span>1 Lakh Customers</span> Find Their Dream Properties!
          </h1>
          <p
          style={{color: "black" , fontSize: "1.5rem" , fontWeight: "bold" , textAlign: "center" , padding: "10px", backgroundColor: "lightgoldenrodyellow" , borderRadius: "10px" , width: "50%" , margin: "auto"
            
          }}>
            At PropertyZone, we’re dedicated to making your property search seamless and hassle-free.
          </p>
          {/*apply the action to shift to View property page */}
          <button className="btn-primary" style={{marginTop: "80px"}} onClick={() => window.location.href = "/ViewProperties"}
          >Explore Properties Now</button>
        </div>
      </section>

      {/* Customer Stories Section */}
      <section className="customer-stories">
        <div className="container">
          <h2>What Our Customers Say</h2>
          <div className="grid">
            {customerStories.map((customer) => (
              <div key={customer.id} className="card">
                <img src={customer.image} alt={customer.name} className="customer-image" />
                <h3>{customer.name}</h3>
                <p>{customer.story}</p>
              </div>
            ))}
          </div>
          <div className="cta">
            <button className="btn-secondary">Get Customer Stories</button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default CustomerLandingpage;
