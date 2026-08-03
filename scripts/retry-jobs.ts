import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const conn = new IORedis({ host: 'localhost', port: 6379, maxRetriesPerRequest: null });
const q = new Queue('video-generation', { connection: conn });

const failed = await q.getFailed();
console.log(`Failed jobs: ${failed.length}`);

if (failed.length > 0) {
  const last = failed[failed.length - 1];
  console.log(`Last failed: #${last.id} — "${(last.data?.text ?? '').slice(0, 50)}"`);
  console.log(`Reason: ${last.failedReason?.slice(0, 100)}`);

  // Retry the last failed job
  await last.retry();
  console.log(`Retried #${last.id} — moved back to waiting`);
} else {
  console.log('No failed jobs.');
}

await q.close();
conn.disconnect();
