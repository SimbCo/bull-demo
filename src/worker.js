/* eslint-disable no-console, no-unused-vars */
const Queue = require('bull');
const queues = require('./queues').queues;
// const moment = require('moment-timezone');

// Initialize queue/service
console.log('Connecting To Redis:', process.env.REDIS_URL);
var queue = new Queue('scheduler', process.env.REDIS_URL);

const runProcess = async () => {

    queue.process(async (job) => {

        const queuedAt = moment(job.timestamp)
        const processedAt = moment(job.processedOn)
        const format = "MMMM Do YYYY, h:mm:ss a";

        console.log(' ');
        console.log('account:', job.data.accountId, new Date());
        console.log('job queued at:', queuedAt.format(), queuedAt.tz("America/Los_Angeles").format(format));
        console.log('job processed at:', processedAt.format(), processedAt.tz("America/Los_Angeles").format(format));
        console.log(' ');

        
    }).catch((e) => console.log(e));


    // add job to queue
    let jobData = {
        accountId: 10
    // , interval: account.payout_interval
    };
    console.log('Job Added', jobData);
    queue.add(
        jobData, {
            repeat: {
                cron: "*/1 * * * *"
            }
        }
    );
  
};

runProcess();
