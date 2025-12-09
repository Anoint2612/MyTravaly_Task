const mongoose = require('mongoose');

const hotelSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    pricePerNight: { type: Number, required: true }, // Base price (usually for 2 guests)
    guestRates: {
        2: { type: Number },
        4: { type: Number },
        6: { type: Number }
    },
    images: [String],
    amenities: [String],
    address: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
