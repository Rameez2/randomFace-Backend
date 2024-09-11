const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const verifyController = require("../controllers/verificationController");
const upload = require("../middlewares/fileUpload");

// GET /api/profile - Fetch user profile data
router.post('/verify-request', authMiddleware, upload.single('IdentityCardImage'), verifyController.verifyRequest);


module.exports = router;