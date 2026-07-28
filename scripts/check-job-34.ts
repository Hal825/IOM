import { Queue } from 'bullmq';

async function main() {
  const queue = new Queue('video-generation', {
    connection: { host: 'localhost', port: 6379, maxRetriesPerRequest: null },
  });
  const job = await queue.getJob('34');
  if (!job) {
    console.log('NOT FOUND');
  } else {
    console.log('State:', await job.getState());
    console.log('Progress:', job.progress);
    console.log('ReturnValue:', JSON.stringify(job.returnvalue));
  }
  await queue.close();
}
main().catch((e) => console.error(e));
