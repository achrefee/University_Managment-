const axios = require('axios');

/**
 * Middleware to verify JWT token
 * Extracts token from Authorization header and verifies it via OAuth service
 */
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token is required'
        });
    }

    try {
        // Call OAuth service to validate token
        const response = await axios.get(`http://localhost:8081/api/auth/validate?token=${token}`);

        // If successful, the response data contains the user info
        req.user = response.data;
        next();
    } catch (error) {
        // OAuth service returns 400 if token is invalid
        if (error.response && error.response.status === 400) {
            return res.status(403).json({
                success: false,
                message: 'Invalid token'
            });
        }

        console.error('Token validation error:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        } else if (error.request) {
            console.error('No response received from OAuth service');
        }

        return res.status(500).json({
            success: false,
            message: 'Internal server error during authentication'
        });
    }
};

module.exports = authenticateToken;
