//index manifest file for all profile routes
const express = require('express');
const router = express.Router();

router.post("/new", require('./new'));
router.post('/login', require('./login'));
router.get('/logout', require('./logout'));

module.exports = router;
