const axios = require('axios');

// API Gateway URL - all inter-service communication goes through the gateway
const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:8080';

// Gateway secret - must match the secret configured in the API Gateway
const GATEWAY_SECRET = process.env.GATEWAY_SECRET || 'university-gateway-2024';

/**
 * Middleware to verify requests come through the API Gateway
 * Checks for X-Gateway-Request and X-Gateway-Secret headers
 * Note: Express lowercases all header names automatically
 */
const verifyGatewayRequest = (req, res, next) => {
    // Express converts headers to lowercase
    const gatewayRequest = req.headers['x-gateway-request'];
    const gatewaySecret = req.headers['x-gateway-secret'];

    // Debug logging
    console.log('Gateway headers received:', {
        'x-gateway-request': gatewayRequest,
        'x-gateway-secret': gatewaySecret ? '[PRESENT]' : '[MISSING]'
    });

    if (gatewayRequest !== 'true' || gatewaySecret !== GATEWAY_SECRET) {
        return res.status(403).json({
            success: false,
            message: 'Direct access not allowed. Use the API Gateway.'
        });
    }

    next();
};

/**
 * Middleware to verify JWT token
 * Calls OAuth service via the API Gateway for token validation
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
        // Call OAuth service via Gateway to validate token
        const response = await axios.get(`${GATEWAY_URL}/api/auth/validate?token=${token}`);

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

module.exports = { authenticateToken, verifyGatewayRequest };
