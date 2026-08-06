const UserToken = require('../models/user-token.model');
const User = require('../models/user.model');
const userCacheService = require('../cache/user-cache.service');

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

        // 1. Check Redis Cache
        const cachedUser = await userCacheService.getUserCache(token);
        if (cachedUser) {
            if (!cachedUser.isActive) {
                return res.status(403).json({ success: false, message: 'Account is disabled' });
            }
            req.user = cachedUser;
            return next();
        }

        // 2. Fallback to Database
        const userToken = await UserToken.findOne({ token });
        if (!userToken) {
            return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
        }

        const user = await User.findById(userToken.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }

        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Account is disabled' });
        }

        // 3. Save to Cache for next time
        const userToCache = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isActive: user.isActive,
        };
        await userCacheService.addUserToCache(userToCache, token);

        req.user = user;
        next();
    } catch (error) {
        console.error('User Auth error:', error.message);
        return res.status(401).json({ success: false, message: 'Not authorized, token verification failed' });
    }
};

module.exports = { verifyUserToken };
