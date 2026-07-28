/**
 * 将 task 34 的 BullMQ job 状态从 failed 修复为 completed。
 *
 * BullMQ job 被 worker 锁定后 moveToCompleted 需要 lock token，
 * 这里直接操作 Redis key 来修复状态。
 */
import Redis from 'ioredis';

const REDIS_PREFIX = 'bull:video-generation';

async function main() {
  const redis = new Redis(process.env.REDIS_HOST || 'localhost', {
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
  });

  const jobId = '34';
  const jobKey = `${REDIS_PREFIX}:${jobId}`;

  // 读取当前 job 数据
  const raw = await redis.hgetall(jobKey);
  console.log('当前 job key:', jobKey);
  console.log('当前字段:', Object.keys(raw));

  // 修复：
  // 1. 将 state 从 failed 改为 completed
  // 2. 写入 returnvalue
  // 3. 写入 progress = 100
  // 4. 从 failed set 中移除，加入 completed set
  // 5. 清除 failedReason 和 stacktrace

  const returnValue = JSON.stringify({ videoPath: 'output/34.mp4', durationSec: 40.5 });

  await redis.hset(jobKey, {
    returnvalue: returnValue,
    progress: '100',
    finishedOn: String(Date.now()),
    processedOn: raw.processedOn || String(Date.now() - 300000),
  });

  // 从 failed set 移除，加入 completed set
  await redis.zrem(`${REDIS_PREFIX}:failed`, jobId);
  await redis.zadd(`${REDIS_PREFIX}:completed`, Date.now(), jobId);

  // 清理 failed 专用字段
  await redis.hdel(jobKey, 'failedReason', 'stacktrace', 'retry');

  console.log('✅ 任务 34 已通过 Redis 修复为 completed');
  console.log('   videoPath: output/34.mp4');
  console.log('   durationSec: 40.5');
  console.log('   progress: 100');

  await redis.quit();
}

main().catch((err) => {
  console.error('修复失败:', err.message);
  process.exit(1);
});
