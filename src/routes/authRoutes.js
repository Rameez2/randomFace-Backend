const express = require('express');
const router = express.Router();
const { register, login } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware")

// POST /api/auth/register
router.post('/login', login);

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/logout - Logout route
router.post('/logout', authMiddleware, (req, res) => {
    // Simply respond with success message as the client should delete the token
    res.status(200).json({ msg: 'Logged out successfully' });
});

module.exports = router;