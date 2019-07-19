const url = require('url');

// BULL-ARENA
function getRedisConfig(redisUrl) {
    const redisConfig = url.parse(redisUrl);
    return {
        host: redisConfig.hostname || 'localhost',
        port: Number(redisConfig.port || 6379),
        database: (redisConfig.pathname || '/0').substr(1) || '0',
        password: redisConfig.auth ? redisConfig.auth.split(':')[1] : undefined
    };
}

const scheduler = {
    name: 'scheduler',
    hostId: 'SimBco',
    redis: getRedisConfig(process.env.REDIS_URL)
};

const daily = {
    name: 'daily',
    hostId: 'SimBco',
    redis: getRedisConfig(process.env.REDIS_URL)
};

const runner = {
    name: 'runner',
    hostId: 'SimBco',
    redis: getRedisConfig(process.env.REDIS_URL)
};

module.exports = {
    queues: [ scheduler, daily, runner ]
}