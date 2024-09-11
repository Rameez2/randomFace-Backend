const User = require('../models/userSchema');

exports.adminGetUsers = async (req, res) => {
    try {
        // get users
        console.log('admin get users');
        let users = await User.find();
        // response
        return res.status(201).json(users);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server error');
    }
}

