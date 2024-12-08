import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "../../Styles/adminpages/propertyanalytics.css";
import AdminFooter from '../../components/AdminComponents/adminFooter';
import AdminHeader from '../../components/AdminComponents/adminHeader';

import BookingsModel from './BookingsModel';

const PropertyAnalytics = () => {
    const [properties, setProperties] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const [sortField, setSortField] = useState('price'); // 'price' or 'rating'
    const [filterTitle, setFilterTitle] = useState('');
    const [filterAddress, setFilterAddress] = useState('');
    const [bookings, setBookings] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [currentBookings, setCurrentBookings] = useState([]);
    const [showPerformanceModal, setShowPerformanceModal] = useState(false);
    const [performanceData, setPerformanceData] = useState(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/vendor/properties/get_properties');
                const propertiesWithCoords = await Promise.all(response.data.map(async (property) => {
                    const coords = await fetchCoordinates(property.address);
                    return { ...property, coordinates: coords };
                }));
                setProperties(propertiesWithCoords);
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };

        fetchProperties();
    }, []);

    const fetchCoordinates = async (address) => {
        const params = {
            q: address,
            format: 'json',
            limit: 1,
            email: "your-email@example.com" // Replace with your actual email address
        };
        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', { params });
            if (response.data[0]) {
                const { lat, lon } = response.data[0];
                return { lat, lon };
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
        }
        return { lat: 0, lon: 0 };
    };

    const handleSort = (field) => {
        setSortField(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const filteredAndSortedProperties = properties
        .filter(property => property.title.toLowerCase().includes(filterTitle.toLowerCase()) && property.address.toLowerCase().includes(filterAddress.toLowerCase()))
        .sort((a, b) => {
            const valueA = a[sortField];
            const valueB = b[sortField];
            if (sortOrder === 'asc') {
                return valueA - valueB;
            } else {
                return valueB - valueA;
            }
        });
        
        const fetchBookingsForProperty = async (propertyId) => {
            try {
                const response = await axios.get(`http://localhost:5000/api/booking/bookings/by-property/${propertyId}`);
                setCurrentBookings(response.data);
                setShowModal(true); // Open modal on successful data fetch
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setShowModal(false);
            }
        };
    
        const closeModal = () => {
            setShowModal(false);
        };
    
 const fetchPerformanceData = async (propertyId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/booking/analytics/property-performance/${propertyId}`);
            setPerformanceData(response.data);
            setShowPerformanceModal(true);
        } catch (error) {
            console.error('Error fetching performance data:', error);
        }
    };

    const closePerformanceModal = () => {
        setShowPerformanceModal(false);
    };
    return (
        <>
        <AdminHeader />
        <div>
            <h1 className="property_heading">Property Analytics</h1>
            <p className="property_para">Here you can view the properties and their locations on the map.
                You can also view the booking insights of the properties.
            </p>
            <div className='filter-sort-controls'>
                <input
                    type="text"
                    placeholder="Filter by title..."
                    value={filterTitle}
                    onChange={(e) => setFilterTitle(e.target.value)}
                    style={{ margin: "10px", padding: "8px" }}
                />
                <input
                    type="text"
                    placeholder="Filter by address..."
                    value={filterAddress}
                    onChange={(e) => setFilterAddress(e.target.value)}
                    style={{ margin: "10px", padding: "8px" }}
                />
                <button onClick={() => handleSort('price')} style={{ padding: "10px" }}>
                    Sort by Price ({sortOrder === 'asc' && sortField === 'price' ? 'Lowest First' : 'Highest First'})
                </button>
                <button onClick={() => handleSort('avgRatings')} style={{ padding: "10px" }}>
                    Sort by Rating ({sortOrder === 'asc' && sortField === 'avgRatings' ? 'Lowest First' : 'Highest First'})
                </button>
            </div>
            <div className="properties_container">
                {filteredAndSortedProperties.map((property) => (
                    <div key={property._id} className="property_card">
                        <h3>{property.title}</h3>
                        <p>{property.description}</p>
                        <p><strong>Address:</strong> {property.address}</p>
                        <p><strong>Price:</strong> ${property.price}</p>
                        <p><strong>Rating:</strong> {property.avgRatings || 'Not Rated'}</p>
                        <button onClick={() => fetchBookingsForProperty(property._id)}>View Bookings</button>
                        <button onClick={() => fetchPerformanceData(property._id)}>View Performance</button>
                        {property.coordinates && (
                            <MapContainer
                                center={[property.coordinates.lat, property.coordinates.lon]}
                                zoom={13}
                                scrollWheelZoom={false}
                                style={{ height: '200px', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Marker position={[property.coordinates.lat, property.coordinates.lon]}>
                                    <Popup>
                                        {property.title} - ${property.price}
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        )}
                         {showModal && (
                <BookingsModel onClose={closeModal}>
                    <h2>Booking Details</h2>
                    {currentBookings.length > 0 ? currentBookings.map(booking => (
                        <div key={booking._id}>
                            <h3>{booking.property.title}</h3>
                            <p>Booking by: {booking.user.name}</p>
                            <p>Dates: {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</p>
                            <p>Status: {booking.status}</p>
                        </div>
                    )) : <p>No bookings found for this property.</p>}
                </BookingsModel>

                
            )}
             {showPerformanceModal && (
            <BookingsModel onClose={closePerformanceModal}>
                <h2>Performance Details</h2>
                <p>Total Bookings: {performanceData?.totalBookings}</p>
                <p>Average Booking Duration: {performanceData?.averageDuration.toFixed(2)} days</p>
            </BookingsModel>
        )}
                    </div>
                ))}
            </div>
        </div>
        <AdminFooter />
        </>
    );
};

export default PropertyAnalytics;
