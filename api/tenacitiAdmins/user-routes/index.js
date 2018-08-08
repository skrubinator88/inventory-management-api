//index manifest file for all profile routes
import express from "express";

const router = express.Router();

router.get('/', require('./getAllUsers'));
router.get('/:userId', require('./getUser'));
router.patch('/:userId', require('./updateUser'));
router.patch('/:userId', require('./uploadProfilePhoto'));
//haircut routes
router.get('/:userId/haircuts', require('./getHaircuts'));
module.exports = router;