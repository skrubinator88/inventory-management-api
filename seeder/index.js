const express = require('express');
const router = express.Router();

router.get('/seedOwnersAndNeighborhoods', require('./seedOwnersAndNeighborhoods'));
router.get('/seedProperties', require('./seedProperties'));

module.exports = router;