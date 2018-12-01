//index manifest file for all profile routes
const express = require('express');

const router = express.Router();

router.get('/', require('./getAllUsers'));
router.get('/:userId', require('./getUser'));
router.patch('/:userId', require('./updateUser'));
router.patch('/:userId', require('./uploadProfilePhoto'));

router.get('/:userId/appointments', require('./getAppointments'));
router.get('/:userId/applications', require('./getApplicationRequests'));
router.post('/:userId/sendSupport', require('./sendSupport'));

module.exports = router;