const express = require('express');
const router = express.Router();
const { adminGetUsers } = require("../controllers/adminControllers")
const authMiddleware = require("../middlewares/authMiddleware")
const adminMiddleware = require("../middlewares/adminMiddleware");

// POST /api/auth/register
router.get('/users',authMiddleware,adminMiddleware, adminGetUsers);


module.exports = router;