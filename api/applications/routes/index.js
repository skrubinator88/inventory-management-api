const express = require('express');
const router = express.Router();
const authMiddleware = require('../../Helpers/authMiddleware');

router.delete('/:applicationId', authMiddleware, require('./deleteApplication'));
router.patch('/:applicationId', authMiddleware, require('./updateApplication'));

module.exports = router;