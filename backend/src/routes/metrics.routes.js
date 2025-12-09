const express = require('express');
const router = express.Router();
const { getManagerMetrics } = require('../controllers/bookings.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

router.get('/manager', protect, authorize('manager'), getManagerMetrics);

module.exports = router;
