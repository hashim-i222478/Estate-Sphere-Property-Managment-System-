import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom"; // Import useLocation
import { Bar, Pie, Line } from "react-chartjs-2"; // Importing the Line chart
import "chart.js/auto";
import "../../Styles/vendorpages/vendrodashboard.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const VendorDashboard = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const vendorId = queryParams.get("vendorId");

  const [properties, setproperties] = useState([]);
  const [topReviewsproperties, setTopReviewsproperties] = useState([]);
  const [toppropertiesData, setToppropertiesData] = useState({
    labels: [],
    datasets: [],
  });
  const [topRatingsData, setTopRatingsData] = useState({
    labels: [],
    datasets: [],
  });
  const [averageRatingsData, setAverageRatingsData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/api/vendor/properties/get_properties/${vendorId}`
      )
      .then((response) => {
        console.log(response.data.properties);
        const propertiesData = response.data.properties || [];
        setproperties(propertiesData);
        calculatePerformanceMetrics(propertiesData);
        getTopPriceproperties(propertiesData);
        calculatewithMostReviews(propertiesData); // Calculate average ratings over time
      })
      .catch((error) => console.error("Error fetching properties:", error));
  }, []);

  const calculatePerformanceMetrics = (properties) => {
    if (!properties || properties.length === 0) return;

    // Top properties by Avgrating (Bar Chart)
    const topproperties = [...properties]
      .sort((a, b) => b.avgRatings - a.avgRatings)
      .slice(0, 5);

    setToppropertiesData({
      labels: topproperties.map((property) => property.title),
      datasets: [
        {
          label: "Top properties (avgRatings)",
          data: topproperties.map((property) => property.avgRatings),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    });

    // Top properties by Ratings (Pie Chart)
    const calculatewithMostArea = [...properties]
      .filter((property) => property.area)
      .sort((a, b) => b.avgratings - a.area)
      .slice(0, 5);

    setTopRatingsData({
      labels: calculatewithMostArea.map((property) => property.title),
      datasets: [
        {
          label: "Top properties by Area",
          data: calculatewithMostArea.map((property) => property.area),
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
        },
      ],
    });
  };

  const getTopPriceproperties = (properties) => {
    if (!properties || properties.length === 0) return;

    // Get Top 4 most reviewed properties
    const sortedByReviews = [...properties]
      .sort((a, b) => b.price - a.price)
      .slice(0, 4);
    setTopReviewsproperties(sortedByReviews);
  };

  const calculatewithMostReviews = (properties) => {
    // Sort properties by the number of reviews and pick the top 5
    const topProperties = [...properties]
      .sort((a, b) => b.reviews.length - a.reviews.length)
      .slice(0, 5);

    // Define pie chart colors (reuse for line chart lines)
    const pieChartColors = [
      "rgba(255, 99, 132, 0.6)",
      "rgba(54, 162, 235, 0.6)",
      "rgba(255, 206, 86, 0.6)",
      "rgba(75, 192, 192, 0.6)",
      "rgba(153, 102, 255, 0.6)",
    ];

    // Prepare data for the line chart
    const datasets = topProperties.map((property, index) => {
      // Aggregate reviews by date (cumulative count for each date)
      const reviewDates = {};
      property.reviews.forEach((review) => {
        const date = new Date(review.createdAt).toLocaleDateString();
        reviewDates[date] = (reviewDates[date] || 0) + 1;
      });

      // Convert review dates into sorted arrays for the line chart
      const sortedDates = Object.keys(reviewDates).sort(
        (a, b) => new Date(a) - new Date(b)
      );
      const cumulativeReviews = sortedDates.map((date, idx) =>
        sortedDates
          .slice(0, idx + 1)
          .reduce((acc, d) => acc + reviewDates[d], 0)
      );

      return {
        label: property.title,
        data: cumulativeReviews,
        fill: false,
        borderColor: pieChartColors[index], // Use pie chart colors for lines
        tension: 0.1, // Smooth line
      };
    });

    // Generate labels (x-axis) using the most reviewed property's dates
    const labels =
      topProperties[0]?.reviews
        .map((review) => new Date(review.createdAt).toLocaleDateString())
        .filter((value, index, self) => self.indexOf(value) === index) || [];

    // Set chart data
    setAverageRatingsData({
      labels: labels.sort((a, b) => new Date(a) - new Date(b)), // Sort labels by date
      datasets: datasets,
    });
  };

  return (
    <>
      <Header />
      <div className="multiproperties-dashboard">
        <div className="dashboard-summary">
          <h2>Top 4 Most Reviewed properties</h2>
          <div className="property-grid">
            {console.log("dsfghj")}
            {console.log(topReviewsproperties)}
            {topReviewsproperties.map((property) => (
              <div key={property._id} className="property-card">
                <div className="property-card-image-container">
                  <img
                    src={`http://localhost:5000/uploads/${property.picture}`}
                    alt={property.title}
                    className="property-card-image"
                  />
                </div>
                <div className="property-card-info">
                  <h3>{property.title}</h3>
                  <p>💲 Price: ${property.price}</p>
                  <p> Area: {property.area}</p>
                  <p>⭐ Reviews: {property.reviews.length}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="performance-reports">
          <h2>Performance Reports</h2>
          <div className="chart-container">
            <h3>Top properties (Average Rating)</h3>
            {toppropertiesData.datasets.length > 0 ? (
              <Bar data={toppropertiesData} />
            ) : (
              <p>No data available for top properties.</p>
            )}
          </div>

          {/* Line Chart for Average Ratings Over Time */}
          <div className="chart-container">
            <h3>Review Over Time (Top 5 properties)</h3>
            {averageRatingsData.datasets.length > 0 ? (
              <Line data={averageRatingsData} />
            ) : (
              <p>No data available for average ratings.</p>
            )}
          </div>

          <div className="chart-container">
            <h3>Top properties by Area</h3>
            {topRatingsData.datasets.length > 0 ? (
              <Pie data={topRatingsData} />
            ) : (
              <p>No data available for top-rated properties.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VendorDashboard;
