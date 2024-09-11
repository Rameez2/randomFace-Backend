const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/fileUpload");

// GET /api/profile - Fetch user profile data
router.get('/profile', authMiddleware, profileController.getProfile);

// PUT /api/profile - Update user profile data
router.put('/profile', authMiddleware, upload.single('profileImage'), profileController.updateProfile);

module.exports = router;
