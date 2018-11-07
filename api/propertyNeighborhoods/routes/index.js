//index manifest file for all profile routes
const express = require('express');
const router = express.Router();

router.get('/', require('./getAllPropertyNeighborhoods'));
router.get('/:propertyOwnerId', require('./getPropertyOwner'));
router.patch('/:propertyOwnerId', require('./updatePropertyOwner'));
//haircut routes
router.get('/:propertyOwnerId/properties', require('./getProperties'));
router.get('/:propertyOwnerId/admins', require('./getAdmins'));
router.get('/:propertyOwnerId/invoices', require('./getInvoices'));

router.post('/:propertyOwnerId/invoices/upload', require('./upload'));
module.exports = router;