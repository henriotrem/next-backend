require('dotenv').config()

const redisConfig = {};

redisConfig.host = process.env.REDIS_HOST;
redisConfig.port = process.env.REDIS_PORT;

module.exports = redisConfig;
