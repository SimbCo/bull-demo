/* eslint-disable no-console, no-unused-vars */
const Queue = require('bull');
const qConfig = require('./queues');
const moment = require('moment-timezone');
const parser = require('cron-parser');
const scheduleInterval = "*/1 * * * *";

// Initialize queue/service
console.log('Connecting To Redis:', process.env.REDIS_URL);
var scheduler = new Queue(qConfig.config.scheduler.name, process.env.REDIS_URL);
var daily = new Queue(qConfig.config.daily.name, process.env.REDIS_URL, {limiter: {max: 10, duration: 1000, bounceBack: false}});


const runProcess = async () => {

    scheduler.process(async (sJob, done) => {

        const runner = new Queue(sJob.id, process.env.REDIS_URL);
        const interval = parser.parseExpression(scheduleInterval);
        const up_to = interval.prev().toISOString();
        const queuedAt = moment(sJob.timestamp)
        const processedAt = moment(sJob.processedOn)
        const shouldRunAt = moment(up_to);
        const format = "MMMM Do YYYY, h:mm:ss a";
        const job_total = 500;
        let job_count = 0;

        console.log(' ');
        console.log('account:', sJob.data.accountId, new Date());
        console.log('job queued at:', queuedAt.format(), queuedAt.tz("America/Los_Angeles").format(format));
        console.log('job processed at:', processedAt.format(), processedAt.tz("America/Los_Angeles").format(format));
        console.log('job should run at:', shouldRunAt.format(), shouldRunAt.tz("America/Los_Angeles").format(format));
        console.log(' ');

        runner.process(2, async (job, done) => {
            // console.log('processing daily job', job.id, job.data);
            setTimeout(()=>{
                console.log('processing daily job done', job.data);
                done();
            }, 500);
            
            // done();
        }).catch((e) => console.log(e));
    
        runner.on('completed', job => {
            job_count--;
            const progress = Math.ceil(100-(job_count/job_total)*100);
            sJob.progress(progress);
            if ( job_count == 0 ) {
                done();
                console.log('Finished job_count in Runner');
            }
        });

        //simulate having lots of job_count
        for( var i=0; i<job_total; i++){
            let data = {
                accountId: sJob.data.accountId,
                djob: i,
                oq: processedAt.tz("America/Los_Angeles").format(format)
            };
            // console.log('Daily Job Added', data);
            runner.add(
                data
            ).then((job)=>{
                job_count++;
            });
        }
    }).catch((e) => console.log(e));

    // add job to queue
    let jobData = {
        accountId: 10
    };
    console.log('Scheduler Job Added', jobData);
    scheduler.add(
        jobData,
        {
            repeat: {
                cron: scheduleInterval
            }
        }
    );
  
};

runProcess();
