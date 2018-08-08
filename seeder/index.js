const express = require('express');
const router = express.Router();

router.get('/:city', require('./seed_properties'));

module.exports = router;