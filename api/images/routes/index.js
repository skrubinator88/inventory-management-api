const express = require('express');
const router = express.Router();
const authMiddleware = require('../../Helpers/authMiddleware');

router.delete('/:imgId', authMiddleware, require('./deleteImage'));

module.exports = router;