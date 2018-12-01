const express = require('express');
const router = express.Router();

router.get('/seedProperties', require('./seedProperties'));

module.exports = router;