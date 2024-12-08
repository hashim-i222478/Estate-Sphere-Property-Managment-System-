import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Customercomponents/Navbar";
import Footer from "../../components/Customercomponents/footer";
import Slider from "react-slick";
import "./LandingPage.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import backgroundImage from "../../assets/a.webp";
import hashim from "../../assets/hpic.jpg";
import shoukat from "../../assets/mpic.jpg";
import areeba from "../../../../backend/uploads/a.jpg";
import propimg from "./prop.jpg";

const CustomerLandingpage = () => {
  const [topProperties, setTopProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const customerStories = [
    {
      id: 1,
      name: "Hashim Ahmad",
      image: hashim,
      story: "PropertyZone helped me find my dream home effortlessly!",
    },
    {
      id: 2,
      name: "Shoukat Khan",
      image: shoukat,
      story: "Amazing service and user-friendly platform.",
    },
    {
      id: 3,
      name: "Areeba Nisar Khan",
      image: areeba,
      story: "Highly recommend PropertyZone for anyone looking for properties.",
    },
  ];

  // Fetch top-rated properties
  const fetchTopProperties = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/properties/top-rated", {
        params: { limit: 5 },
      });
      setTopProperties(response.data.properties);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching top properties:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopProperties();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 768, // For tablets and mobile devices
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <Navbar />
      
      {/* Top Properties Slider */}
      <section className="top-properties-slider">
        <h2 className="slider-heading">Top Rated Properties</h2>
        {loading ? (
          <p className="loading-message">Loading top properties...</p>
        ) : (
          <Slider {...sliderSettings}>
            {topProperties.map((property) => (
              <div
                key={property._id}
                className="property-slide"
                onClick={() => (window.location.href = `/ViewProperties`)} // Redirect to property view
              >
                <img
                  src={propimg}
                  alt={property.title}
                  className="slider-image"
                />
                <p className="slider-title">{property.title}</p>
                <p className="slider-price">${property.price}</p>
                <p className="slider-rating">Rating: {property.avgRatings} / 5</p>
              </div>
            ))}
          </Slider>
        )}
      </section>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-container">
            <h1>
              We've Helped Over <span>1 Lakh Customers</span> Find Their Dream Properties!
            </h1>
            <p className="hero-message">
              At PropertyZone, we’re dedicated to making your property search seamless and hassle-free.
            </p>
            <button
              className="btn-primary"
              onClick={() => (window.location.href = "/ViewProperties")}
            >
              Explore Properties Now
            </button>
          </div>
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
        </div>
      </section>

      <Footer />
    </>
  );
};

export default CustomerLandingpage;
