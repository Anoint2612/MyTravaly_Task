const express = require('express');
const router = express.Router();
const { getHotels, getHotelById, createHotel, updateHotel, deleteHotel, uploadHotelImages } = require('../controllers/hotels.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage });

router.get('/', getHotels);
router.get('/:id', getHotelById);
router.post('/', protect, authorize('manager'), createHotel);
router.put('/:id', protect, authorize('manager'), updateHotel);
router.delete('/:id', protect, authorize('manager'), deleteHotel);
router.post('/:id/images', protect, authorize('manager'), upload.array('images'), uploadHotelImages);

module.exports = router;
