const redisService = require('./redis.service');

class UserCacheService {
    async addUserToCache(result, token) {
        // 24 hours expiry in seconds
        const ttl = 86400; 
        
        await redisService.addCacheToGroup(
            'user-token',
            token,
            result,
            ttl
        );
    }

    async getUserCache(token) {
        return await redisService.getCacheFromGroup('user-token', token);
    }

    async clearUserCache(tokens) {
        return await redisService.deleteRedisKeys('user-token', tokens);
    }
}

module.exports = new UserCacheService();
