const Hotel = require('../models/hotel.model');

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
const Booking = require('../models/booking.model');

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
const getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find().lean();

        // Populate bookings count and revenue for each hotel
        const hotelsWithMetrics = await Promise.all(hotels.map(async (hotel) => {
            const bookings = await Booking.find({ hotelId: hotel._id });
            const bookingsCount = bookings.length;
            const revenue = bookings.reduce((acc, curr) => curr.status === 'confirmed' ? acc + curr.totalAmount : acc, 0);
            return { ...hotel, bookingsCount, revenue };
        }));

        res.status(200).json(hotelsWithMetrics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get hotel by ID
// @route   GET /api/hotels/:id
// @access  Public
const getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id).populate('createdBy', 'name email');
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.status(200).json(hotel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create hotel
// @route   POST /api/hotels
// @access  Private (Manager)
const createHotel = async (req, res) => {
    const { title, description, pricePerNight, images, amenities, address } = req.body;

    if (!title || !description || !pricePerNight || !address) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        const hotel = await Hotel.create({
            title,
            description,
            pricePerNight,
            images: images || [],
            amenities: amenities || [],
            address,
            createdBy: req.user.id,
        });
        res.status(201).json(hotel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private (Manager owner)
const updateHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // Check ownership
        if (hotel.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.status(200).json(updatedHotel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private (Manager owner)
const deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // Check ownership
        if (hotel.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await hotel.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload hotel images
// @route   POST /api/hotels/:id/images
// @access  Private (Manager)
const uploadHotelImages = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        if (hotel.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Assuming local upload for now, storing paths
        const newImages = req.files.map(file => file.path);
        hotel.images.push(...newImages);
        await hotel.save();

        res.status(200).json(hotel);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getHotels,
    getHotelById,
    createHotel,
    updateHotel,
    deleteHotel,
    uploadHotelImages
};
