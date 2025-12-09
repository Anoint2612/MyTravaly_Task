const express = require('express');
const router = express.Router();
const { createBooking, getBookings, cancelBooking, updateBookingStatus } = require('../controllers/bookings.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

router.post('/', protect, authorize('customer'), createBooking);
router.get('/', protect, getBookings);
router.put('/:id/cancel', protect, authorize('customer'), cancelBooking);
router.put('/:id/status', protect, authorize('manager'), updateBookingStatus);

module.exports = router;
