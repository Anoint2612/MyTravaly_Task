const Booking = require('../models/booking.model');
const Hotel = require('../models/hotel.model');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private (Customer)
const createBooking = async (req, res) => {
    const { hotelId, checkIn, checkOut, guests } = req.body;

    if (!hotelId || !checkIn || !checkOut) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const nights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);

        if (nights <= 0) {
            return res.status(400).json({ message: 'Invalid dates' });
        }

        let price = hotel.pricePerNight;
        if (guests && hotel.guestRates) {
            if (guests <= 2) price = hotel.guestRates['2'] || price;
            else if (guests <= 4) price = hotel.guestRates['4'] || price;
            else price = hotel.guestRates['6'] || price;
        }

        const totalAmount = nights * price;

        const booking = await Booking.create({
            userId: req.user.id,
            hotelId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            nights,
            totalAmount,
            status: 'pending',
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get bookings
// @route   GET /api/bookings
// @access  Private (Customer/Manager)
const getBookings = async (req, res) => {
    try {
        if (req.user.role === 'customer') {
            const bookings = await Booking.find({ userId: req.user.id }).populate('hotelId');
            res.status(200).json(bookings);
        } else if (req.user.role === 'manager') {
            // Find hotels created by manager
            const hotels = await Hotel.find({ createdBy: req.user.id });
            const hotelIds = hotels.map(h => h._id);

            const bookings = await Booking.find({ hotelId: { $in: hotelIds } }).populate('hotelId').populate('userId', 'name email');
            res.status(200).json(bookings);
        } else {
            res.status(400).json({ message: 'Invalid role' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Customer)
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // Check if check-in date is in future
        if (new Date(booking.checkIn) <= new Date()) {
            return res.status(400).json({ message: 'Cannot cancel past or ongoing bookings' });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Manager)
const updateBookingStatus = async (req, res) => {
    const { status } = req.body;
    if (!['confirmed', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const booking = await Booking.findById(req.params.id).populate('hotelId');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Verify manager owns the hotel
        if (booking.hotelId.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this booking' });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get manager metrics
// @route   GET /api/metrics/manager
// @access  Private (Manager)
const getManagerMetrics = async (req, res) => {
    try {
        const hotels = await Hotel.find({ createdBy: req.user.id });
        const hotelIds = hotels.map(h => h._id);

        const bookings = await Booking.find({ hotelId: { $in: hotelIds } });

        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((acc, curr) => curr.status === 'confirmed' ? acc + curr.totalAmount : acc, 0);
        const activeBookings = bookings.filter(b => ['confirmed', 'pending'].includes(b.status)).length;

        const recentBookings = await Booking.find({ hotelId: { $in: hotelIds } })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('hotelId', 'title')
            .populate('userId', 'name');

        res.status(200).json({
            totalBookings,
            totalRevenue,
            activeBookings,
            recentBookings
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createBooking,
    getBookings,
    cancelBooking,
    updateBookingStatus,
    getManagerMetrics
};
