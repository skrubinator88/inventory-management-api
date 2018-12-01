//index manifest file for all profile routes
const express = require('express');
const router = express.Router();
const authMiddleware = require('../../Helpers/authMiddleware');


router.get("/ephemeral_keys", authMiddleware, require('./ephemeral_keys'));

module.exports = router;
