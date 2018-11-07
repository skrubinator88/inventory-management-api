//index manifest file for all profile routes
const express = require('express');
const router = express.Router();
const authMiddleware = require('../../Helpers/authMiddleware');


router.get("/authorize", authMiddleware, require('./authorize'));
router.get('/token', authMiddleware, require('./token'));
router.get('/transfers', authMiddleware, require('./transfers'));
router.post('/payout', authMiddleware, require('./payout'));

module.exports = router;
