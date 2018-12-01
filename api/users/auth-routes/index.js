//index manifest file for all profile routes
const express = require('express');
const router = express.Router();

router.post("/new", require('./new'));
router.post('/login', require('./login'));
router.get('/logout', require('./logout'));
router.get('/verifyEmail/:token', require('./verifyEmail'));
router.get('/sendPasswordReset/:email', require('./sendPasswordReset'));

module.exports = router;
