const User = require('../models/userSchema');

// Function to check user verification status
const checkUserStatus = async (userId) => {
    try {
        const user = await User.findById(userId); // Fetch user based on ID
        if (!user) {
            throw new Error('User not found');
        }

        return user.verificationStatus;
    } catch (error) {
        throw new Error(`Error fetching user status: ${error.message}`);
    }
};

module.exports = {
    checkUserStatus
};
