const bcrypt = require('bcryptjs');
const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            fullName,
            email,
            password: hashedPassword
        });

        // save user
        await user.save();

        // response
        return res.status(201).json({ msg: 'User registered successfully' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server error');
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Sign the JWT token directly with the payload
        const token = jwt.sign(
            { _id: user._id,verificationStatus:user.verificationStatus },  // Use the user ID directly inside the payload
            process.env.JWT_SECRET_KEY,  // Secret key from environment variables
            { expiresIn: process.env.TOKEN_EXPIRE_TIME }  // Token expiration time
        );

        // Send the token as a response
        return res.json({ token });
    } catch (error) {
        console.error(error.message);
        // server error
        return res.status(500).send('Server error');
    }
}
