//index manifest file for all profile routes
const express = require('express');
const authMiddleware = require('../../Helpers/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, require('./getAllUsers'));
router.get('/:userId', authMiddleware, require('./getUser'));
router.patch('/:userId', authMiddleware, require('./updateUser'));
router.patch('/:userId', authMiddleware, require('./uploadProfilePhoto'));

router.get('/:userId/appointments', authMiddleware, require('./getAppointments'));
router.get('/:userId/applications', authMiddleware, require('./getApplicationRequests'));
router.post('/:userId/sendSupport', authMiddleware, require('./sendSupport'));

module.exports = router;