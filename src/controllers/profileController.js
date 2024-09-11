const bcrypt = require('bcryptjs');
const User = require("../models/userSchema");
const path = require('path');
const fs = require('fs');

// Get profile data
exports.getProfile = async (req, res) => {
    try {
        
        // Find the user by ID from the token payload
        const user = await User.findById(req.user._id).select('-password'); // Exclude password field
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server error');
    }
};

// Update profile data
exports.updateProfile = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        
        // Find the user by ID from the token payload
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if current password and new password are provided
        if (currentPassword && newPassword) {  

            // Check if the current password matches
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Current password is incorrect' });
            }
    
            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            // save new password
            await user.save();
            return res.status(200).json({ msg: 'Password updated successfully' });
        }

        // Handle file upload
        if (req.file) {

            // get the old profileImagePath 
            const oldImagePath = path.join(__dirname, '../public/uploads', path.basename(user.profileImage));
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.error('Error deleting old image:', err);
                }
            });
            // create new path for user
            const newfilePath = `http://localhost:3001/uploads/${req.file.filename}`;

            // Update user profile image path
            user.profileImage = newfilePath;
        }

        // save profile image path
        await user.save();
        return res.status(200).json({ msg: 'Image updated successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
};
