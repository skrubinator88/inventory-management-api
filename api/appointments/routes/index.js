const express = require('express');
const router = express.Router();
const authMiddleware = require('../../Helpers/authMiddleware');

router.delete('/:appointmentId', authMiddleware, require('./deleteAppointment'));
router.patch('/:appointmentId', authMiddleware, require('./updateAppointment'));

module.exports = router;