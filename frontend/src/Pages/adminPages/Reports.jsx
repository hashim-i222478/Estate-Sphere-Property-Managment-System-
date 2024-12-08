import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../Styles/adminpages/reports.css";
import AdminHeader from '../../components/AdminComponents/adminHeader';
import AdminFooter from '../../components/AdminComponents/adminFooter';

const Reports = () => {
  const [properties, setProperties] = useState([]);
  const [reports, setReports] = useState([]);

  // Fetch properties and booking stats
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertiesResponse = await axios.get('http://localhost:5000/api/vendor/properties/get_properties');
        const propertiesData = propertiesResponse.data;

        if (!propertiesData.length) {
          console.log('No properties with bookings found.');
          alert('No properties with bookings available.');
          return;
        }

        const bookingReports = await Promise.all(propertiesData.map(async (property) => {
          try {
            const response = await axios.get(`http://localhost:5000/api/booking/bookings/stats/${property._id}`);
            const chartUrl = await fetchChartData(response.data); // Now fetching chart for each property separately
            console.log('Booking data:', response.data);
            return {
                property,
                bookingData: response.data,
                chartUrl
            };
          } catch (error) {
            console.error(`Error fetching stats for property ${property._id}:`, error);
            return { // Return minimal data on error
              property,
              bookingData: [],
              chartUrl: null
            };
          }
        }));

        setReports(bookingReports);
      } catch (error) {
        console.error('Error fetching properties or booking reports:', error);
        alert('Failed to fetch data. Please check the console for more details.');
      }
    };

    fetchProperties();
  }, []);
  // Function to fetch chart data from QuickChart API
  const fetchChartData = async (bookingData) => {
    const chartConfig = {
      type: 'bar',
      data: {
        labels: bookingData.map(data => data._id), // Assuming `_id` is status
        datasets: [{
          label: 'Number of Bookings',
          data: bookingData.map(data => data.count),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };

    try {
      const response = await fetch(`https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`);
      return response.url;
    } catch (error) {
      console.error('Error fetching chart data:', error);
      return null; // Return null if there's an error
    }
  };

  return (
    <>
      <AdminHeader />
      <h1 className='heading'>Booking Reports</h1>
      <div className="reports-container">
        {reports.map((report, index) => (
          <div key={report.property._id} className="report">
            <h2>Property: {report.property.title}</h2>
            <p>Description: {report.property.description}</p>
            

            <div className="chart-container">
                <h3 className='chart-heading'>Booking Stats</h3>
              {report.chartUrl ? (
                <img src={report.chartUrl} alt="Booking Report Chart" />
              ) : (
                <p className="chart-loading">No Bookings for this property</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <AdminFooter />
    </>
  );
};

export default Reports;
