const User = require("../models/userSchema");

const adminMiddleware = async (req, res, next) => {
    try {
        // Fetch user from database
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        // Check if user has the admin role
        if (user.role.includes('admin')) {
            // User is an admin, proceed to the next middleware or route handler
            return next();
        } else {
            // User is not an admin
            return res.status(403).json({ msg: 'Access denied. Admins only.' });
        }
    } catch (error) {
        console.error('Error in checkAdmin middleware:', error);
        return res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = adminMiddleware;