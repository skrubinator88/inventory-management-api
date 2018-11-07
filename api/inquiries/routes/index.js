const express = require('express');
const router = express.Router();
const authMiddleware = require('../../Helpers/authMiddleware');


router.get('/', require('./getAllInquiryLogs'));
router.get('/:inquiryLogId', require('./getInquiryLog'));
router.post('/new', require('./newInquiryLog'));
router.delete('/:inquiryLogId', require('./deleteInquiryLog'));

router.post('/inquiries/new', require('./newInquiry'));

module.exports = router;