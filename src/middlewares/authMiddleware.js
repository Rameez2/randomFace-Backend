const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    
    // Get token from the Authorization header
    const authHeader = req.header('Authorization');
    
    // Check if Authorization header exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Extract the token (everything after 'Bearer ')
    const token = authHeader.split(' ')[1];

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verifies the token with the secret

        // Attach the user from the decoded token to the request object
        req.user = decoded;

        // Call next middleware/controller
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware;