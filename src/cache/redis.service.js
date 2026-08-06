const Redis = require('ioredis');
require('dotenv').config();

class RedisService {
    constructor() {
        const options = {
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
            db: parseInt(process.env.REDIS_DB || '0', 10)
        };
        this.redis = new Redis(options);
        this.prefix = process.env.REDIS_PREFIX || 'expressJsRestApi';
        this.redisAvailable = true;

        this.redis.on('error', (err) => {
            console.error('Redis connection error:', err.message);
            this.redisAvailable = false;
        });
        
        this.redis.on('connect', () => {
            console.log('Redis Connected');
            this.redisAvailable = true;
        });
    }

    getPrefixedKey(key) {
        return `${this.prefix}:${key}`;
    }

    async addCacheToGroup(group, key, value, ttl) {
        if (!this.redisAvailable) return;
        const prefixedKey = this.getPrefixedKey(`${group}:${key}`);
        try {
            await this.redis.set(prefixedKey, JSON.stringify(value));
            if (ttl) {
                await this.redis.expire(prefixedKey, ttl); // ttl in seconds
            }
        } catch (error) {
            console.error('Error setting cache:', error);
        }
    }

    async getCacheFromGroup(group, key) {
        if (!this.redisAvailable) return null;
        const prefixedKey = this.getPrefixedKey(`${group}:${key}`);
        try {
            const data = await this.redis.get(prefixedKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting cache:', error);
            return null;
        }
    }

    async deleteRedisKeys(group, keys) {
        if (!this.redisAvailable) return;
        try {
            const keysToDelete = keys.map(k => this.getPrefixedKey(`${group}:${k}`));
            if (keysToDelete.length > 0) {
                await this.redis.del(...keysToDelete);
            }
        } catch (error) {
            console.error('Error deleting cache:', error);
        }
    }
}

module.exports = new RedisService();
