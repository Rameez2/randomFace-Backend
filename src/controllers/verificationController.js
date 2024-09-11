const bcrypt = require('bcryptjs');
const User = require("../models/userSchema");
const path = require('path');
const fs = require('fs');

// Verification Request
exports.verifyRequest = async (req, res) => {
    try {
        // Fetch user based on ID from request
        const user = await User.findById(req.user._id);

        if (user.verificationStatus === 'pending') {
            // status is pending
            return res.status(200).json({ msg: 'Verification request is already pending.' });
        } else if (user.verificationStatus === 'verified') {
            // status is already verified
            return res.status(200).json({ msg: 'User is already verified.' });
        }

        // process request

        // save the IdCard image
        if (req.file) {
            // create path for user IdentityCardImage
            const newfilePath = `http://localhost:3001/idImages/${req.file.filename}`;

            // Update user IdentityCardImage image path
            user.IdentityCardImage = newfilePath;
        }

        // Update the user's verification status to 'pending'
        user.verificationStatus = 'pending';
        await user.save(); 

        // response
        return res.status(200).json({ msg: 'Verification request submitted.' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server error');
    }
};


