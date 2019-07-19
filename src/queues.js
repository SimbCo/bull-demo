const url = require('url');
const Queue = require('bull');

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
const config = {
    scheduler: {
        name: 'scheduler',
        hostId: 'SimBco',
        redis: getRedisConfig(process.env.REDIS_URL)
    },
    daily: {
        name: 'daily',
        hostId: 'SimBco',
        redis: getRedisConfig(process.env.REDIS_URL)
    },
    runner: {
        name: 'runner',
        hostId: 'SimBco',
        redis: getRedisConfig(process.env.REDIS_URL)
    },
};
// const scheduler = new Queue(config.scheduler);
// const daily = new Queue(config.daily);
// const runner = new Queue(config.runner);

const data = {
    // queues: [ scheduler, daily, runner ],
    // scheduler,
    // daily,
    // runner,
    config
}


module.exports = data;