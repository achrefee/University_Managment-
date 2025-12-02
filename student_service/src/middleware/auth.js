const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token
 * Extracts token from Authorization header and verifies it
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token is required'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired'
            });
        }
        return res.status(403).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

module.exports = authenticateToken;
