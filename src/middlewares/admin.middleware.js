const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');

const verifyAdminToken = async (req, res, next) => {
    try {
        let token;
        
        // Extract token from header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'my-super-secret-jwt-key');

        // Check if admin exists in DB
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Not authorized, admin not found' });
        }

        // Check if account is active
        if (!admin.isActive) {
            return res.status(403).json({ success: false, message: 'Account is disabled' });
        }

        // Check for admin roles
        if (admin.role !== 'admin' && admin.role !== 'superadmin') {
            return res.status(403).json({ success: false, message: 'Forbidden, require admin privileges' });
        }

        // Attach admin to request object for use in controllers
        req.admin = admin;
        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        return res.status(401).json({ success: false, message: 'Not authorized, token failed or expired' });
    }
};

module.exports = { verifyAdminToken };
