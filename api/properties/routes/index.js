//index manifest file for all profile routes
const express = require('express');
const router = express.Router();

router.get('/', require('./getAllProperties'));
router.get('/:propertyId', require('./getProperty'));
router.patch('/:propertyId', require('./updateProperty'));

router.get('/:propertyId/units', require('./getUnits'));
router.get('/:propertyId/invoices', require('./getInvoices'));
router.get('/:propertyId/tenants', require('./getTenants'));

module.exports = router;