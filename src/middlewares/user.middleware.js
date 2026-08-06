const UserToken = require('../models/user-token.model');
const User = require('../models/user.model');

const verifyUserToken = async (req, res, next) => {
    try {
        let token;
        
        // Extract token from header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
        }

        // Find the custom token in the database
        const userToken = await UserToken.findOne({ token });
        if (!userToken) {
            return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
        }

        // Fetch the associated user
        const user = await User.findById(userToken.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }

        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Account is disabled' });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('User Auth error:', error.message);
        return res.status(401).json({ success: false, message: 'Not authorized, token verification failed' });
    }
};

module.exports = { verifyUserToken };
