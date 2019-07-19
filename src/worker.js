/* eslint-disable no-console, no-unused-vars */
const Queue = require('bull');
const qConfig = require('./queues');
const moment = require('moment-timezone');

// Initialize queue/service
console.log('Connecting To Redis:', process.env.REDIS_URL);
var scheduler = new Queue(qConfig.config.scheduler.name, process.env.REDIS_URL);
var daily = new Queue(qConfig.config.daily.name, process.env.REDIS_URL, {limiter: {max: 10, duration: 1000, bounceBack: false}});


const runProcess = async () => {

    scheduler.process(async (job, done) => {

        const runner = new Queue(job.id, process.env.REDIS_URL);
        const queuedAt = moment(job.timestamp)
        const processedAt = moment(job.processedOn)
        const format = "MMMM Do YYYY, h:mm:ss a";
        const job_count = 500;
        let jobs = 0;

        console.log(' ');
        console.log('account:', job.data.accountId, new Date());
        console.log('job queued at:', queuedAt.format(), queuedAt.tz("America/Los_Angeles").format(format));
        console.log('job processed at:', processedAt.format(), processedAt.tz("America/Los_Angeles").format(format));
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
            jobs--;
            if ( jobs == 0 ) {
                done();
                console.log('Finished Jobs in Runner');
            }
        });

        //simulate having lots of jobs
        for( var i=0; i<job_count; i++){
            let data = {
                accountId: job.data.accountId,
                djob: i,
                oq: processedAt.tz("America/Los_Angeles").format(format)
            };
            // console.log('Daily Job Added', data);
            runner.add(
                data
            ).then((job)=>{
                jobs++;
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
                cron: "*/1 * * * *"
            }
        }
    );
  
};

runProcess();
