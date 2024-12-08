// Assuming Express.js setup and you have imported necessary modules and schemas
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking'); // Make sure your path to Booking model is correct
const mongoose = require('mongoose'); // Add this line at the top if not already present
const Properties = require('../models/Properties');
// const mongoose = require("mongoose");

// const BookingSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Members", // Link to the Members schema
//       required: true,
//     },
//     property: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Property", // Link to the Properties schema
//       required: true,
//     },
//     startDate: {
//       type: Date,
//       required: true,
//     },
//     endDate: {
//       type: Date,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "cancelled"],
//       default: "pending",
//     },
//   },
//   {
//     timestamps: true, // Add createdAt and updatedAt timestamps
//   }
// );

// module.exports = mongoose.model("Booking", BookingSchema);

//make a route that just returns the property ids of the bookings
const Property = require('../models/Properties'); // adjust path as needed

// Route to get properties with at least one booking
router.get('/properties/with-bookings', async (req, res) => {
    try {
        // First, find all unique properties that have bookings
        const propertiesWithBookings = await Booking.distinct('property');

        if (!propertiesWithBookings.length) {
            return res.status(404).json({ message: 'No properties with bookings found' });
        }

        // Now fetch these properties details from the Property collection
        const properties = await Property.find({
            '_id': { $in: propertiesWithBookings }
        }).populate('owner', 'name'); // Example of populating owner info. Adjust field selection as needed.
        console.log('Properties with bookings:', properties);
        res.json(properties);
    } catch (error) {
        console.error('Failed to fetch properties with bookings:', error);
        res.status(500).json({ message: 'Error fetching properties with bookings', error });
    }
});

// Route to get properties present in the bookings
router.get('/bookings/properties', async (req, res) => {
  try {
    const properties = await Booking.distinct('property');
    res.json(properties);
  } catch (error) {
    console.error('Failed to fetch properties from bookings:', error);
    res.status(500).send('Server error while fetching properties from bookings');
  }
});

router.get('/bookings/stats/:propertyId', async (req, res) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).send('Invalid property ID');
  }

  try {
    const stats = await Booking.aggregate([
      { $match: { property: new mongoose.Types.ObjectId(propertyId) } },
      { $group: {
        _id: "$status",
        count: { $sum: 1 }
      }}
    ]);

    if (stats.length === 0) {
      return res.status(404).send({ message: 'No bookings found for this property' });
    }

    res.json(stats);
  } catch (error) {
    console.error('Error fetching booking statistics:', error);
    res.status(500).json({ message: 'Error fetching booking statistics', error });
  }
});

// Aggregation for booking stats by property ID
//const mongoose = require('mongoose'); // Add this line at the top if not already present

// router.get('/bookings/booking-stats/:propertyId', async (req, res) => {
//     try {
//         const { propertyId } = req.params;
//         //const objectId = mongoose.Types.ObjectId(propertyId); // Convert propertyId to ObjectId
//         const bookings = await Booking.aggregate([
//             {
//                 $match: { property: propertyId } // Match bookings by property ID
//             },
//             {
//                 $project: {
//                     year: { $year: '$startDate' }, // Extract year from startDate
//                     month: { $month: '$startDate' }, // Extract month from startDate
//                 }
//             },
//             {
//                 $group: {
//                     _id: { year: '$year', month: '$month' }, // Group by year and month
//                     count: { $sum: 1 } // Count the number of bookings in each month
//                 }
//             },
//             {
//                 $sort: { '_id.year': 1, '_id.month': 1 } // Sort by year and month
//             }
//         ]);

//         // Format the results to make them easier to use in charts
//         const formattedData = bookings.map((booking) => ({
//             month: new Date(0, booking._id.month - 1).toLocaleString('en-US', { month: 'long' }),
//             year: booking._id.year,
//             count: booking.count
//         }));
//         console.log('Booking stats by property ID:', formattedData);
//         res.json({ bookings: formattedData });
//     } catch (error) {
//         console.error('Error aggregating booking stats by property ID:', error);
//         res.status(500).json({ message: 'Error fetching booking stats by property ID' });
//     }
// });


// Route to get bookings by property ID
router.get('/bookings/by-property/:propertyId', async (req, res) => {
    try {
        const bookings = await Booking.find({ property: req.params.propertyId })
                                       .populate('user') // Populate to fetch user details
                                       .populate('property'); // Optionally populate property if needed
        res.json(bookings);
    } catch (error) {
        console.error('Failed to fetch bookings:', error);
        res.status(500).send('Server error while fetching bookings');
    }
});

// Route to get performance metrics for a property
router.get('/analytics/property-performance/:propertyId', async (req, res) => {
    try {
        const { propertyId } = req.params;
        const bookings = await Booking.find({ property: propertyId });

        const totalBookings = bookings.length;

        let totalDuration = 0;
        bookings.forEach(booking => {
            const start = new Date(booking.startDate);
            const end = new Date(booking.endDate);
            const duration = (end - start) / (1000 * 60 * 60 * 24); // duration in days
            totalDuration += duration;
        });
        const averageDuration = totalBookings > 0 ? totalDuration / totalBookings : 0;

        res.json({
            totalBookings,
            averageDuration
        });
    } catch (error) {
        console.error('Failed to fetch property performance:', error);
        res.status(500).send('Server error while fetching property performance');
    }
});

module.exports = router;
