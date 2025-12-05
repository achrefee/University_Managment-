/**
 * Middleware to check if user has ADMIN role
 * Must be used after authenticateToken middleware
 */
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    // Check if user has ADMIN role
    // The role is stored in the JWT token from the OAuth service
    // OAuth service may return 'ADMIN' or 'ROLE_ADMIN' depending on context
    const userRole = req.user.role;

    if (userRole !== 'ROLE_ADMIN' && userRole !== 'ADMIN') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }

    next();
};

module.exports = requireAdmin;
