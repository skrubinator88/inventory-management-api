//index manifest file for all profile routes
const express = require('express');
const router = express.Router();
const authMiddleware = require('../../Helpers/authMiddleware');

router.get('/', require('./getAllProperties'));
router.get('/propertyAdmin/:propertyAdminId', authMiddleware, require('./getPropertyAdmin'));
router.get('/:propertyId', authMiddleware, require('./getProperty'));
router.patch('/:propertyId', authMiddleware, require('./updateProperty'));
router.patch('/:propertyId', authMiddleware, require('./deleteProperty'));
router.post('/new', authMiddleware, require('./newProperty'));

router.get('/:propertyId/units', authMiddleware, require('./getUnits'));
router.post('/:propertyId/units/new', authMiddleware, require('./newUnit'));

router.get('/:propertyId/invoices', authMiddleware, require('./getInvoices'));
router.get('/:propertyId/inquiryLogs', authMiddleware, require('./getInquiryLogs'));
router.get('/:propertyId/tenants', require('./getTenants'));
router.get('/:propertyId/applications', require('./getApplications'));

router.post('/:propertyId/applicationRequest', authMiddleware, require('./applicationRequest'));

module.exports = router;