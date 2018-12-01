const express = require('express');
const router = express.Router();
const authMiddleware = require('../../Helpers/authMiddleware');


router.get('/', authMiddleware, require('./getAllPropertyUnits'));
router.get('/:propertyUnitId', authMiddleware, require('./getPropertyUnit'));
router.patch('/:propertyUnitId', authMiddleware, require('./updatePropertyUnit'));

router.get('/:propertyUnitId/appointments', authMiddleware, require('./getAppointments'));
router.get('/:propertyUnitId/tenants', authMiddleware, require('./getTenants'));
// router.get('/:propertyOwnerId/invoices', authMiddleware, require('./getInvoices'));

router.post('/:propertyUnitId/appointments/new', authMiddleware, require('./newAppointment'));
router.delete('/:propertyUnitId/appointments/:appointmentId', authMiddleware, require('./deleteAppointment'));
router.patch('/:propertyUnitId/appointments/:appointmentId', authMiddleware, require('./updateAppointment'));

module.exports = router;