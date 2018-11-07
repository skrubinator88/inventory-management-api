//index manifest file for all profile routes
const express = require('express');
const router = express.Router();
const authMiddleware = require('../../Helpers/authMiddleware');

router.get('/', require('./getAllPropertyOwners'));
router.get('/:propertyOwnerId', authMiddleware, require('./getPropertyOwner'));
router.patch('/:propertyOwnerId', authMiddleware, require('./updatePropertyOwner'));
//haircut routes
router.get('/:propertyOwnerId/properties', authMiddleware, require('./getProperties'));
router.get('/:propertyOwnerId/admins', authMiddleware, require('./getAdmins'));
router.get('/:propertyOwnerId/invoices', authMiddleware, require('./getInvoices'));

router.post('/:propertyOwnerId/invoices/upload', authMiddleware, require('./upload'));

router.post
module.exports = router;